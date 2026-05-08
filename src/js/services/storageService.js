import { STORAGE_KEY } from '../constants.js';

export function createEntryRepository(storage = window.localStorage) {
  return {
    getAll() {
      try {
        const payload = storage.getItem(STORAGE_KEY);
        return payload ? JSON.parse(payload) : [];
      } catch (error) {
        console.warn('Unable to read finance entries from storage.', error);
        return [];
      }
    },
    saveAll(entries) {
      storage.setItem(STORAGE_KEY, JSON.stringify(entries));
    },
    clear() {
      storage.removeItem(STORAGE_KEY);
    }
  };
}
