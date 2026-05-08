(function exposeFilters(global) {
  'use strict';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  function populateYearSelect(select, startYear = 2025, endYear = 2040) {
    select.innerHTML = '';
    for (let year = startYear; year <= endYear; year += 1) {
      select.append(new Option(String(year), String(year)));
    }
  }

  function populateMonthSelect(select) {
    select.innerHTML = '';
    monthNames.forEach((month, index) => {
      select.append(new Option(month, String(index + 1).padStart(2, '0')));
    });
  }

  function filterByPeriod(entries, year, month) {
    return entries.filter((entry) => {
      if (!entry.date) return false;
      const [entryYear, entryMonth] = entry.date.split('-');
      return entryYear === String(year) && entryMonth === String(month).padStart(2, '0');
    });
  }


  function previousPeriod(year, month) {
    const currentYear = Number.parseInt(year, 10);
    const currentMonth = Number.parseInt(month, 10);
    if (currentMonth === 1) {
      return { year: String(currentYear - 1), month: '12' };
    }
    return { year: String(currentYear), month: String(currentMonth - 1).padStart(2, '0') };
  }

  function periodFromDate(dateString) {
    const [year, month] = String(dateString || '').split('-');
    return { year, month };
  }

  function setCurrentPeriod(yearSelect, monthSelect, date = new Date()) {
    const year = Math.min(Math.max(date.getFullYear(), 2025), 2040);
    yearSelect.value = String(year);
    monthSelect.value = String(date.getMonth() + 1).padStart(2, '0');
  }

  function bindFilterRefresh(yearSelect, monthSelect, callback) {
    yearSelect.addEventListener('change', callback);
    monthSelect.addEventListener('change', callback);
  }

  global.SkybarFilters = {
    bindFilterRefresh,
    filterByPeriod,
    monthNames,
    periodFromDate,
    previousPeriod,
    populateMonthSelect,
    populateYearSelect,
    setCurrentPeriod,
  };
})(window);
