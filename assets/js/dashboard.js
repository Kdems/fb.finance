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



// ======================
// INIT
// ======================

function initDashboard() {

  populateYearFilter();

  populateMonthFilter();

  bindEvents();

  renderDashboard();

}



// ======================
// FILTERS
// ======================

function populateYearFilter() {

  if (!yearFilter) return;

  yearFilter.innerHTML =
    "";

  for (
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

    if (
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

  if (!monthFilter) return;

  monthFilter.innerHTML =
    "";

  for (
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

    if (
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

  if (yearFilter) {

    yearFilter.addEventListener(
      "change",
      handleFilterChange
    );

  }

  if (monthFilter) {

    monthFilter.addEventListener(
      "change",
      handleFilterChange
    );

  }

}


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

  renderRecentEntries(
    entries
  );

  if (
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

  updateCard(
    "ytdRevenueCard",
    formatMoney(
      current.totalRevenue
    )
  );

  updateCard(
    "ytdBudgetCard",
    formatMoney(
      budget
    )
  );

  updateCard(
    "ytdAchievementCard",
    `${achievement.toFixed(2)}%`
  );

  updateCard(
    "ytdGrowthCard",
    `${growth.toFixed(2)}%`
  );

  updateCard(
    "lyRevenueCard",
    formatMoney(
      lyRevenue
    )
  );

  updateCard(
    "ytdVarianceCard",
    formatVariance(
      variance
    )
  );

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

  updateCard(
    "mtdRevenueCard",
    formatMoney(
      current.totalRevenue
    )
  );

  updateCard(
    "mtdBudgetCard",
    formatMoney(
      monthlyBudget
    )
  );

  updateCard(
    "mtdGopCard",
    formatMoney(
      current.totalGop
    )
  );

  updateCard(
    "mtdGrowthCard",
    `${growth.toFixed(2)}%`
  );

  updateCard(
    "mtdLyRevenueCard",
    formatMoney(
      lyMonthlyRevenue
    )
  );

  updateCard(
    "mtdAchievementCard",
    `${achievement.toFixed(2)}%`
  );

}



// ======================
// GOP
// ======================

function renderGop(
  current
) {

  updateCard(
    "gopRevenueCard",
    formatMoney(
      current.totalRevenue
    )
  );

  updateCard(
    "gopCostCard",
    formatMoney(
      current.totalCost
    )
  );

  updateCard(
    "gopMainCard",
    formatMoney(
      current.totalGop
    )
  );

  updateCard(
    "gopMarginCard",
    `${current.gopMargin.toFixed(2)}%`
  );

}



// ======================
// F&B
// ======================

function renderFoodBeverage(
  current
) {

  updateCard(
    "foodRevenueCard",
    formatMoney(
      current.totalFoodRevenue
    )
  );

  updateCard(
    "bevRevenueCard",
    formatMoney(
      current.totalBeverageRevenue
    )
  );

  updateCard(
    "foodCostCard",
    formatMoney(
      current.foodCost
    )
  );

  updateCard(
    "bevCostCard",
    formatMoney(
      current.beverageCost
    )
  );

  updateCard(
    "fixCostCard",
    formatMoney(
      current.fixCost
    )
  );

}



// ======================
// HELPERS
// ======================

function formatVariance(
  amount
) {

  const icon =
    amount >= 0
      ? "🟢 +"
      : "🔴 -";

  return (
    icon +
    formatMoney(
      Math.abs(
        amount
      )
    )
  );

}


function getLyTotalRevenue() {

  const settings =
    getSettings();

  return (

    Number(
      settings.lyFoodRevenue || 0
    ) +

    Number(
      settings.lyBeverageRevenue || 0
    )

  );

}


function updateCard(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );

  if (!el) return;

  el.innerHTML =
    value;

}


function calculateAchievement(
  current,
  target
) {

  if (!target) return 0;

  return (
    current / target
  ) * 100;

}


function calculateGrowth(
  current,
  ly
) {

  if (!ly) return 0;

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

    Number(
      amount || 0
    ).toLocaleString(
      undefined,
      {
        maximumFractionDigits: 0
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
