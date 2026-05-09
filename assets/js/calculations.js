function safePercent(
  value,
  base
) {

  if(
    !base ||
    base <= 0
  ) {

    return 0;

  }

  return (
    value / base
  ) * 100;

}


// ======================
// SINGLE ENTRY
// ======================

function calculateEntryMetrics(
  entry
) {

  const settings =
    getSettings();


  const foodRevenue =
    Number(
      entry.foodRevenue || 0
    );


  const beverageRevenue =
    Number(
      entry.beverageRevenue || 0
    );


  const totalRevenue =
    foodRevenue +
    beverageRevenue;


  // COST %

  const foodCostPercent =
    Number(
      entry.foodCostPercent || 0
    );


  const beverageCostPercent =
    Number(
      entry.beverageCostPercent || 0
    );


  const fixedCostPercent =
    Number(
      entry.fixedCostPercent || 0
    );


  // COST AMOUNT

  const foodCostAmount =
    (
      foodRevenue *
      foodCostPercent
    ) / 100;


  const beverageCostAmount =
    (
      beverageRevenue *
      beverageCostPercent
    ) / 100;


  const fixedCostAmount =
    (
      totalRevenue *
      fixedCostPercent
    ) / 100;


  // TOTAL COST

  const totalCost =
    foodCostAmount +
    beverageCostAmount +
    fixedCostAmount;


  // GOP

  const gop =
    totalRevenue -
    totalCost;


  // MARGIN

  const gopMargin =
    safePercent(
      gop,
      totalRevenue
    );


  // BUDGET

  const budgetVariance =
    totalRevenue -
    Number(
      entry.dailyBudget || 0
    );


  // TARGET VARIANCE

  const foodCostVariance =
    foodCostPercent -
    settings.foodCostTarget;


  const beverageCostVariance =
    beverageCostPercent -
    settings.beverageCostTarget;


  const fixedCostVariance =
    fixedCostPercent -
    settings.fixedCostTarget;


  return {

    ...entry,

    totalRevenue,

    foodCostAmount,

    beverageCostAmount,

    fixedCostAmount,

    totalCost,

    gop,

    gopMargin,

    budgetVariance,


    foodCostVariance,

    beverageCostVariance,

    fixedCostVariance

  };

}


// ======================
// PERIOD SUMMARY
// ======================

function calculatePeriodSummary(
  entries
) {

  let totalFoodRevenue =
    0;

  let totalBeverageRevenue =
    0;

  let totalRevenue =
    0;

  let totalCost =
    0;

  let totalGop =
    0;

  let totalBudget =
    0;


  entries.forEach(
    entry => {

      const calculated =
        calculateEntryMetrics(
          entry
        );


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
        Number(
          entry.dailyBudget || 0
        );

    }
  );


  const budgetVariance =
    totalRevenue -
    totalBudget;


  const gopMargin =
    safePercent(
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

    totalEntries:
      entries.length

  };

}
