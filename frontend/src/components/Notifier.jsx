import React, { useEffect } from 'react';
import useNotificationStore from '../store/notificationStore';

const Notifier = () => {
    const { notification, clearNotification } = useNotificationStore();

    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                clearNotification();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, clearNotification]);

    if (!notification.message) return null;

    const baseClasses = 'fixed top-5 right-5 p-4 rounded-md shadow-lg text-white z-50';
    const typeClasses = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return <div className={`${baseClasses} ${typeClasses}`}>{notification.message}</div>;
};

export default Notifier;