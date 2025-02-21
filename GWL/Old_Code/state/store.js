import create from 'zustand';
import { storage } from './storage';
import { upsertRegal, upsertArtikel, addLog, reset } from './actions';
import { removeArtikel, removeRegal, clearLogs } from './actions';

// Helper functions for persisting data
const getPersistedState = (key) => {
  const data = storage.getString(key);
  return data ? JSON.parse(data) : key === 'logs' ? [] : {};
};

// Zustand store
const useStore = create((set, get) => ({
  regale: getPersistedState('regale'),
  artikel: getPersistedState('artikel'),
  logs: getPersistedState('logs'),

  upsertRegal: (regal) => upsertRegal(set, get, regal),
  upsertArtikel: (artikel) => upsertArtikel(set, get, artikel),
  addLog: (log) => addLog(set, get, log),
  reset: () => reset(set),

  removeArtikel: (gw_id) => removeArtikel(set, get, gw_id),
  removeRegal: (regal_id) => removeRegal(set, get, regal_id),
  clearLogs: () => clearLogs(set),
}));

export default useStore;
