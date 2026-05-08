import { calculateEntryMetrics, calculatePeriodSummary } from '../services/financeService.js';
import { formatCompactCurrency, formatCurrency, formatDate, formatPercent, formatShortDate } from '../utils/format.js';

export function renderDashboard(state) {
  const summary = calculatePeriodSummary(state.entries, state.period);
  const { totals, entries, daily } = summary;
  const budgetProgress = totals.dailyBudget > 0 ? Math.min((totals.totalRevenue / totals.dailyBudget) * 100, 130) : 0;
  const maxRevenue = Math.max(...entries.map((entry) => entry.foodRevenue + entry.beverageRevenue), 1);
  const maxCost = Math.max(...entries.map((entry) => entry.foodCost + entry.beverageCost + entry.fixedCost), 1);

  return `
    <section class="space-y-6">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        ${kpiCard('Daily Revenue', formatCurrency(daily.revenue), trendLabel(daily.delta), daily.trendDirection)}
        ${kpiCard('MTD Revenue', formatCurrency(totals.totalRevenue), `${entries.length} operating day${entries.length === 1 ? '' : 's'}`, 'neutral')}
        ${kpiCard('Food Revenue', formatCurrency(totals.foodRevenue), contribution(totals.foodRevenue, totals.totalRevenue), 'neutral')}
        ${kpiCard('Beverage Revenue', formatCurrency(totals.beverageRevenue), contribution(totals.beverageRevenue, totals.totalRevenue), 'neutral')}
        ${kpiCard('Food Cost %', formatPercent(totals.foodCostPercent), 'Food cost / food revenue', totals.foodCostPercent <= 35 ? 'up' : 'down')}
        ${kpiCard('Beverage Cost %', formatPercent(totals.beverageCostPercent), 'Beverage cost / beverage revenue', totals.beverageCostPercent <= 28 ? 'up' : 'down')}
        ${kpiCard('Fixed Cost %', formatPercent(totals.fixedCostPercent), 'Fixed cost / total revenue', totals.fixedCostPercent <= 20 ? 'up' : 'down')}
        ${kpiCard('GOP', formatCurrency(totals.gop), 'Revenue minus total costs', totals.gop >= 0 ? 'up' : 'down')}
        ${kpiCard('Budget Variance', formatCurrency(totals.budgetVariance), totals.budgetVariance >= 0 ? 'Ahead of budget' : 'Behind budget', totals.budgetVariance >= 0 ? 'up' : 'down')}
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article class="rounded-[2rem] border border-white/70 bg-white p-6 shadow-card">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm font-bold uppercase tracking-[0.24em] text-copper">Revenue vs Budget</p>
              <h3 class="mt-1 text-2xl font-black text-slate-950">${formatCurrency(totals.totalRevenue)} / ${formatCurrency(totals.dailyBudget)}</h3>
            </div>
            <span class="rounded-full ${totals.budgetVariance >= 0 ? 'bg-emeraldSoft text-emerald-700' : 'bg-rubySoft text-red-700'} px-4 py-2 text-sm font-black">
              ${totals.budgetVariance >= 0 ? '▲' : '▼'} ${formatCurrency(Math.abs(totals.budgetVariance))}
            </span>
          </div>
          <div class="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
            <div class="h-full rounded-full bg-gradient-to-r from-slate-950 via-copper to-champagne" style="width: ${budgetProgress}%"></div>
          </div>
          <div class="mt-6 grid gap-3 sm:grid-cols-3">
            ${miniMetric('Actual', formatCurrency(totals.totalRevenue))}
            ${miniMetric('Budget', formatCurrency(totals.dailyBudget))}
            ${miniMetric('GOP', formatCurrency(totals.gop))}
          </div>
        </article>

        <article class="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-card">
          <p class="text-sm font-bold uppercase tracking-[0.24em] text-champagne">Variance Indicators</p>
          <div class="mt-5 space-y-4">
            ${varianceRow('Revenue', totals.budgetVariance, 'Budget variance')}
            ${varianceRow('GOP', totals.gop, 'Gross operating profit')}
            ${varianceRow('Daily trend', daily.delta, 'Latest day vs previous')}
          </div>
        </article>
      </div>

      <div class="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article class="rounded-[2rem] border border-white/70 bg-white p-6 shadow-card">
          <p class="text-sm font-bold uppercase tracking-[0.24em] text-copper">Cost Trend</p>
          <div class="mt-6 space-y-4">
            ${entries.length ? entries.map((entry) => costBar(entry, maxCost)).join('') : emptyState('No cost trend yet. Add daily entries to populate this widget.')}
          </div>
        </article>

        <article class="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-card">
          <div class="border-b border-slate-100 p-6">
            <p class="text-sm font-bold uppercase tracking-[0.24em] text-copper">Daily Revenue Table</p>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-100 text-sm">
              <thead class="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th class="px-6 py-4">Date</th>
                  <th class="px-6 py-4">Food</th>
                  <th class="px-6 py-4">Beverage</th>
                  <th class="px-6 py-4">Total</th>
                  <th class="px-6 py-4">Budget Var.</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${entries.length ? entries.map((entry) => dailyRow(entry, maxRevenue)).join('') : `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-500">No entries for this period.</td></tr>`}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>`;
}

function kpiCard(label, value, helper, direction) {
  const map = {
    up: ['▲', 'text-emerald-700 bg-emeraldSoft'],
    down: ['▼', 'text-red-700 bg-rubySoft'],
    neutral: ['—', 'text-slate-600 bg-slate-100']
  };
  const [icon, tone] = map[direction] || map.neutral;
  return `
    <article class="rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-premium">
      <div class="flex items-start justify-between gap-4">
        <p class="text-sm font-bold text-slate-500">${label}</p>
        <span class="rounded-full px-2.5 py-1 text-xs font-black ${tone}">${icon}</span>
      </div>
      <p class="mt-4 text-2xl font-black tracking-tight text-slate-950">${value}</p>
      <p class="mt-2 text-xs font-semibold text-slate-500">${helper}</p>
    </article>`;
}

function miniMetric(label, value) {
  return `<div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs font-bold uppercase text-slate-500">${label}</p><p class="mt-1 text-lg font-black">${value}</p></div>`;
}

function varianceRow(label, value, helper) {
  const positive = value >= 0;
  return `<div class="flex items-center justify-between rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><div><p class="font-bold">${label}</p><p class="text-xs text-slate-400">${helper}</p></div><span class="font-black ${positive ? 'text-emerald-300' : 'text-red-300'}">${positive ? '▲' : '▼'} ${formatCurrency(Math.abs(value))}</span></div>`;
}

function costBar(entry, maxCost) {
  const cost = entry.foodCost + entry.beverageCost + entry.fixedCost;
  return `<div><div class="mb-2 flex justify-between text-sm font-bold"><span>${formatShortDate(entry.date)}</span><span>${formatCompactCurrency(cost)}</span></div><div class="h-3 rounded-full bg-slate-100"><div class="h-3 rounded-full bg-gradient-to-r from-red-300 to-copper" style="width: ${(cost / maxCost) * 100}%"></div></div></div>`;
}

function dailyRow(entry, maxRevenue) {
  const metrics = calculateEntryMetrics(entry);
  const positive = metrics.budgetVariance >= 0;
  return `<tr class="hover:bg-slate-50"><td class="px-6 py-4 font-bold">${formatDate(entry.date)}</td><td class="px-6 py-4">${formatCurrency(entry.foodRevenue)}</td><td class="px-6 py-4">${formatCurrency(entry.beverageRevenue)}</td><td class="px-6 py-4"><div class="font-black">${formatCurrency(metrics.totalRevenue)}</div><div class="mt-1 h-1.5 rounded-full bg-slate-100"><div class="h-1.5 rounded-full bg-slate-950" style="width: ${(metrics.totalRevenue / maxRevenue) * 100}%"></div></div></td><td class="px-6 py-4 font-black ${positive ? 'text-emerald-700' : 'text-red-700'}">${positive ? '+' : '-'}${formatCurrency(Math.abs(metrics.budgetVariance))}</td></tr>`;
}

function trendLabel(value) {
  if (value === 0) return 'No prior daily movement';
  return `${value > 0 ? '+' : '-'}${formatCurrency(Math.abs(value))} vs previous day`;
}

function contribution(value, total) {
  return `${formatPercent(total > 0 ? (value / total) * 100 : 0)} of revenue mix`;
}

function emptyState(message) {
  return `<div class="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-semibold text-slate-500">${message}</div>`;
}
