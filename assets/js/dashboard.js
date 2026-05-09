let selectedYear =
  new Date().getFullYear();

let selectedMonth =
  new Date().getMonth() + 1;



document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);




// ====================
// INIT
// ====================

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
      function() {

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
      function() {

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


  renderAlerts(
    data,
    entries
  );

  renderYtd(
    data
  );

  renderMtd(
    data,
    entries
  );

  renderGop(
    data
  );

  renderFoodBeverage(
    data
  );

  renderSummary(
    data,
    entries
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





// ====================
// ALERTS
// ====================

function renderAlerts(
  data,
  entries
) {

  const settings =
    getSettings();


  const monthlyBudget =
    Number(
      settings.monthlyBudget || 0
    );


  const achievement =
    percentage(
      data.totalRevenue,
      monthlyBudget
    );


  const revenueStatus =

    achievement >= 100

      ? "🟢 ON TRACK"

      : achievement >= 80

      ? "🟡 WATCH"

      : "🔴 RISK";



  const margin =
    percentage(
      data.totalGop,
      data.totalRevenue
    );


  const marginStatus =

    margin >= 50

      ? "🟢 STRONG"

      : margin >= 35

      ? "🟡 WATCH"

      : "🔴 LOW";



  const foodCost =
    percentage(
      data.foodCost,
      data.totalFoodRevenue
    );


  const foodStatus =

    foodCost <= 35

      ? "🟢 GOOD"

      : "🔴 HIGH";



  const avg =
    entries.length
      ? data.totalRevenue /
        entries.length
      : 0;


  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();


  const projection =
    avg *
    daysInMonth;


  const projectionStatus =

    projection >= monthlyBudget

      ? "🟢 SAFE"

      : "🔴 BELOW";



  setText(
    "revenueAlertCard",
    revenueStatus
  );

  setText(
    "projectionAlertCard",
    projectionStatus
  );

  setText(
    "foodAlertCard",
    foodStatus
  );

  setText(
    "marginAlertCard",
    marginStatus
  );

}





// ====================
// YTD
// ====================

function renderYtd(
  data
) {

  const settings =
    getSettings();


  const budget =
    Number(
      settings.annualRevenueTarget || 0
    );


  const achievement =
    percentage(
      data.totalRevenue,
      budget
    );


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
      data.totalRevenue -
      budget
    )
  );

}





// ====================
// MTD
// ====================

function renderMtd(
  data,
  entries
) {

  const settings =
    getSettings();


  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();


  const daysPassed =
    entries.length || 1;


  const daysLeft =
    daysInMonth -
    daysPassed;


  const avg =
    data.totalRevenue /
    daysPassed;


  const projection =
    avg *
    daysInMonth;


  const gap =
    projection -
    settings.monthlyBudget;


  setText(
    "mtdRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "dailyPaceCard",
    money(
      avg
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
    "daysLeftCard",
    daysLeft
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
      percentage(
        data.totalGop,
        data.totalRevenue
      )
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
    "bevRevenueCard",
    money(
      data.totalBeverageRevenue
    )
  );

  setText(
    "foodMixCard",
    percent(
      percentage(
        data.totalFoodRevenue,
        data.totalRevenue
      )
    )
  );

  setText(
    "bevMixCard",
    percent(
      percentage(
        data.totalBeverageRevenue,
        data.totalRevenue
      )
    )
  );

}





// ====================
// SUMMARY
// ====================

function renderSummary(
  data,
  entries
) {

  setText(
    "summaryRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "summaryBudgetCard",
    money(
      getSettings()
        .monthlyBudget
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
  entries
) {

  const el =
    document.getElementById(
      "recentEntriesList"
    );


  if (!el)
    return;


  el.innerHTML =
    entries
      .slice()
      .reverse()
      .map(
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


          return `
            <div class="grid grid-cols-4 border-b py-3">

              <div>
                ${formatDate(
                  entry.date
                )}
              </div>

              <div>
                ${money(
                  food
                )}
              </div>

              <div>
                ${money(
                  bev
                )}
              </div>

              <div>
                ${money(
                  total
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

  return (

    getSettings()
      .currency +

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


function formatDate(
  value
) {

  return new Date(
    value
  ).toLocaleDateString(
    "en-GB"
  );

}
