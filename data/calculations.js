// Safe percentage calculation
function calculatePercent(value, base) {
  if (!base || base <= 0) return 0;
  return (value / base) * 100;
}

// Calculate one entry
function calculateEntryMetrics(entry) {
  const foodRevenue = Number(entry.foodRevenue || 0);
  const beverageRevenue = Number(entry.beverageRevenue || 0);

  const foodCostPercent = Number(entry.foodCostPercent || 0);
  const beverageCostPercent = Number(entry.beverageCostPercent || 0);
  const fixedCostPercent = Number(entry.fixedCostPercent || 0);

  const dailyBudget = Number(entry.dailyBudget || 0);

  // Revenue
  const totalRevenue =
    foodRevenue + beverageRevenue;

  // Cost amounts (based on %)
  const foodCostAmount =
    (foodRevenue * foodCostPercent) / 100;

  const beverageCostAmount =
    (beverageRevenue * beverageCostPercent) / 100;

  const fixedCostAmount =
    (totalRevenue * fixedCostPercent) / 100;

  // Total cost
  const totalCost =
    foodCostAmount +
    beverageCostAmount +
    fixedCostAmount;

  // GOP
  const gop =
    totalRevenue - totalCost;

  // Variance
  const budgetVariance =
    totalRevenue - dailyBudget;

  // Margin
  const gopMargin =
    calculatePercent(gop, totalRevenue);

  return {
    ...entry,

    totalRevenue,

    foodCostAmount,
    beverageCostAmount,
    fixedCostAmount,

    totalCost,

    gop,

    budgetVariance,

    gopMargin
  };
}

// Calculate MTD summary
function calculatePeriodSummary(entries) {

  let totalFoodRevenue = 0;
  let totalBeverageRevenue = 0;
  let totalRevenue = 0;
  let totalCost = 0;
  let totalGop = 0;
  let totalBudget = 0;

  entries.forEach(entry => {

    const calculated =
      calculateEntryMetrics(entry);

    totalFoodRevenue +=
      calculated.foodRevenue;

    totalBeverageRevenue +=
      calculated.beverageRevenue;

    totalRevenue +=
      calculated.totalRevenue;

    totalCost +=
      calculated.totalCost;

    totalGop +=
      calculated.gop;

    totalBudget +=
      Number(entry.dailyBudget || 0);

  });

  const budgetVariance =
    totalRevenue - totalBudget;

  const gopMargin =
    calculatePercent(
      totalGop,
      totalRevenue
    );

  return {

    totalFoodRevenue,

    totalBeverageRevenue,

    totalRevenue,

    totalCost,

    totalGop,

    totalBudget,

    budgetVariance,

    gopMargin,

    totalEntries: entries.length

  };
}
