import { create } from 'zustand';
import LogService from '../database/datamapper/LogHelper';

const useLogStore = create((set) => ({
  logs: [],
  loading: false,
  error: null,

  fetchLogs: async () => {
    try {
      set({ loading: true, error: null });
      const allLogs = await LogService.getAllLogs();
      const sortedLogs = allLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      set({ logs: sortedLogs });
    } catch (error) {
      set({ error: error.message });
      console.error('Error fetching logs:', error);
    } finally {
      set({ loading: false });
    }
  },

  setLogs: (newLogs) => {
    const sortedLogs = newLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    set({ logs: sortedLogs });
  },


}));

// Subscribe to LogService updates
LogService.subscribe((updatedLogs) => {
  useLogStore.getState().setLogs(updatedLogs);
});

export default useLogStore; 