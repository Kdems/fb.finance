let selectedYear =
  new Date().getFullYear();

let selectedMonth =
  new Date().getMonth() + 1;



// ====================
// INIT
// ====================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);


function initDashboard() {

  setupFilters();

  renderDashboard();

}



// ====================
// FILTERS
// ====================

function setupFilters() {

  const yearFilter =
    document.getElementById(
      "yearFilter"
    );

  const monthFilter =
    document.getElementById(
      "monthFilter"
    );


  if (
    yearFilter
  ) {

    yearFilter.innerHTML =
      "";

    for (
      let y = 2025;
      y <= 2040;
      y++
    ) {

      yearFilter.innerHTML += `
        <option
          value="${y}"
          ${
            y === selectedYear
              ? "selected"
              : ""
          }>
          ${y}
        </option>
      `;

    }

  }



  if (
    monthFilter
  ) {

    monthFilter.innerHTML =
      "";

    for (
      let m = 1;
      m <= 12;
      m++
    ) {

      monthFilter.innerHTML += `
        <option
          value="${m}"
          ${
            m === selectedMonth
              ? "selected"
              : ""
          }>
          ${m}
        </option>
      `;

    }

  }



  if (
    yearFilter
  ) {

    yearFilter.onchange =
      function () {

        selectedYear =
          Number(
            this.value
          );

        renderDashboard();

      };

  }



  if (
    monthFilter
  ) {

    monthFilter.onchange =
      function () {

        selectedMonth =
          Number(
            this.value
          );

        renderDashboard();

      };

  }

}





// ====================
// MAIN
// ====================

function renderDashboard() {

  const entries =
    filterEntries(
      selectedYear,
      selectedMonth
    );

  const data =
    calculatePeriodSummary(
      entries
    );

  const settings =
    getSettings();


  renderYtd(
    data,
    settings
  );

  renderMtd(
    data,
    settings,
    entries
  );

  renderGop(
    data
  );

  renderFoodBeverage(
    data
  );

  renderSummary(
    entries,
    data,
    settings
  );

  renderRecentEntries(
    entries,
    settings
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





// ====================
// YTD
// ====================

function renderYtd(
  data,
  settings
) {

  const budget =
    Number(
      settings.annualRevenueTarget || 0
    );

  const lyRevenue =
    getLyRevenue();

  const achievement =
    percentage(
      data.totalRevenue,
      budget
    );

  const lyAchievement =
    percentage(
      lyRevenue,
      budget
    );

  const variance =
    data.totalRevenue -
    budget;

  const remaining =
    budget -
    data.totalRevenue;

  const growth =
    percentageChange(
      data.totalRevenue,
      lyRevenue
    );

  const diff =
    achievement -
    lyAchievement;


  setText(
    "ytdRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "ytdBudgetCard",
    money(
      budget
    )
  );

  setText(
    "ytdAchievementCard",
    percent(
      achievement
    )
  );

  setText(
    "ytdVarianceCard",
    money(
      variance
    )
  );

  setText(
    "ytdBalanceCard",
    money(
      remaining
    )
  );

  setText(
    "lyRevenueCard",
    money(
      lyRevenue
    )
  );

  setText(
    "lyAchievementCard",
    percent(
      lyAchievement
    )
  );

  setText(
    "ytdGrowthCard",
    percent(
      growth
    )
  );

  setText(
    "achievementDiffCard",
    percent(
      diff
    )
  );


  setBar(
    "ytdProgressBar",
    achievement
  );

}





// ====================
// MTD
// ====================

function renderMtd(
  data,
  settings,
  entries
) {

  const budget =
    Number(
      settings.monthlyBudget || 0
    );

  const achievement =
    percentage(
      data.totalRevenue,
      budget
    );

  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();

  const avgDaily =

    entries.length > 0

      ? data.totalRevenue /
        entries.length

      : 0;


  const projection =
    avgDaily *
    daysInMonth;

  const gap =
    projection -
    budget;


  setText(
    "mtdRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "mtdBudgetCard",
    money(
      budget
    )
  );

  setText(
    "projectionCard",
    money(
      projection
    )
  );

  setText(
    "projectionGapCard",
    money(
      gap
    )
  );

  setText(
    "mtdAchievementCard",
    percent(
      achievement
    )
  );


  setBar(
    "mtdProgressBar",
    achievement
  );

}





// ====================
// GOP
// ====================

function renderGop(
  data
) {

  setText(
    "gopRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "gopCostCard",
    money(
      data.totalCost
    )
  );

  setText(
    "gopMainCard",
    money(
      data.totalGop
    )
  );

  setText(
    "gopMarginCard",
    percent(
      data.gopMargin
    )
  );

}





// ====================
// F&B
// ====================

function renderFoodBeverage(
  data
) {

  setText(
    "foodRevenueCard",
    money(
      data.totalFoodRevenue
    )
  );

  setText(
    "foodCostCard",
    money(
      data.foodCost
    )
  );

  setText(
    "bevRevenueCard",
    money(
      data.totalBeverageRevenue
    )
  );

  setText(
    "bevCostCard",
    money(
      data.beverageCost
    )
  );

  setText(
    "fixCostCard",
    money(
      data.fixCost
    )
  );

}





// ====================
// SUMMARY
// ====================

function renderSummary(
  entries,
  data,
  settings
) {

  const achievement =
    percentage(
      data.totalRevenue,
      settings.monthlyBudget
    );


  setText(
    "summaryRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "summaryBudgetCard",
    money(
      settings.monthlyBudget
    )
  );

  setText(
    "summaryAchievementCard",
    percent(
      achievement
    )
  );


  const best =
    getBestEntry(
      entries
    );

  const worst =
    getWorstEntry(
      entries
    );


  setText(
    "bestDayCard",
    best
      ? formatDate(
          best.date
        )
      : "-"
  );

  setText(
    "worstDayCard",
    worst
      ? formatDate(
          worst.date
        )
      : "-"
  );

}





// ====================
// RECENT
// ====================

function renderRecentEntries(
  entries,
  settings
) {

  const el =
    document.getElementById(
      "recentEntriesList"
    );

  if (!el) return;


  el.innerHTML =
    entries
      .slice()
      .reverse()
      .map(
        entry => {

          const revenue =

            Number(
              entry.foodRevenue || 0
            ) +

            Number(
              entry.beverageRevenue || 0
            );

          const variance =
            revenue -
            settings.monthlyBudget / 31;


          return `
            <div class="grid grid-cols-4 border-b py-3">

              <div>
                ${formatDate(entry.date)}
              </div>

              <div>
                ${money(revenue)}
              </div>

              <div>
                ${money(variance)}
              </div>

              <div>
                ${percent(
                  percentage(
                    revenue,
                    settings.monthlyBudget / 31
                  )
                )}
              </div>

            </div>
          `;

        }
      )
      .join("");

}





// ====================
// HELPERS
// ====================

function setText(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );

  if (
    el
  ) {

    el.innerHTML =
      value;

  }

}


function setBar(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );

  if (
    el
  ) {

    el.style.width =
      Math.min(
        value,
        100
      ) + "%";

  }

}


function percentage(
  actual,
  target
) {

  if (!target)
    return 0;

  return (
    actual / target
  ) * 100;

}


function percentageChange(
  current,
  old
) {

  if (!old)
    return 0;

  return (
    (
      current - old
    ) / old
  ) * 100;

}


function percent(
  value
) {

  return (
    Number(
      value || 0
    ).toFixed(1) +
    "%"
  );

}


function money(
  value
) {

  const currency =
    getSettings()
      .currency || "RM";

  return (
    currency +
    Number(
      value || 0
    ).toLocaleString(
      undefined,
      {
        maximumFractionDigits: 0
      }
    )
  );

}


function getLyRevenue() {

  const s =
    getSettings();

  return (

    Number(
      s.lyFoodRevenue || 0
    ) +

    Number(
      s.lyBeverageRevenue || 0
    )

  );

}


function formatDate(
  date
) {

  return new Date(
    date
  ).toLocaleDateString(
    "en-GB"
  );

}
