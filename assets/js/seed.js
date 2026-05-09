(function() {

  const existingEntries =
    localStorage.getItem(
      "skybar_entries"
    );


  if(
    existingEntries
  ) {

    return;

  }



  const dummyEntries = [

    {
      id: 1,
      date: "2026-05-01",
      foodRevenue: 3200,
      beverageRevenue: 1800
    },

    {
      id: 2,
      date: "2026-05-02",
      foodRevenue: 2800,
      beverageRevenue: 2200
    },

    {
      id: 3,
      date: "2026-05-03",
      foodRevenue: 3500,
      beverageRevenue: 2000
    },

    {
      id: 4,
      date: "2026-05-04",
      foodRevenue: 2900,
      beverageRevenue: 1600
    },

    {
      id: 5,
      date: "2026-05-05",
      foodRevenue: 4100,
      beverageRevenue: 2400
    },

    {
      id: 6,
      date: "2026-05-06",
      foodRevenue: 3700,
      beverageRevenue: 2100
    },

    {
      id: 7,
      date: "2026-05-07",
      foodRevenue: 3000,
      beverageRevenue: 1700
    },

    {
      id: 8,
      date: "2026-05-08",
      foodRevenue: 4500,
      beverageRevenue: 2600
    },

    {
      id: 9,
      date: "2026-05-09",
      foodRevenue: 3900,
      beverageRevenue: 2300
    }

  ];



  const dummySettings = {

    outletName:
      "SKYBAR",

    currency:
      "RM",

    annualRevenueTarget:
      7500000,

    monthlyBudget:
      575649,

    foodCostPercent:
      35,

    beverageCostPercent:
      25,

    fixCostPercent:
      18,

    lyFoodRevenue:
      90000,

    lyBeverageRevenue:
      150000

  };



  localStorage.setItem(
    "skybar_entries",
    JSON.stringify(
      dummyEntries
    )
  );


  localStorage.setItem(
    "skybar_settings",
    JSON.stringify(
      dummySettings
    )
  );


  console.log(
    "Dummy data injected."
  );

})();
