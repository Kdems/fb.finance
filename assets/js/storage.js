(function exposeStorage(global) {
  'use strict';

  const storageKey = 'skybar.finance.dashboard.entries.v1';

  function safeParse(value) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Unable to parse saved SKYBAR entries:', error);
      return [];
    }
  }

  function loadEntries() {
    return safeParse(global.localStorage.getItem(storageKey)).sort((a, b) => a.date.localeCompare(b.date));
  }

  function persist(entries) {
    global.localStorage.setItem(storageKey, JSON.stringify(entries));
    return entries;
  }

  function saveEntry(entry, originalDate = '') {
    const normalized = global.SkybarCalculations.normalizeEntry(entry);
    if (!normalized.date) {
      return { ok: false, message: 'Date is required before saving an entry.', entries: loadEntries() };
    }

    const entries = loadEntries();
    const duplicate = entries.find((item) => item.date === normalized.date && item.date !== originalDate);
    if (duplicate) {
      return { ok: false, message: `An entry already exists for ${normalized.date}. Edit the existing row instead.`, entries };
    }

    const filtered = originalDate ? entries.filter((item) => item.date !== originalDate) : entries;
    const nextEntries = [...filtered, normalized].sort((a, b) => a.date.localeCompare(b.date));
    persist(nextEntries);
    return { ok: true, message: originalDate ? 'Entry updated.' : 'Entry saved.', entries: nextEntries };
  }

  function deleteEntry(date) {
    const entries = loadEntries();
    const nextEntries = entries.filter((entry) => entry.date !== date);
    persist(nextEntries);
    return { ok: nextEntries.length !== entries.length, entries: nextEntries };
  }

  function findEntry(date) {
    return loadEntries().find((entry) => entry.date === date) || null;
  }

  function clearEntries() {
    global.localStorage.removeItem(storageKey);
  }

  global.SkybarStorage = { clearEntries, deleteEntry, findEntry, loadEntries, saveEntry };
})(window);
