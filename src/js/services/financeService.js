import { isEntryInPeriod } from '../utils/dates.js';

const MONEY_FIELDS = [
  'foodRevenue',
  'beverageRevenue',
  'foodCost',
  'beverageCost',
  'fixedCost',
  'dailyBudget'
];

export function toMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 100) / 100 : 0;
}

export function normalizeEntry(entry) {
  const normalized = {
    id: entry.id || crypto.randomUUID(),
    date: entry.date,
    createdAt: entry.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  MONEY_FIELDS.forEach((field) => {
    normalized[field] = toMoney(entry[field]);
  });

  return normalized;
}

export function getEntryTotalRevenue(entry) {
  return toMoney(entry.foodRevenue) + toMoney(entry.beverageRevenue);
}

export function getEntryTotalCosts(entry) {
  return toMoney(entry.foodCost) + toMoney(entry.beverageCost) + toMoney(entry.fixedCost);
}

export function safePercent(numerator, denominator) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

export function calculateEntryMetrics(entry) {
  const totalRevenue = getEntryTotalRevenue(entry);
  const totalCosts = getEntryTotalCosts(entry);
  const gop = totalRevenue - totalCosts;
  const budgetVariance = totalRevenue - toMoney(entry.dailyBudget);

  return {
    totalRevenue,
    totalCosts,
    gop,
    budgetVariance,
    foodCostPercent: safePercent(toMoney(entry.foodCost), toMoney(entry.foodRevenue)),
    beverageCostPercent: safePercent(toMoney(entry.beverageCost), toMoney(entry.beverageRevenue)),
    fixedCostPercent: safePercent(toMoney(entry.fixedCost), totalRevenue)
  };
}

export function filterEntriesByPeriod(entries, period) {
  return entries
    .filter((entry) => entry.date && isEntryInPeriod(entry, period))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculatePeriodSummary(entries, period) {
  const periodEntries = filterEntriesByPeriod(entries, period);
  const totals = periodEntries.reduce(
    (summary, entry) => {
      summary.foodRevenue += toMoney(entry.foodRevenue);
      summary.beverageRevenue += toMoney(entry.beverageRevenue);
      summary.foodCost += toMoney(entry.foodCost);
      summary.beverageCost += toMoney(entry.beverageCost);
      summary.fixedCost += toMoney(entry.fixedCost);
      summary.dailyBudget += toMoney(entry.dailyBudget);
      return summary;
    },
    {
      foodRevenue: 0,
      beverageRevenue: 0,
      foodCost: 0,
      beverageCost: 0,
      fixedCost: 0,
      dailyBudget: 0
    }
  );

  const totalRevenue = totals.foodRevenue + totals.beverageRevenue;
  const totalCosts = totals.foodCost + totals.beverageCost + totals.fixedCost;
  const latestEntry = periodEntries.at(-1) || null;
  const previousEntry = periodEntries.at(-2) || null;
  const latestRevenue = latestEntry ? getEntryTotalRevenue(latestEntry) : 0;
  const previousRevenue = previousEntry ? getEntryTotalRevenue(previousEntry) : 0;

  return {
    entries: periodEntries,
    totals: {
      ...totals,
      totalRevenue,
      totalCosts,
      gop: totalRevenue - totalCosts,
      budgetVariance: totalRevenue - totals.dailyBudget,
      foodCostPercent: safePercent(totals.foodCost, totals.foodRevenue),
      beverageCostPercent: safePercent(totals.beverageCost, totals.beverageRevenue),
      fixedCostPercent: safePercent(totals.fixedCost, totalRevenue)
    },
    daily: {
      latestEntry,
      previousEntry,
      revenue: latestRevenue,
      delta: latestRevenue - previousRevenue,
      trendDirection: latestRevenue >= previousRevenue ? 'up' : 'down'
    }
  };
}

export function upsertEntry(entries, rawEntry) {
  const entry = normalizeEntry(rawEntry);
  const existingIndex = entries.findIndex((candidate) => candidate.id === entry.id);

  if (existingIndex >= 0) {
    return entries.map((candidate, index) => (index === existingIndex ? entry : candidate));
  }

  return [...entries, entry];
}

export function deleteEntry(entries, entryId) {
  return entries.filter((entry) => entry.id !== entryId);
}
