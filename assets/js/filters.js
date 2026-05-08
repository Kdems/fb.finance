(function exposeFilters(global) {
  'use strict';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function uniquePeriods(rows) {
    const years = [...new Set(rows.map((row) => row.year))].sort((a, b) => b - a);
    const months = [...new Set(rows.map((row) => row.month))].sort((a, b) => a - b);
    return { months, years };
  }

  function apply(rows, filters) {
    return rows.filter((row) => {
      const monthMatch = filters.month === 'all' || Number(filters.month) === row.month;
      const yearMatch = filters.year === 'all' || Number(filters.year) === row.year;
      return monthMatch && yearMatch;
    });
  }

  function label(filters) {
    const month = filters.month === 'all' ? 'All months' : monthNames[Number(filters.month) - 1];
    const year = filters.year === 'all' ? 'All years' : filters.year;
    return `${month} · ${year}`;
  }

  function populateSelect(select, values, allLabel, formatter = (value) => value) {
    select.innerHTML = '';
    select.append(new Option(allLabel, 'all'));
    values.forEach((value) => select.append(new Option(formatter(value), value)));
  }

  global.SkybarFilters = { apply, label, monthNames, populateSelect, uniquePeriods };
})(window);
