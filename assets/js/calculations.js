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


  // ======================
  // COST %
  // ======================

  const foodCostPercent =
    Number(
      settings.foodCostPercent || 0
    );


  const beverageCostPercent =
    Number(
      settings.beverageCostPercent || 0
    );


  const fixCostPercent =
    Number(
      settings.fixCostPercent || 0
    );


  // ======================
  // COST VALUE
  // ======================

  const foodCost =
    (
      foodRevenue *
      foodCostPercent
    ) / 100;


  const beverageCost =
    (
      beverageRevenue *
      beverageCostPercent
    ) / 100;


  const fixCost =
    (
      totalRevenue *
      fixCostPercent
    ) / 100;


  const totalCost =
    foodCost +
    beverageCost +
    fixCost;


  const gop =
    totalRevenue -
    totalCost;


  const gopMargin =
    totalRevenue > 0
      ? (
          gop /
          totalRevenue
        ) * 100
      : 0;


  return {

    foodRevenue,

    beverageRevenue,

    totalRevenue,


    foodCost,

    beverageCost,

    fixCost,

    totalCost,


    gop,

    gopMargin

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


  let totalFoodCost =
    0;


  let totalBeverageCost =
    0;


  let totalFixCost =
    0;


  let totalCost =
    0;


  let totalGop =
    0;


  entries.forEach(
    entry => {

      const calc =
        calculateEntryMetrics(
          entry
        );


      totalFoodRevenue +=
        calc.foodRevenue;


      totalBeverageRevenue +=
        calc.beverageRevenue;


      totalRevenue +=
        calc.totalRevenue;


      totalFoodCost +=
        calc.foodCost;


      totalBeverageCost +=
        calc.beverageCost;


      totalFixCost +=
        calc.fixCost;


      totalCost +=
        calc.totalCost;


      totalGop +=
        calc.gop;

    }
  );


  const gopMargin =
    totalRevenue > 0
      ? (
          totalGop /
          totalRevenue
        ) * 100
      : 0;


  return {

    totalFoodRevenue,

    totalBeverageRevenue,

    totalRevenue,


    totalFoodCost,

    totalBeverageCost,

    totalFixCost,

    totalCost,


    totalGop,

    gopMargin

  };

}
