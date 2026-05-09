let selectedYear =
  new Date().getFullYear();

let selectedMonth =
  new Date().getMonth() + 1;



// ======================
// DOM
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
// FILTER
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


function bindEvents() {

  if (yearFilter) {

    yearFilter.addEventListener(
      "change",
      onFilterChange
    );

  }

  if (monthFilter) {

    monthFilter.addEventListener(
      "change",
      onFilterChange
    );

  }

}


function onFilterChange() {

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

  const summary =
    calculatePeriodSummary(
      entries
    );

  renderYtd(
    summary
  );

  renderMtd(
    summary
  );

  renderGop(
    summary
  );

  renderFoodBeverage(
    summary
  );

  renderSummary(
    entries,
    summary
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
  data
) {

  const settings =
    getSettings();

  const annualBudget =
    Number(
      settings.annualRevenueTarget || 0
    );

  const lyRevenue =
    getLyRevenue();

  const growth =
    calculateGrowth(
      data.totalRevenue,
      lyRevenue
    );

  const achievement =
    calculateAchievement(
      data.totalRevenue,
      annualBudget
    );

  const variance =
    data.totalRevenue -
    annualBudget;


  updateCard(
    "ytdRevenueCard",
    formatMoney(
      data.totalRevenue
    )
  );

  updateCard(
    "ytdBudgetCard",
    formatMoney(
      annualBudget
    )
  );

  updateCard(
    "ytdAchievementCard",
    `${achievement.toFixed(0)}%`
  );

  updateCard(
    "ytdGrowthCard",
    `${growth.toFixed(0)}%`
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
  data
) {

  const settings =
    getSettings();

  const monthlyBudget =
    Number(
      settings.monthlyBudget || 0
    );

  const lyRevenue =
    getLyRevenue() / 12;

  const growth =
    calculateGrowth(
      data.totalRevenue,
      lyRevenue
    );

  const achievement =
    calculateAchievement(
      data.totalRevenue,
      monthlyBudget
    );


  updateCard(
    "mtdRevenueCard",
    formatMoney(
      data.totalRevenue
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
      data.totalGop
    )
  );

  updateCard(
    "mtdGrowthCard",
    `${growth.toFixed(0)}%`
  );

  updateCard(
    "mtdLyRevenueCard",
    formatMoney(
      lyRevenue
    )
  );

  updateCard(
    "mtdAchievementCard",
    `${achievement.toFixed(0)}%`
  );


  updateProgressBar(
    "mtdProgressBar",
    achievement
  );

}



// ======================
// GOP
// ======================

function renderGop(
  data
) {

  updateCard(
    "gopRevenueCard",
    formatMoney(
      data.totalRevenue
    )
  );

  updateCard(
    "gopCostCard",
    formatMoney(
      data.totalCost
    )
  );

  updateCard(
    "gopMainCard",
    formatMoney(
      data.totalGop
    )
  );

  updateCard(
    "gopMarginCard",
    `${data.gopMargin.toFixed(0)}%`
  );

}



// ======================
// FOOD & BEVERAGE
// ======================

function renderFoodBeverage(
  data
) {

  updateCard(
    "foodRevenueCard",
    formatMoney(
      data.totalFoodRevenue
    )
  );

  updateCard(
    "bevRevenueCard",
    formatMoney(
      data.totalBeverageRevenue
    )
  );

  updateCard(
    "foodCostCard",
    formatMoney(
      data.foodCost
    )
  );

  updateCard(
    "bevCostCard",
    formatMoney(
      data.beverageCost
    )
  );

  updateCard(
    "fixCostCard",
    formatMoney(
      data.fixCost
    )
  );

}



// ======================
// SUMMARY
// ======================

function renderSummary(
  entries,
  data
) {

  const settings =
    getSettings();

  const achievement =
    calculateAchievement(
      data.totalRevenue,
      settings.monthlyBudget
    );

  const avgDaily =
    entries.length
      ? data.totalRevenue /
        entries.length
      : 0;


  updateCard(
    "summaryRevenueCard",
    formatMoney(
      data.totalRevenue
    )
  );

  updateCard(
    "summaryBudgetCard",
    formatMoney(
      avgDaily
    )
  );

  updateCard(
    "summaryAchievementCard",
    `${achievement.toFixed(0)}%`
  );

}



// ======================
// RECENT
// ======================

function renderRecentEntries(
  entries
) {

  const container =
    document.getElementById(
      "recentEntriesList"
    );

  if (!container) return;


  container.innerHTML =
    entries.map(
      entry => {

        const total =

          Number(
            entry.foodRevenue || 0
          ) +

          Number(
            entry.beverageRevenue || 0
          );


        return `
          <div class="border rounded-xl p-4 flex justify-between">

            <div>
              ${formatDate(entry.date)}
            </div>

            <div class="font-bold">
              ${formatMoney(total)}
            </div>

          </div>
        `;

      }
    ).join("");

}



// ======================
// HELPERS
// ======================

function getLyRevenue() {

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

  if (el) {

    el.innerHTML =
      value;

  }

}


function updateProgressBar(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );

  if (!el) return;


  el.style.width =
    Math.min(
      value,
      100
    ) + "%";


  if (
    value >= 100
  ) {

    el.className =
      "h-2 rounded-full bg-green-500";

  }

  else if (
    value >= 90
  ) {

    el.className =
      "h-2 rounded-full bg-yellow-500";

  }

  else {

    el.className =
      "h-2 rounded-full bg-red-500";

  }

}


function calculateAchievement(
  actual,
  target
) {

  if (!target) return 0;

  return (
    actual / target
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


function formatVariance(
  value
) {

  if (
    value >= 0
  ) {

    return (
      "🟢 +" +
      formatMoney(
        value
      )
    );

  }

  return (

    "🔴 -" +

    formatMoney(
      Math.abs(
        value
      )
    )

  );

}


function formatMoney(
  amount
) {

  const settings =
    getSettings();

  return (

    settings.currency +

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


function formatDate(
  value
) {

  return new Date(
    value
  ).toLocaleDateString(
    "en-GB"
  );

}



// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
