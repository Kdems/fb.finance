const REVIEW_NOTE_KEY =
  "skybar.finance.dashboard.review.notes.v1";



// ======================
// INIT
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initReviewPage
);



function initReviewPage() {

  renderReview();

  loadManagementNotes();

  bindManagementNotes();

}



// ======================
// MAIN
// ======================

function renderReview() {

  const entries =
    getAllEntries();



  const summary =
    calculatePeriodSummary(
      entries
    );



  const settings =
    getSettings();



// ======================
// REVENUE ACHIEVEMENT
// ======================

  const revenueAchievement =

    settings.annualRevenueTarget > 0

      ?

      (

        summary.totalRevenue /

        settings.annualRevenueTarget

      ) * 100

      :

      0;



// ======================
// GOP ACHIEVEMENT
// ======================

  const gopAchievement =

    settings.annualGopTarget > 0

      ?

      (

        summary.totalGop /

        settings.annualGopTarget

      ) * 100

      :

      0;



// ======================
// COST VARIANCE
// ======================

  const actualFoodCost =

    summary.totalRevenue > 0

      ?

      (

        summary.totalFoodRevenue *

        settings.foodCostPercent /

        100

      )

      /

      summary.totalRevenue

      *

      100

      :

      0;



  const actualBeverageCost =

    summary.totalRevenue > 0

      ?

      (

        summary.totalBeverageRevenue *

        settings.beverageCostPercent /

        100

      )

      /

      summary.totalRevenue

      *

      100

      :

      0;



  const foodVariance =

    actualFoodCost -

    settings.foodCostPercent;



  const beverageVariance =

    actualBeverageCost -

    settings.beverageCostPercent;



// ======================
// UI
// ======================

  setText(
    "reviewRevenueAchievement",
    formatPercent(
      revenueAchievement
    )
  );



  setText(
    "reviewGopAchievement",
    formatPercent(
      gopAchievement
    )
  );



  setText(
    "reviewFoodVariance",
    formatPercent(
      foodVariance
    )
  );



  setText(
    "reviewBeverageVariance",
    formatPercent(
      beverageVariance
    )
  );



  renderBusinessInsight(
    revenueAchievement,
    gopAchievement,
    foodVariance,
    beverageVariance
  );

}



// ======================
// INSIGHT ENGINE
// ======================

function renderBusinessInsight(

  revenueAchievement,

  gopAchievement,

  foodVariance,

  beverageVariance

) {

  let insight =
    "";



  if (

    revenueAchievement >= 100

  ) {

    insight +=

      "Revenue target achieved. ";

  }

  else {

    insight +=

      "Revenue below target. ";

  }



  if (

    gopAchievement >= 100

  ) {

    insight +=

      "Profitability healthy. ";

  }

  else {

    insight +=

      "Profitability needs attention. ";

  }



  if (

    foodVariance > 0

  ) {

    insight +=

      "Food cost above target. ";

  }



  if (

    beverageVariance > 0

  ) {

    insight +=

      "Beverage cost above target.";

  }



  setText(
    "businessInsight",
    insight
  );

}



// ======================
// NOTES
// ======================

function loadManagementNotes() {

  const notesField =
    document.getElementById(
      "managementNotes"
    );



  if (
    !notesField
  ) return;



  const savedNotes =

    localStorage.getItem(
      REVIEW_NOTE_KEY
    ) || "";



  notesField.value =
    savedNotes;

}



function bindManagementNotes() {

  const notesField =
    document.getElementById(
      "managementNotes"
    );



  if (
    !notesField
  ) return;



  notesField.addEventListener(
    "input",
    function() {

      localStorage.setItem(

        REVIEW_NOTE_KEY,

        this.value

      );

    }
  );

}



// ======================
// HELPER
// ======================

function setText(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );



  if (
    !el
  ) return;



  el.innerHTML =
    value;

}
