const ENTRY_STORAGE_KEY =
  "skybar_entries";



// ======================
// GET ENTRIES
// ======================

function getAllEntries() {

  try {

    const raw =
      localStorage.getItem(
        ENTRY_STORAGE_KEY
      );


    if(
      !raw
    ) {

      return [];

    }


    const parsed =
      JSON.parse(
        raw
      );


    if(
      !Array.isArray(
        parsed
      )
    ) {

      return [];

    }


    return parsed;

  }

  catch(
    error
  ) {

    console.error(
      "Entry load error:",
      error
    );


    return [];

  }

}



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

      if(
        !entry.date
      ) return false;


      const date =
        new Date(
          entry.date
        );


      const entryYear =
        date.getFullYear();


      const entryMonth =
        date.getMonth() + 1;


      return (

        entryYear === year &&

        entryMonth === month

      );

    }
  );

}



// ======================
// MAIN CALCULATION
// ======================

function calculatePeriodSummary(
  entries
) {

  const settings =
    getSettings();


  let totalFoodRevenue = 0;

  let totalBeverageRevenue = 0;


  entries.forEach(
    entry => {

      totalFoodRevenue +=
        Number(
          entry.foodRevenue || 0
        );


      totalBeverageRevenue +=
        Number(
          entry.beverageRevenue || 0
        );

    }
  );


  const totalRevenue =
    totalFoodRevenue +
    totalBeverageRevenue;



  // COST %
  const foodCostPercent =
    Number(
      settings.foodCostPercent || 0
    ) / 100;


  const beverageCostPercent =
    Number(
      settings.beverageCostPercent || 0
    ) / 100;


  const fixCostPercent =
    Number(
      settings.fixCostPercent || 0
    ) / 100;



  // COST VALUE
  const foodCost =
    totalFoodRevenue *
    foodCostPercent;


  const beverageCost =
    totalBeverageRevenue *
    beverageCostPercent;


  const fixCost =
    totalRevenue *
    fixCostPercent;



  const totalCost =
    foodCost +
    beverageCost +
    fixCost;



  const totalGop =
    totalRevenue -
    totalCost;



  let gopMargin = 0;


  if(
    totalRevenue > 0
  ) {

    gopMargin =
      (
        totalGop /
        totalRevenue
      ) * 100;

  }



  return {

    totalFoodRevenue:
      totalFoodRevenue,


    totalBeverageRevenue:
      totalBeverageRevenue,


    totalRevenue:
      totalRevenue,


    foodCost:
      foodCost,


    beverageCost:
      beverageCost,


    fixCost:
      fixCost,


    totalCost:
      totalCost,


    totalGop:
      totalGop,


    gopMargin:
      gopMargin

  };

}
