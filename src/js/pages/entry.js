import { calculateEntryMetrics, calculatePeriodSummary } from '../services/financeService.js';
import { toDateInputValue } from '../utils/dates.js';
import { formatCurrency, formatDate, formatPercent } from '../utils/format.js';
import { qs } from '../utils/dom.js';

const FORM_FIELDS = ['foodRevenue', 'beverageRevenue', 'foodCost', 'beverageCost', 'fixedCost', 'dailyBudget'];

export function renderEntry(state) {
  const summary = calculatePeriodSummary(state.entries, state.period);

  return `
    <section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <article class="rounded-[2rem] border border-white/70 bg-white p-6 shadow-card">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.24em] text-copper">Daily Entry</p>
            <h3 id="entry-form-title" class="mt-1 text-2xl font-black text-slate-950">Add finance entry</h3>
          </div>
          <button id="reset-entry-form" type="button" class="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-200">Reset</button>
        </div>

        <form id="entry-form" class="mt-6 space-y-5">
          <input type="hidden" id="entry-id" />
          <div>
            <label for="date" class="text-sm font-bold text-slate-700">Date</label>
            <input id="date" name="date" type="date" required value="${toDateInputValue(state.period.year, state.period.month)}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none ring-champagne/60 transition focus:ring-4" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            ${moneyInput('foodRevenue', 'Food Revenue')}
            ${moneyInput('beverageRevenue', 'Beverage Revenue')}
            ${moneyInput('foodCost', 'Food Cost')}
            ${moneyInput('beverageCost', 'Beverage Cost')}
            ${moneyInput('fixedCost', 'Fixed Cost')}
            ${moneyInput('dailyBudget', 'Daily Budget')}
          </div>
          <button type="submit" class="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-card transition hover:-translate-y-0.5 hover:bg-slate-800">Save Entry</button>
        </form>
      </article>

      <article class="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-card">
        <div class="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.24em] text-copper">Period Entries</p>
            <h3 class="mt-1 text-2xl font-black text-slate-950">${summary.entries.length} saved day${summary.entries.length === 1 ? '' : 's'}</h3>
          </div>
          <p class="text-sm font-bold text-slate-500">MTD revenue ${formatCurrency(summary.totals.totalRevenue)}</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th class="px-6 py-4">Date</th>
                <th class="px-6 py-4">Revenue</th>
                <th class="px-6 py-4">Cost %</th>
                <th class="px-6 py-4">GOP</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${summary.entries.length ? summary.entries.map(entryRow).join('') : `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-500">No saved entries for the selected month.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </section>`;
}

export function bindEntryEvents(appState) {
  const form = qs('#entry-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const entry = { id: qs('#entry-id').value || undefined, date: formData.get('date') };
    FORM_FIELDS.forEach((field) => {
      entry[field] = formData.get(field);
    });
    appState.saveEntry(entry);
  });

  qs('#reset-entry-form').addEventListener('click', () => resetForm(appState));

  document.querySelectorAll('[data-edit-entry]').forEach((button) => {
    button.addEventListener('click', () => {
      const entry = appState.getState().entries.find((candidate) => candidate.id === button.dataset.editEntry);
      if (!entry) return;
      qs('#entry-id').value = entry.id;
      qs('#date').value = entry.date;
      FORM_FIELDS.forEach((field) => {
        qs(`#${field}`).value = entry[field];
      });
      qs('#entry-form-title').textContent = 'Edit finance entry';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-delete-entry]').forEach((button) => {
    button.addEventListener('click', () => {
      const entry = appState.getState().entries.find((candidate) => candidate.id === button.dataset.deleteEntry);
      const label = entry ? formatDate(entry.date) : 'this entry';
      if (window.confirm(`Delete ${label}? This cannot be undone.`)) {
        appState.deleteEntry(button.dataset.deleteEntry);
      }
    });
  });
}

function moneyInput(id, label) {
  return `<div><label for="${id}" class="text-sm font-bold text-slate-700">${label}</label><input id="${id}" name="${id}" type="number" min="0" step="0.01" value="0" required class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none ring-champagne/60 transition focus:ring-4" /></div>`;
}

function entryRow(entry) {
  const metrics = calculateEntryMetrics(entry);
  return `<tr class="hover:bg-slate-50"><td class="px-6 py-4 font-bold">${formatDate(entry.date)}</td><td class="px-6 py-4">${formatCurrency(metrics.totalRevenue)}</td><td class="px-6 py-4"><div>Food ${formatPercent(metrics.foodCostPercent)}</div><div class="text-slate-500">Bev ${formatPercent(metrics.beverageCostPercent)}</div></td><td class="px-6 py-4 font-black ${metrics.gop >= 0 ? 'text-emerald-700' : 'text-red-700'}">${formatCurrency(metrics.gop)}</td><td class="px-6 py-4 text-right"><div class="flex justify-end gap-2"><button type="button" data-edit-entry="${entry.id}" class="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200">Edit</button><button type="button" data-delete-entry="${entry.id}" class="rounded-full bg-rubySoft px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100">Delete</button></div></td></tr>`;
}

function resetForm(appState) {
  const { period } = appState.getState();
  qs('#entry-form').reset();
  qs('#entry-id').value = '';
  qs('#date').value = toDateInputValue(period.year, period.month);
  qs('#entry-form-title').textContent = 'Add finance entry';
}
