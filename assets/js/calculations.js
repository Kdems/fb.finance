(function exposeCalculations(global) {
  'use strict';

  const sum = (rows, field) => rows.reduce((total, row) => total + Number(row[field] || 0), 0);
  const percent = (value, base) => (base ? (value / base) * 100 : 0);
  const currency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const compactCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);

  function aggregate(rows) {
    const revenue = sum(rows, 'totalRevenue');
    const foodCost = sum(rows, 'foodCost');
    const beverageCost = sum(rows, 'beverageCost');
    const laborCost = sum(rows, 'laborCost');
    const operatingExpenses = sum(rows, 'operatingExpenses');
    const cashReserve = rows.length ? rows[rows.length - 1].cashReserve : 0;
    const cogs = foodCost + beverageCost;
    const primeCost = cogs + laborCost;
    const ebitda = revenue - primeCost - operatingExpenses;
    const averageDailyExpense = rows.length ? (primeCost + operatingExpenses) / (rows.length * 30) : 0;

    return {
      revenue,
      foodCost,
      beverageCost,
      laborCost,
      operatingExpenses,
      cashReserve,
      cogs,
      primeCost,
      ebitda,
      grossProfit: revenue - cogs,
      primeCostRatio: percent(primeCost, revenue),
      laborRatio: percent(laborCost, revenue),
      foodCostRatio: percent(foodCost, revenue),
      beverageCostRatio: percent(beverageCost, revenue),
      ebitdaMargin: percent(ebitda, revenue),
      cashRunwayDays: averageDailyExpense ? Math.round(cashReserve / averageDailyExpense) : 0,
    };
  }

  function revenueMix(rows) {
    return [
      { label: 'Dinner', value: sum(rows, 'dinnerRevenue') },
      { label: 'Beverage', value: sum(rows, 'beverageRevenue') },
      { label: 'Private Dining', value: sum(rows, 'privateDiningRevenue') },
      { label: 'Brunch', value: sum(rows, 'brunchRevenue') },
    ];
  }

  function variance(actual, plan) {
    return {
      amount: actual - plan,
      percent: percent(actual - plan, plan),
    };
  }

  global.SkybarCalculations = { aggregate, compactCurrency, currency, percent, revenueMix, sum, variance };
})(window);
