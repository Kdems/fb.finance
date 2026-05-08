(function exposeCalculations(global) {
  'use strict';

  const round = (value, decimals = 2) => {
    const factor = 10 ** decimals;
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  };

  const number = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const dividePercent = (numerator, denominator) => {
    const base = number(denominator);
    if (base === 0) return 0;
    return round((number(numerator) / base) * 100, 1);
  };

  const currency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(round(number(value), 0));

  const percent = (value) => `${round(number(value), 1).toFixed(1)}%`;

  function normalizeEntry(rawEntry) {
    return {
      date: String(rawEntry.date || ''),
      foodRevenue: round(number(rawEntry.foodRevenue)),
      beverageRevenue: round(number(rawEntry.beverageRevenue)),
      foodCost: round(number(rawEntry.foodCost)),
      beverageCost: round(number(rawEntry.beverageCost)),
      fixedCost: round(number(rawEntry.fixedCost)),
      dailyBudget: round(number(rawEntry.dailyBudget)),
    };
  }

  function calculateEntry(rawEntry) {
    const entry = normalizeEntry(rawEntry);
    const totalRevenue = round(entry.foodRevenue + entry.beverageRevenue);
    const totalCost = round(entry.foodCost + entry.beverageCost + entry.fixedCost);
    const gop = round(totalRevenue - totalCost);
    const budgetVariance = round(totalRevenue - entry.dailyBudget);

    return {
      ...entry,
      totalRevenue,
      totalCost,
      foodCostPercent: dividePercent(entry.foodCost, entry.foodRevenue),
      beverageCostPercent: dividePercent(entry.beverageCost, entry.beverageRevenue),
      fixedCostPercent: dividePercent(entry.fixedCost, totalRevenue),
      gop,
      gopMargin: dividePercent(gop, totalRevenue),
      budgetVariance,
      budgetVariancePercent: dividePercent(budgetVariance, entry.dailyBudget),
      targetAchievementPercent: dividePercent(totalRevenue, entry.dailyBudget),
    };
  }

  function emptyTotals() {
    return {
      foodRevenue: 0,
      beverageRevenue: 0,
      foodCost: 0,
      beverageCost: 0,
      fixedCost: 0,
      dailyBudget: 0,
      totalRevenue: 0,
      totalCost: 0,
      gop: 0,
      budgetVariance: 0,
    };
  }

  function summarizeEntries(entries) {
    const calculatedEntries = entries.map(calculateEntry).sort((a, b) => a.date.localeCompare(b.date));
    const totals = calculatedEntries.reduce((summary, entry) => {
      summary.foodRevenue += entry.foodRevenue;
      summary.beverageRevenue += entry.beverageRevenue;
      summary.foodCost += entry.foodCost;
      summary.beverageCost += entry.beverageCost;
      summary.fixedCost += entry.fixedCost;
      summary.dailyBudget += entry.dailyBudget;
      summary.totalRevenue += entry.totalRevenue;
      summary.totalCost += entry.totalCost;
      summary.gop += entry.gop;
      summary.budgetVariance += entry.budgetVariance;
      return summary;
    }, emptyTotals());

    Object.keys(totals).forEach((key) => { totals[key] = round(totals[key]); });
    const latestEntry = calculatedEntries.at(-1) || calculateEntry({});
    const bestSalesDay = calculatedEntries.reduce((best, entry) => (!best || entry.totalRevenue > best.totalRevenue ? entry : best), null);
    const lowestSalesDay = calculatedEntries.reduce((low, entry) => (!low || entry.totalRevenue < low.totalRevenue ? entry : low), null);
    const bestGopDay = calculatedEntries.reduce((best, entry) => (!best || entry.gop > best.gop ? entry : best), null);
    const worstGopDay = calculatedEntries.reduce((worst, entry) => (!worst || entry.gop < worst.gop ? entry : worst), null);
    const entryCount = calculatedEntries.length;
    const averageDailyRevenue = entryCount ? round(totals.totalRevenue / entryCount) : 0;
    const averageGop = entryCount ? round(totals.gop / entryCount) : 0;
    const averageCostPercent = dividePercent(totals.totalCost, totals.totalRevenue);

    return {
      entries: calculatedEntries,
      latestEntry,
      dailyRevenue: latestEntry.totalRevenue,
      mtdRevenue: totals.totalRevenue,
      foodRevenue: totals.foodRevenue,
      beverageRevenue: totals.beverageRevenue,
      foodCostPercent: dividePercent(totals.foodCost, totals.foodRevenue),
      beverageCostPercent: dividePercent(totals.beverageCost, totals.beverageRevenue),
      fixedCostPercent: dividePercent(totals.fixedCost, totals.totalRevenue),
      gop: totals.gop,
      gopMargin: dividePercent(totals.gop, totals.totalRevenue),
      budgetVariance: totals.budgetVariance,
      budgetVariancePercent: dividePercent(totals.budgetVariance, totals.dailyBudget),
      targetAchievementPercent: dividePercent(totals.totalRevenue, totals.dailyBudget),
      bestSalesDay,
      lowestSalesDay,
      averageDailyRevenue,
      averageGop,
      averageCostPercent,
      bestGopDay,
      worstGopDay,
      totals,
    };
  }

  function trendPercent(currentValue, previousValue) {
    if (number(previousValue) === 0) return number(currentValue) === 0 ? 0 : 100;
    return dividePercent(number(currentValue) - number(previousValue), number(previousValue));
  }

  function cumulativeSeries(entries, field = 'totalRevenue') {
    let runningTotal = 0;
    return entries.map(calculateEntry).sort((a, b) => a.date.localeCompare(b.date)).map((entry) => {
      runningTotal = round(runningTotal + number(entry[field]));
      return { label: entry.date.slice(5), value: runningTotal, date: entry.date };
    });
  }

  function dailySeries(entries, field = 'totalRevenue') {
    return entries.map(calculateEntry).sort((a, b) => a.date.localeCompare(b.date)).map((entry) => ({
      label: entry.date.slice(5),
      value: number(entry[field]),
      date: entry.date,
    }));
  }

  global.SkybarCalculations = {
    calculateEntry,
    cumulativeSeries,
    currency,
    dailySeries,
    dividePercent,
    normalizeEntry,
    number,
    percent,
    round,
    summarizeEntries,
    trendPercent,
  };
})(window);
