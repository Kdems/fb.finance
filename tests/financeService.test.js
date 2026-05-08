import assert from 'node:assert/strict';
import {
  calculateEntryMetrics,
  calculatePeriodSummary,
  deleteEntry,
  filterEntriesByPeriod,
  safePercent,
  upsertEntry
} from '../src/js/services/financeService.js';

const entries = [
  {
    id: '1',
    date: '2026-05-01',
    foodRevenue: 1000,
    beverageRevenue: 500,
    foodCost: 300,
    beverageCost: 100,
    fixedCost: 200,
    dailyBudget: 1400
  },
  {
    id: '2',
    date: '2026-05-02',
    foodRevenue: 1200,
    beverageRevenue: 800,
    foodCost: 360,
    beverageCost: 160,
    fixedCost: 250,
    dailyBudget: 2100
  },
  {
    id: '3',
    date: '2026-06-01',
    foodRevenue: 999,
    beverageRevenue: 1,
    foodCost: 1,
    beverageCost: 1,
    fixedCost: 1,
    dailyBudget: 1
  }
];

assert.equal(safePercent(25, 100), 25);
assert.equal(safePercent(25, 0), 0);

const entryMetrics = calculateEntryMetrics(entries[0]);
assert.equal(entryMetrics.totalRevenue, 1500);
assert.equal(entryMetrics.totalCosts, 600);
assert.equal(entryMetrics.gop, 900);
assert.equal(entryMetrics.budgetVariance, 100);
assert.equal(entryMetrics.foodCostPercent, 30);
assert.equal(entryMetrics.beverageCostPercent, 20);
assert.equal(Math.round(entryMetrics.fixedCostPercent * 100) / 100, 13.33);

const filtered = filterEntriesByPeriod(entries, { year: 2026, month: 4 });
assert.deepEqual(filtered.map((entry) => entry.id), ['1', '2']);

const summary = calculatePeriodSummary(entries, { year: 2026, month: 4 });
assert.equal(summary.totals.foodRevenue, 2200);
assert.equal(summary.totals.beverageRevenue, 1300);
assert.equal(summary.totals.totalRevenue, 3500);
assert.equal(summary.totals.totalCosts, 1370);
assert.equal(summary.totals.gop, 2130);
assert.equal(summary.totals.budgetVariance, 0);
assert.equal(summary.daily.revenue, 2000);
assert.equal(summary.daily.delta, 500);
assert.equal(summary.daily.trendDirection, 'up');

const updated = upsertEntry(entries, { ...entries[0], foodRevenue: 1500 });
assert.equal(updated.length, 3);
assert.equal(updated.find((entry) => entry.id === '1').foodRevenue, 1500);

const inserted = upsertEntry(entries, {
  id: '4',
  date: '2026-05-03',
  foodRevenue: '2.349',
  beverageRevenue: 0,
  foodCost: -1,
  beverageCost: 0,
  fixedCost: 0,
  dailyBudget: 0
});
assert.equal(inserted.length, 4);
assert.equal(inserted.find((entry) => entry.id === '4').foodRevenue, 2.35);
assert.equal(inserted.find((entry) => entry.id === '4').foodCost, 0);

assert.equal(deleteEntry(entries, '2').length, 2);

console.log('financeService tests passed');
