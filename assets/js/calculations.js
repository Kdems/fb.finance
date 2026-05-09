//
// SKYBAR FINANCE ENGINE
// FULL MASTER VERSION
//



// ======================
// FILTER ENTRIES
// ======================

function filterEntries(
  year,
  month
) {

  const entries =
    getAllEntries();


  return entries.filter(
    entry => {

      if (
        !entry.date
      ) {

        return false;

      }


      const date =
        new Date(
          entry.date
        );


      const entryYear =
        date.getFullYear();


      const entryMonth =
        date.getMonth() + 1;


      return (

        entryYear ===
          Number(year)

        &&

        entryMonth ===
          Number(month)

      );

    }
  );

}



// ======================
// CALCULATE SINGLE ENTRY
// ======================

function calculateEntryMetrics(
  entry
) {

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



  const fixedCost =

    (
      totalRevenue *
      fixedCostPercent
    ) / 100;



  const totalCost =

    foodCost +
    beverageCost +
    fixedCost;



  const gop =

    totalRevenue -
    totalCost;



  const budget =
    Number(
      entry.dailyBudget || 0
    );


  const variance =

    totalRevenue -
    budget;



  const achievement =

    budget > 0

      ?

      (
        totalRevenue /
        budget
      ) * 100

      :

      0;



  const gopMargin =

    totalRevenue > 0

      ?

      (
        gop /
        totalRevenue
      ) * 100

      :

      0;



  return {

    foodRevenue,
    beverageRevenue,

    totalRevenue,

    foodCost,
    beverageCost,
    fixedCost,

    totalCost,

    gop,

    variance,

    achievement,

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

  let totalCost =
    0;

  let totalGop =
    0;

  let totalBudget =
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


      totalCost +=
        calc.totalCost;


      totalGop +=
        calc.gop;


      totalBudget +=
        Number(
          entry.dailyBudget || 0
        );

    }
  );



  const totalRevenue =

    totalFoodRevenue +
    totalBeverageRevenue;



  const achievement =

    totalBudget > 0

      ?

      (
        totalRevenue /
        totalBudget
      ) * 100

      :

      0;



  const variance =

    totalRevenue -
    totalBudget;



  const gopMargin =

    totalRevenue > 0

      ?

      (
        totalGop /
        totalRevenue
      ) * 100

      :

      0;



  return {

    totalFoodRevenue,

    totalBeverageRevenue,

    totalRevenue,

    totalCost,

    totalGop,

    totalBudget,

    variance,

    achievement,

    gopMargin

  };

}



// ======================
// HELPERS
// ======================

function formatMoney(
  value
) {

  const settings =
    getSettings();


  return (

    settings.currency +

    Number(
      value || 0
    ).toLocaleString()

  );

}



function formatPercent(
  value
) {

  return (

    Number(
      value || 0
    ).toFixed(1)

    +

    "%"

  );

}



function getBestEntry(
  entries
) {

  if (
    !entries.length
  ) {

    return null;

  }


  return entries.reduce(

    (
      best,
      current
    ) => {

      const bestRevenue =

        Number(
          best.foodRevenue || 0
        )

        +

        Number(
          best.beverageRevenue || 0
        );



      const currentRevenue =

        Number(
          current.foodRevenue || 0
        )

        +

        Number(
          current.beverageRevenue || 0
        );



      return

        currentRevenue >

        bestRevenue

          ?

          current

          :

          best;

    }

  );

}



function getWorstEntry(
  entries
) {

  if (
    !entries.length
  ) {

    return null;

  }


  return entries.reduce(

    (
      worst,
      current
    ) => {

      const worstRevenue =

        Number(
          worst.foodRevenue || 0
        )

        +

        Number(
          worst.beverageRevenue || 0
        );



      const currentRevenue =

        Number(
          current.foodRevenue || 0
        )

        +

        Number(
          current.beverageRevenue || 0
        );



      return

        currentRevenue <

        worstRevenue

          ?

          current

          :

          worst;

    }

  );

}
