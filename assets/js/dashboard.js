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
// KPI BLOCKS
// ======================

function renderYtd(current) {}
function renderMtd(current) {}
function renderGop(current) {}
function renderFoodBeverage(current) {}
function renderSummary(entries, current) {}



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

  const monthlyBudget =
    Number(
      settings.monthlyBudget || 0
    );

  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();

  const dailyBudget =
    monthlyBudget /
    daysInMonth;



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


        const status =
          achievement >= 100
            ? "🟢"
            : "🔴";


        return `

        <div class="border rounded-xl p-4 flex justify-between">

          <div>

            <div class="font-medium">
              ${new Date(entry.date).toLocaleDateString("en-GB")}
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
              ${status}
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

function calculateAchievement(
  current,
  target
) {

  if (!target) return 0;

  return (
    current / target
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
