import { create } from 'zustand';

const useNotificationStore = create((set) => ({
    notification: { message: '', type: '' },
    setNotification: (notification) => set({ notification }),
    clearNotification: () => set({ notification: { message: '', type: '' } }),
}));

export default useNotificationStore;