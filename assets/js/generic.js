function renderOperatingReview() {

  const entries =
    getEntries();


  if(
    !entries ||
    entries.length === 0
  ) {

    return;

  }


  const settings =
    getSettings();


  const summary =
    calculatePeriodSummary(
      entries
    );


  let totalFoodVariance =
    0;

  let totalBeverageVariance =
    0;


  entries.forEach(
    entry => {

      const calculated =
        calculateEntryMetrics(
          entry
        );


      totalFoodVariance +=
        calculated.foodCostVariance;


      totalBeverageVariance +=
        calculated.beverageCostVariance;

    }
  );


  const avgFoodVariance =
    totalFoodVariance /
    entries.length;


  const avgBeverageVariance =
    totalBeverageVariance /
    entries.length;


  const revenueAchievement =
    calculateAchievement(
      summary.totalRevenue,
      settings.annualRevenueTarget
    );


  const gopAchievement =
    calculateAchievement(
      summary.totalGop,
      settings.annualGopTarget
    );


  updateMetric(
    "reviewRevenueAchievement",
    revenueAchievement
  );


  updateMetric(
    "reviewGopAchievement",
    gopAchievement
  );


  updateMetric(
    "reviewFoodVariance",
    avgFoodVariance
  );


  updateMetric(
    "reviewBeverageVariance",
    avgBeverageVariance
  );


  renderBusinessInsight(
    avgFoodVariance,
    avgBeverageVariance
  );

}


function calculateAchievement(
  current,
  target
) {

  if(
    !target ||
    target <= 0
  ) {

    return 0;

  }

  return (
    current / target
  ) * 100;

}


function updateMetric(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
    );

  if(
    !element
  ) return;


  element.textContent =
    `${value.toFixed(2)}%`;

}


function renderBusinessInsight(
  foodVariance,
  beverageVariance
) {

  const element =
    document.getElementById(
      "businessInsight"
    );

  if(
    !element
  ) return;


  let insight =
    "";


  if(
    foodVariance > 0
  ) {

    insight +=
      "• Food cost above target. Review portion control.<br>";

  }


  if(
    beverageVariance > 0
  ) {

    insight +=
      "• Beverage margin declining. Review pricing mix.<br>";

  }


  if(
    insight === ""
  ) {

    insight =
      "• Operating performance within benchmark.";

  }


  element.innerHTML =
    insight;

}


document.addEventListener(
  "DOMContentLoaded",
  renderOperatingReview
);
