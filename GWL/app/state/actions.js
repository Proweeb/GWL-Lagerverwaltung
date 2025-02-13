import { persistState } from './persist';

export const upsertRegal = (set, get, regal) => {
  const updated = { ...get().regale, [regal.regal_id]: regal };
  set({ regale: updated });
  persistState('regale', updated);
};

export const upsertArtikel = (set, get, artikel) => {
  const updated = { ...get().artikel, [artikel.gw_id]: artikel };
  set({ artikel: updated });
  persistState('artikel', updated);
};

export const addLog = (set, get, log) => {
  const updated = [...get().logs, log];
  set({ logs: updated });
  persistState('logs', updated);
};

export const reset = (set) => {
  const emptyDict = {};
  const emptyArray = [];
  set({ regale: emptyDict, artikel: emptyDict, logs: emptyArray });
  persistState('regale', emptyDict);
  persistState('artikel', emptyDict);
  persistState('logs', emptyArray);
};

export const removeArtikel = (gw_id) => {
  const updated = { ...get().artikel };
  delete updated[gw_id];
  set({ artikel: updated });
  persistState('artikel', updated);
};

export const removeRegal = (regal_id) => {
  const updated = { ...get().regale };
  delete updated[regal_id];
  set({ regale: updated });
  persistState('regale', updated);
};

export const clearLogs = () => {
  set({ logs: [] });
  persistState('logs', []);
;}
