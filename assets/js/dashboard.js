let selectedYear =
  new Date().getFullYear();

let selectedMonth =
  new Date().getMonth() + 1;



// ======================
// ELEMENTS
// ======================

const yearFilter =
  document.getElementById(
    "yearFilter"
  );

const monthFilter =
  document.getElementById(
    "monthFilter"
  );

const entryDateField =
  document.getElementById(
    "entryDate"
  );



// ======================
// INIT
// ======================

function initDashboard() {

  populateYearFilter();

  populateMonthFilter();

  bindEvents();

  renderDashboard();

  updateAutoDailyBudget();

}



// ======================
// FILTERS
// ======================

function populateYearFilter() {

  if(!yearFilter) return;

  yearFilter.innerHTML =
    "";

  for(
    let year = 2025;
    year <= 2040;
    year++
  ) {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      year;

    option.textContent =
      year;

    if(
      year === selectedYear
    ) {
      option.selected =
        true;
    }

    yearFilter.appendChild(
      option
    );

  }

}


function populateMonthFilter() {

  if(!monthFilter) return;

  monthFilter.innerHTML =
    "";

  for(
    let month = 1;
    month <= 12;
    month++
  ) {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      month;

    option.textContent =
      month;

    if(
      month === selectedMonth
    ) {
      option.selected =
        true;
    }

    monthFilter.appendChild(
      option
    );

  }

}



// ======================
// EVENTS
// ======================

function bindEvents() {

  if(yearFilter) {

    yearFilter.addEventListener(
      "change",
      handleFilterChange
    );

  }


  if(monthFilter) {

    monthFilter.addEventListener(
      "change",
      handleFilterChange
    );

  }


  if(entryDateField) {

    entryDateField.addEventListener(
      "change",
      updateAutoDailyBudget
    );

  }

}



// ======================
// FILTER
// ======================

function handleFilterChange() {

  selectedYear =
    Number(
      yearFilter.value
    );

  selectedMonth =
    Number(
      monthFilter.value
    );

  renderDashboard();

}



// ======================
// DAILY BUDGET
// ======================

function updateAutoDailyBudget() {

  const budgetField =
    document.getElementById(
      "dailyBudgetDisplay"
    );


  if(
    !budgetField ||
    !entryDateField ||
    !entryDateField.value
  ) return;


  const settings =
    getSettings();


  const date =
    new Date(
      entryDateField.value
    );


  const days =
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();


  const dailyBudget =
    Number(
      settings.monthlyBudget || 0
    ) / days;


  budgetField.value =
    formatMoney(
      dailyBudget
    );

}



// ======================
// MAIN
// ======================

function renderDashboard() {

  const entries =
    filterEntries(
      selectedYear,
      selectedMonth
    );


  const current =
    calculatePeriodSummary(
      entries
    );


  renderYtd(
    current
  );

  renderMtd(
    current
  );

  renderGop(
    current
  );

  renderFoodBeverage(
    current
  );

  renderSummary(
    entries,
    current
  );


  if(
    typeof renderCharts ===
    "function"
  ) {

    renderCharts(
      entries
    );

  }

}



// ======================
// YTD
// ======================

function renderYtd(
  current
) {

  const settings =
    getSettings();


  const budget =
    Number(
      settings.annualRevenueTarget || 0
    );


  const lyRevenue =
    getLyTotalRevenue();


  const achievement =
    calculateAchievement(
      current.totalRevenue,
      budget
    );


  const growth =
    calculateGrowth(
      current.totalRevenue,
      lyRevenue
    );


  const variance =
    current.totalRevenue -
    budget;


  updateCard("ytdRevenueCard", formatMoney(current.totalRevenue));
  updateCard("ytdBudgetCard", formatMoney(budget));
  updateCard("ytdAchievementCard", `${achievement.toFixed(2)}%`);
  updateCard("ytdGrowthCard", `${growth.toFixed(2)}%`);
  updateCard("lyRevenueCard", formatMoney(lyRevenue));
  updateCard("ytdVarianceCard", formatMoney(variance));

}



// ======================
// MTD
// ======================

function renderMtd(
  current
) {

  const settings =
    getSettings();


  const monthlyBudget =
    Number(
      settings.monthlyBudget || 0
    );


  const lyMonthlyRevenue =
    getLyTotalRevenue() / 12;


  const growth =
    calculateGrowth(
      current.totalRevenue,
      lyMonthlyRevenue
    );


  const achievement =
    calculateAchievement(
      current.totalRevenue,
      monthlyBudget
    );


  updateCard("mtdRevenueCard", formatMoney(current.totalRevenue));
  updateCard("mtdBudgetCard", formatMoney(monthlyBudget));
  updateCard("mtdGopCard", formatMoney(current.totalGop));
  updateCard("mtdGrowthCard", `${growth.toFixed(2)}%`);
  updateCard("mtdAchievementCard", `${achievement.toFixed(2)}%`);

}



// ======================
// GOP
// ======================

function renderGop(
  current
) {

  updateCard("gopRevenueCard", formatMoney(current.totalRevenue));
  updateCard("gopCostCard", formatMoney(current.totalCost));
  updateCard("gopMainCard", formatMoney(current.totalGop));
  updateCard("gopMarginCard", `${current.gopMargin.toFixed(2)}%`);

}



// ======================
// F&B ANALYSIS
// ======================

function renderFoodBeverage(
  current
) {

  const settings =
    getSettings();


  const foodCostPercent =
    Number(
      settings.foodCostPercent || 0
    );


  const bevCostPercent =
    Number(
      settings.beverageCostPercent || 0
    );


  const fixCostPercent =
    Number(
      settings.fixCostPercent || 0
    );


  const foodCost =
    current.totalFoodRevenue *
    (
      foodCostPercent / 100
    );


  const bevCost =
    current.totalBeverageRevenue *
    (
      bevCostPercent / 100
    );


  const fixCost =
    current.totalRevenue *
    (
      fixCostPercent / 100
    );


  const foodGrowth =
    calculateGrowth(
      current.totalFoodRevenue,
      settings.lyFoodRevenue
    );


  const bevGrowth =
    calculateGrowth(
      current.totalBeverageRevenue,
      settings.lyBeverageRevenue
    );


  updateCard(
    "foodRevenueCard",
    formatMoney(current.totalFoodRevenue)
  );

  updateCard(
    "bevRevenueCard",
    formatMoney(current.totalBeverageRevenue)
  );

  updateCard(
    "foodCostCard",
    formatMoney(foodCost)
  );

  updateCard(
    "bevCostCard",
    formatMoney(bevCost)
  );

  updateCard(
    "fixCostCard",
    formatMoney(fixCost)
  );


  updateSubCard(
    "foodRevenueCard",
    `LY ${foodGrowth.toFixed(2)}%`
  );

  updateSubCard(
    "bevRevenueCard",
    `LY ${bevGrowth.toFixed(2)}%`
  );


  updateText(
    "foodCostPercentText",
    `${foodCostPercent.toFixed(2)}%`
  );

  updateText(
    "bevCostPercentText",
    `${bevCostPercent.toFixed(2)}%`
  );

  updateText(
    "fixCostPercentText",
    `${fixCostPercent.toFixed(2)}%`
  );

}



// ======================
// SUMMARY
// ======================

function renderSummary(
  entries,
  current
) {

  const settings =
    getSettings();


  const monthlyBudget =
    Number(
      settings.monthlyBudget || 0
    );


  const avgDaily =
    entries.length > 0
      ? current.totalRevenue / entries.length
      : 0;


  const achievement =
    calculateAchievement(
      current.totalRevenue,
      monthlyBudget
    );


  let bestDay = "-";
  let worstDay = "-";


  if(
    entries.length > 0
  ) {

    const ranked =
      entries.map(
        entry => ({

          date:
            entry.date,

          revenue:
            Number(entry.foodRevenue || 0) +
            Number(entry.beverageRevenue || 0)

        })
      );


    ranked.sort(
      (a, b) =>
        a.revenue -
        b.revenue
    );


    worstDay =
      ranked[0].date;

    bestDay =
      ranked[
        ranked.length - 1
      ].date;

  }


  updateCard("summaryRevenueCard", formatMoney(current.totalRevenue));
  updateCard("summaryBudgetCard", formatMoney(avgDaily));
  updateCard("summaryAchievementCard", `${achievement.toFixed(2)}%`);
  updateCard("bestDayCard", bestDay);
  updateCard("worstDayCard", worstDay);

}



// ======================
// HELPERS
// ======================

function getLyTotalRevenue() {

  const settings =
    getSettings();


  return (
    Number(settings.lyFoodRevenue || 0) +
    Number(settings.lyBeverageRevenue || 0)
  );

}


function updateCard(
  id,
  value
) {

  const el =
    document.getElementById(id);

  if(!el) return;

  el.innerHTML =
    value;

}


function updateSubCard(
  id,
  value
) {

  const el =
    document.getElementById(id);

  if(!el) return;

  const small =
    el.parentElement.querySelector("small");

  if(
    small
  ) {

    small.innerHTML =
      value;

  }

}


function updateText(
  id,
  value
) {

  const el =
    document.getElementById(id);

  if(!el) return;

  el.innerHTML =
    value;

}


function calculateAchievement(
  current,
  target
) {

  if(!target) return 0;

  return (
    current / target
  ) * 100;

}


function calculateGrowth(
  current,
  ly
) {

  if(!ly) return 0;

  return (
    (
      current - ly
    ) / ly
  ) * 100;

}


function formatMoney(
  amount
) {

  const settings =
    getSettings();

  const currency =
    settings.currency || "RM";

  return (
    currency +
    Number(amount || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )
  );

}



// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
