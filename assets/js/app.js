(function bootstrapSkybar(global) {
  'use strict';

  const storage = global.SkybarStorage;
  const filters = global.SkybarFilters;
  const dashboard = global.SkybarDashboard;
  const calculations = global.SkybarCalculations;

  const fields = {
    editingDate: 'editingDate',
    date: 'entryDate',
    foodRevenue: 'foodRevenue',
    beverageRevenue: 'beverageRevenue',
    foodCost: 'foodCost',
    beverageCost: 'beverageCost',
    fixedCost: 'fixedCost',
    dailyBudget: 'dailyBudget',
  };

  function element(id) {
    return document.getElementById(id);
  }

  function setActiveNav() {
    const current = global.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === current);
    });
  }

  function getSelectedPeriod() {
    return {
      year: element('yearFilter').value,
      month: element('monthFilter').value,
    };
  }

  function getVisibleEntries() {
    const { year, month } = getSelectedPeriod();
    return filters.filterByPeriod(storage.loadEntries(), year, month);
  }

  function getPreviousPeriodEntries() {
    const { year, month } = getSelectedPeriod();
    const previous = filters.previousPeriod(year, month);
    return filters.filterByPeriod(storage.loadEntries(), previous.year, previous.month);
  }

  function refreshDashboard(message = '', type = 'info') {
    dashboard.render(getVisibleEntries(), { previousEntries: getPreviousPeriodEntries() });
    dashboard.showMessage(message, type);
  }

  function resetForm() {
    element(fields.editingDate).value = '';
    element('entryForm').reset();
    element('entryPanelTitle').textContent = 'New daily finance entry';
    element('entryModePill').textContent = 'Create';
    const { year, month } = getSelectedPeriod();
    element(fields.date).value = `${year}-${month}-01`;
  }

  function readForm() {
    return {
      date: element(fields.date).value,
      foodRevenue: element(fields.foodRevenue).value,
      beverageRevenue: element(fields.beverageRevenue).value,
      foodCost: element(fields.foodCost).value,
      beverageCost: element(fields.beverageCost).value,
      fixedCost: element(fields.fixedCost).value,
      dailyBudget: element(fields.dailyBudget).value,
    };
  }

  function fillForm(entry) {
    const calculated = calculations.calculateEntry(entry);
    element(fields.editingDate).value = calculated.date;
    element(fields.date).value = calculated.date;
    element(fields.foodRevenue).value = calculated.foodRevenue;
    element(fields.beverageRevenue).value = calculated.beverageRevenue;
    element(fields.foodCost).value = calculated.foodCost;
    element(fields.beverageCost).value = calculated.beverageCost;
    element(fields.fixedCost).value = calculated.fixedCost;
    element(fields.dailyBudget).value = calculated.dailyBudget;
    element('entryPanelTitle').textContent = `Editing ${calculated.date}`;
    element('entryModePill').textContent = 'Edit';
  }

  function alignFiltersToDate(dateString) {
    const period = filters.periodFromDate(dateString);
    if (period.year && period.month) {
      element('yearFilter').value = period.year;
      element('monthFilter').value = period.month;
    }
  }

  function handleSave(event) {
    event.preventDefault();
    const entry = readForm();
    const originalDate = element(fields.editingDate).value;
    const result = storage.saveEntry(entry, originalDate);

    if (!result.ok) {
      refreshDashboard(result.message, 'danger');
      return;
    }

    alignFiltersToDate(entry.date);
    resetForm();
    refreshDashboard(result.message, 'success');
  }

  function handleTableClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const { action, date } = button.dataset;

    if (action === 'edit') {
      const entry = storage.findEntry(date);
      if (entry) {
        alignFiltersToDate(date);
        fillForm(entry);
        refreshDashboard(`Editing entry for ${date}.`, 'info');
      }
    }

    if (action === 'delete') {
      const result = storage.deleteEntry(date);
      resetForm();
      refreshDashboard(result.ok ? `Deleted entry for ${date}.` : `No entry found for ${date}.`, result.ok ? 'success' : 'danger');
    }
  }

  function initializeDashboard() {
    const yearFilter = element('yearFilter');
    const monthFilter = element('monthFilter');
    filters.populateYearSelect(yearFilter, 2025, 2040);
    filters.populateMonthSelect(monthFilter);
    filters.setCurrentPeriod(yearFilter, monthFilter);
    filters.bindFilterRefresh(yearFilter, monthFilter, () => {
      resetForm();
      refreshDashboard();
    });

    element('entryForm').addEventListener('submit', handleSave);
    element('resetForm').addEventListener('click', () => {
      resetForm();
      refreshDashboard('Form reset.', 'info');
    });
    element('entriesTableBody').addEventListener('click', handleTableClick);

    resetForm();
    refreshDashboard();
  }

  function init() {
    setActiveNav();
    if (document.body.dataset.page === 'dashboard') initializeDashboard();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
