import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const SettingsAdminPage = () => {
    const [config, setConfig] = useState({ autoCloseEnabled: false, confidenceThreshold: 0.75 });
    const [loading, setLoading] = useState(true);
    const token = useAuthStore((state) => state.token);
    const setNotification = useNotificationStore((state) => state.setNotification);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const authConfig = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:8080/api/config', authConfig);
                setConfig(data);
            } catch (error) {
                console.error(error);
                setNotification({ message: 'Failed to load settings.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [token, setNotification]);

    const handleSave = async () => {
        try {
            const authConfig = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put('http://localhost:8080/api/config', config, authConfig);
            setNotification({ message: 'Settings saved successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Failed to save settings.', type: 'error' });
        }
    };
    
    if (loading) return <p>Loading settings...</p>;

    return (
        <div>
            <h2>Agent Settings</h2>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={config.autoCloseEnabled}
                        onChange={(e) => setConfig({ ...config, autoCloseEnabled: e.target.checked })}
                    />
                    Enable Auto-Close
                </label>
            </div>
            <div>
                <label>
                    Confidence Threshold: {config.confidenceThreshold}
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={config.confidenceThreshold}
                        onChange={(e) => setConfig({ ...config, confidenceThreshold: parseFloat(e.target.value) })}
                    />
                </label>
            </div>
            <button onClick={handleSave}>Save Settings</button>
        </div>
    );
};

export default SettingsAdminPage;