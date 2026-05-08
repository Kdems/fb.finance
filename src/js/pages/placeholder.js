import { calculatePeriodSummary } from '../services/financeService.js';
import { formatCurrency, formatPercent } from '../utils/format.js';

export function renderAnalytics(state) {
  const { totals, entries } = calculatePeriodSummary(state.entries, state.period);
  return renderFoundationPage({
    eyebrow: 'Analytics',
    title: 'Phase 1 analytics foundation',
    description: 'Advanced charts will build on the same validated local data model. The foundation already exposes revenue mix, cost ratios, GOP, and variance calculations for the selected period.',
    cards: [
      ['Revenue mix', `${formatPercent(totals.totalRevenue ? (totals.foodRevenue / totals.totalRevenue) * 100 : 0)} food / ${formatPercent(totals.totalRevenue ? (totals.beverageRevenue / totals.totalRevenue) * 100 : 0)} beverage`],
      ['Average daily revenue', formatCurrency(entries.length ? totals.totalRevenue / entries.length : 0)],
      ['Blended cost load', formatPercent(totals.totalRevenue ? (totals.totalCosts / totals.totalRevenue) * 100 : 0)]
    ]
  });
}

export function renderReports(state) {
  const { totals } = calculatePeriodSummary(state.entries, state.period);
  return renderFoundationPage({
    eyebrow: 'Reports',
    title: 'Management reporting ready',
    description: 'Phase 1 keeps reporting deterministic: every report figure is sourced from saved daily entries and the same finance calculation service used by the dashboard.',
    cards: [
      ['MTD actual', formatCurrency(totals.totalRevenue)],
      ['MTD budget', formatCurrency(totals.dailyBudget)],
      ['Budget variance', formatCurrency(totals.budgetVariance)]
    ]
  });
}

export function renderSettings() {
  return renderFoundationPage({
    eyebrow: 'Settings',
    title: 'Local-first configuration',
    description: 'Data is persisted in browser local storage through a repository layer, keeping the app fast today and ready to swap in a database-backed API later.',
    cards: [
      ['Outlet', 'SKYBAR'],
      ['Storage', 'Local storage repository'],
      ['Database path', 'Service layer prepared']
    ]
  });
}

function renderFoundationPage({ eyebrow, title, description, cards }) {
  return `
    <section class="space-y-6">
      <article class="rounded-[2rem] border border-white/70 bg-white p-8 shadow-card">
        <p class="text-sm font-bold uppercase tracking-[0.24em] text-copper">${eyebrow}</p>
        <h3 class="mt-2 text-3xl font-black text-slate-950">${title}</h3>
        <p class="mt-3 max-w-3xl text-base leading-7 text-slate-600">${description}</p>
      </article>
      <div class="grid gap-4 md:grid-cols-3">
        ${cards.map(([label, value]) => `<article class="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-card"><p class="text-sm font-bold text-slate-500">${label}</p><p class="mt-3 text-xl font-black text-slate-950">${value}</p></article>`).join('')}
      </div>
    </section>`;
}
