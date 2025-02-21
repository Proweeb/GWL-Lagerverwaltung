import { storage } from '../storage/storage';

export const persistState = (key, state) => storage.set(key, JSON.stringify(state));

export const getPersistedState = (key) => {
  const data = storage.getString(key);
  return data ? JSON.parse(data) : key === 'logs' ? [] : {};
};
