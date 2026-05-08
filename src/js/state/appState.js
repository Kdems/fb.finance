import { getInitialPeriod } from '../utils/dates.js';
import { createEntryRepository } from '../services/storageService.js';
import { deleteEntry, upsertEntry } from '../services/financeService.js';

export function createAppState(repository = createEntryRepository()) {
  let state = {
    activePage: 'dashboard',
    period: getInitialPeriod(),
    entries: repository.getAll()
  };

  const listeners = new Set();

  function emit() {
    listeners.forEach((listener) => listener(getState()));
  }

  function persistEntries(entries) {
    repository.saveAll(entries);
  }

  function getState() {
    return structuredClone(state);
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      listener(getState());
      return () => listeners.delete(listener);
    },
    getState,
    setActivePage(activePage) {
      state = { ...state, activePage };
      emit();
    },
    setPeriod(period) {
      state = { ...state, period: { ...state.period, ...period } };
      emit();
    },
    saveEntry(entry) {
      const entries = upsertEntry(state.entries, entry);
      persistEntries(entries);
      state = { ...state, entries };
      emit();
    },
    deleteEntry(entryId) {
      const entries = deleteEntry(state.entries, entryId);
      persistEntries(entries);
      state = { ...state, entries };
      emit();
    }
  };
}
