(function exposeStorage(global) {
  'use strict';

  const namespace = 'skybar.finance.dashboard';

  function read(key, fallback = null) {
    try {
      const value = global.localStorage.getItem(`${namespace}.${key}`);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn('Storage read failed:', error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      global.localStorage.setItem(`${namespace}.${key}`, JSON.stringify(value));
    } catch (error) {
      console.warn('Storage write failed:', error);
    }
  }

  function remove(key) {
    global.localStorage.removeItem(`${namespace}.${key}`);
  }

  global.SkybarStorage = { read, remove, write };
})(window);
