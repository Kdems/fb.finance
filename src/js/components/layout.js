import { MONTHS, NAV_ITEMS, RESTAURANT_NAME, YEARS } from '../constants.js';
import { qs, qsa } from '../utils/dom.js';

export function renderShell(state) {
  return `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed,_transparent_34%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)]">
      <aside class="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/60 bg-slate-950 text-white shadow-premium lg:block">
        <div class="flex h-full flex-col p-6">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-champagne">Restaurant</p>
            <h1 class="mt-2 text-3xl font-black tracking-tight">${RESTAURANT_NAME}</h1>
            <p class="mt-2 text-sm text-slate-300">Finance Dashboard</p>
          </div>
          <nav class="mt-8 space-y-2" aria-label="Primary navigation">
            ${NAV_ITEMS.map((item) => navButton(item, state.activePage)).join('')}
          </nav>
          <div class="mt-auto rounded-3xl bg-gradient-to-br from-champagne/20 to-white/5 p-5 text-sm text-slate-200">
            <p class="font-semibold text-champagne">Phase 1 foundation</p>
            <p class="mt-2 leading-6">Local-first entries, month filters, KPI calculations, and clean upgrade path for a database API.</p>
          </div>
        </div>
      </aside>

      <div class="lg:pl-72">
        <header class="sticky top-0 z-20 border-b border-white/70 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
          <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.3em] text-copper">${RESTAURANT_NAME}</p>
              <h2 class="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Executive Finance Command Center</h2>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label class="sr-only" for="year-select">Year</label>
              <select id="year-select" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm outline-none ring-champagne/60 transition focus:ring-4">
                ${YEARS.map((year) => `<option value="${year}" ${Number(state.period.year) === year ? 'selected' : ''}>${year}</option>`).join('')}
              </select>
              <label class="sr-only" for="month-select">Month</label>
              <select id="month-select" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm outline-none ring-champagne/60 transition focus:ring-4">
                ${MONTHS.map((month) => `<option value="${month.value}" ${Number(state.period.month) === month.value ? 'selected' : ''}>${month.label}</option>`).join('')}
              </select>
            </div>
          </div>
          <nav class="mt-4 flex gap-2 overflow-x-auto lg:hidden" aria-label="Mobile navigation">
            ${NAV_ITEMS.map((item) => navButton(item, state.activePage, true)).join('')}
          </nav>
        </header>
        <main id="page" class="px-4 py-6 sm:px-6 lg:px-8"></main>
      </div>
    </div>`;
}

function navButton(item, activePage, compact = false) {
  const isActive = item.id === activePage;
  return `
    <button
      type="button"
      data-nav-id="${item.id}"
      class="${compact ? 'shrink-0' : 'w-full'} rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${isActive ? 'bg-champagne text-slate-950 shadow-card' : 'text-slate-300 hover:bg-white/10 hover:text-white'}"
    >
      <span class="mr-2" aria-hidden="true">${item.icon}</span>${item.label}
    </button>`;
}

export function bindLayoutEvents(appState) {
  qs('#year-select').addEventListener('change', (event) => {
    appState.setPeriod({ year: Number(event.target.value) });
  });

  qs('#month-select').addEventListener('change', (event) => {
    appState.setPeriod({ month: Number(event.target.value) });
  });

  qsa('[data-nav-id]').forEach((button) => {
    button.addEventListener('click', () => appState.setActivePage(button.dataset.navId));
  });
}
