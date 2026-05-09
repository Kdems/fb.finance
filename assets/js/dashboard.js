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

  const growth =
    calculateGrowth(
      current.totalRevenue,
      lyRevenue
    );

  const achievement =
    calculateAchievement(
      current.totalRevenue,
      budget
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
    `${growth.toFixed(0)}%`
  );

  updateCard(
    "mtdLyRevenueCard",
    formatMoney(
      lyMonthlyRevenue
    )
  );

  updateCard(
    "mtdAchievementCard",
    `${achievement.toFixed(0)}%`
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
    `${current.gopMargin.toFixed(0)}%`
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
      ? current.totalRevenue /
        entries.length
      : 0;

  const achievement =
    calculateAchievement(
      current.totalRevenue,
      monthlyBudget
    );


  let best =
    null;

  let worst =
    null;


  if (
    entries.length > 0
  ) {

    const ranked =
      entries.map(
        entry => {

          const revenue =

            Number(
              entry.foodRevenue || 0
            ) +

            Number(
              entry.beverageRevenue || 0
            );

          return {

            date:
              entry.date,

            revenue:
              revenue

          };

        }
      );


    ranked.sort(
      (a, b) =>
        a.revenue -
        b.revenue
    );


    worst =
      ranked[0];

    best =
      ranked[
        ranked.length - 1
      ];

  }


  updateCard(
    "summaryRevenueCard",
    formatMoney(
      current.totalRevenue
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


  if (best) {

    updateCard(
      "bestDayCard",

      `🏆 ${formatDate(
        best.date
      )}<br>
      <small>
        ${formatMoney(
          best.revenue
        )}
      </small>`
    );

  }


  if (worst) {

    updateCard(
      "worstDayCard",

      `⚠ ${formatDate(
        worst.date
      )}<br>
      <small>
        ${formatMoney(
          worst.revenue
        )}
      </small>`
    );

  }

}



// ======================
// RECENT ENTRIES
// ======================

function renderRecentEntries(
  entries
) {

  const container =
    document.getElementById(
      "recentEntriesList"
    );

  if (!container) return;


  if (
    entries.length === 0
  ) {

    container.innerHTML =
      `
      <div class="text-slate-400">
        No entries found
      </div>
      `;

    return;

  }


  const settings =
    getSettings();

  const dailyBudget =

    Number(
      settings.monthlyBudget || 0
    ) /

    new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();



  const latest =
    [...entries]
    .sort(
      (a, b) =>
        new Date(
          b.date
        ) -
        new Date(
          a.date
        )
    )
    .slice(
      0,
      10
    );



  container.innerHTML =
    latest.map(
      entry => {

        const food =
          Number(
            entry.foodRevenue || 0
          );

        const bev =
          Number(
            entry.beverageRevenue || 0
          );

        const total =
          food + bev;


        const achievement =
          calculateAchievement(
            total,
            dailyBudget
          );


        const icon =
          achievement >= 100
            ? "🟢"
            : "🔴";


        return `
        <div class="border rounded-xl p-4 flex justify-between">

          <div>

            <div class="font-medium">
              ${formatDate(
                entry.date
              )}
            </div>

            <div class="text-sm text-slate-500">
              Food ${formatMoney(food)}
            </div>

            <div class="text-sm text-slate-500">
              Beverage ${formatMoney(bev)}
            </div>

          </div>


          <div class="text-right">

            <div class="font-bold">
              ${formatMoney(total)}
            </div>

            <div class="text-sm mt-1">
              ${icon}
              ${achievement.toFixed(0)}%
            </div>

          </div>

        </div>
        `;

      }
    ).join("");

}



// ======================
// HELPERS
// ======================

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
