(function bootstrapSkybar(global) {
  'use strict';

  const dataPath = 'data/finance-data.json';
  const defaultFilters = { month: 'all', year: 'all' };

  async function loadFinanceData() {
    const response = await fetch(dataPath);
    if (!response.ok) {
      throw new Error(`Unable to load finance data: ${response.status}`);
    }
    return response.json();
  }

  function setActiveNav() {
    const current = global.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === current);
    });
  }

  function initializeDashboard(records) {
    const monthFilter = document.getElementById('monthFilter');
    const yearFilter = document.getElementById('yearFilter');
    const resetButton = document.getElementById('resetFilters');
    const savedFilters = global.SkybarStorage.read('filters', defaultFilters);
    const periods = global.SkybarFilters.uniquePeriods(records);

    global.SkybarFilters.populateSelect(monthFilter, periods.months, 'All months', (month) => global.SkybarFilters.monthNames[month - 1]);
    global.SkybarFilters.populateSelect(yearFilter, periods.years, 'All years');

    monthFilter.value = savedFilters.month;
    yearFilter.value = savedFilters.year;

    const currentFilters = () => ({ month: monthFilter.value, year: yearFilter.value });
    const render = () => {
      const filters = currentFilters();
      global.SkybarStorage.write('filters', filters);
      global.SkybarDashboard.render(records, filters);
    };

    monthFilter.addEventListener('change', render);
    yearFilter.addEventListener('change', render);
    resetButton.addEventListener('click', () => {
      monthFilter.value = defaultFilters.month;
      yearFilter.value = defaultFilters.year;
      render();
    });

    render();
  }

  async function init() {
    setActiveNav();
    if (document.body.dataset.page !== 'dashboard') return;

    try {
      const payload = await loadFinanceData();
      initializeDashboard(payload.records);
    } catch (error) {
      console.error(error);
      const alerts = document.getElementById('financeAlerts');
      if (alerts) alerts.innerHTML = '<div class="alert-item">Finance data could not be loaded. Confirm the local preview server is running.</div>';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
