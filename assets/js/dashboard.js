let selectedYear =
  new Date().getFullYear();

let selectedMonth =
  new Date().getMonth() + 1;



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

  yearFilter?.addEventListener(
    "change",
    onFilterChange
  );

  monthFilter?.addEventListener(
    "change",
    onFilterChange
  );

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


  renderMtd(
    current
  );

  renderRecentEntries(
    entries
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


  const lyRevenue =

    Number(
      settings.lyFoodRevenue || 0
    ) +

    Number(
      settings.lyBeverageRevenue || 0
    );


  const growth =
    calculateGrowth(
      current.totalRevenue,
      lyRevenue / 12
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
      lyRevenue / 12
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

function updateProgressBar(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );


  if (!el) return;


  const width =
    Math.min(
      value,
      100
    );


  el.style.width =
    width + "%";


  if (
    value >= 100
  ) {

    el.className =
      "h-2 rounded-full bg-green-500";

    return;

  }


  if (
    value >= 90
  ) {

    el.className =
      "h-2 rounded-full bg-yellow-500";

    return;

  }


  el.className =
    "h-2 rounded-full bg-red-500";

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
