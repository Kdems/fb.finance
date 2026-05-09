let selectedYear =
  new Date().getFullYear();

let selectedMonth =
  new Date().getMonth() + 1;

let editingEntryId =
  null;


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

const entryForm =
  document.getElementById(
    "entryForm"
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


  if(entryForm) {

    entryForm.addEventListener(
      "submit",
      handleSaveEntry
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
// SAVE ENTRY
// ======================

function handleSaveEntry(
  e
) {

  e.preventDefault();


  const entryData = {

    date:
      document.getElementById(
        "entryDate"
      ).value,


    foodRevenue:
      Number(
        document.getElementById(
          "foodRevenue"
        ).value || 0
      ),


    beverageRevenue:
      Number(
        document.getElementById(
          "beverageRevenue"
        ).value || 0
      )

  };


  if(
    editingEntryId
  ) {

    updateEntry(
      editingEntryId,
      entryData
    );

    editingEntryId =
      null;

  }

  else {

    addEntry(
      entryData
    );

  }


  entryForm.reset();

  renderDashboard();

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
// AUTO DAILY BUDGET
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


  const daysInMonth =
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();


  const dailyBudget =
    settings.monthlyBudget /
    daysInMonth;


  budgetField.value =
    formatMoney(
      dailyBudget
    );

}


// ======================
// MAIN DASHBOARD
// ======================

function renderDashboard() {

  const currentEntries =
    filterEntries(
      selectedYear,
      selectedMonth
    );


  const lyEntries =
    filterEntries(
      selectedYear - 1,
      selectedMonth
    );


  const current =
    calculatePeriodSummary(
      currentEntries
    );


  const ly =
    calculatePeriodSummary(
      lyEntries
    );


  renderYtd(
    current,
    ly
  );


  renderMtd(
    current,
    ly
  );


  renderGop(
    current
  );


  renderFoodBeverage(
    current
  );


  renderSummary(
    currentEntries,
    current
  );


  if(
    typeof renderCharts ===
    "function"
  ) {

    renderCharts(
      currentEntries
    );

  }

}


// ======================
// YTD
// ======================

function renderYtd(
  current,
  ly
) {

  const settings =
    getSettings();


  const achievement =
    calculateAchievement(
      current.totalRevenue,
      settings.annualRevenueTarget
    );


  const growth =
    calculateGrowth(
      current.totalRevenue,
      ly.totalRevenue
    );


  updateCard(
    "ytdRevenueCard",
    formatMoney(
      current.totalRevenue
    )
  );


  updateCard(
    "ytdBudgetCard",
    formatMoney(
      settings.annualRevenueTarget
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

}


// ======================
// MTD
// ======================

function renderMtd(
  current,
  ly
) {

  const settings =
    getSettings();


  const today =
    new Date();


  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();


  let daysElapsed =
    daysInMonth;


  if(
    selectedYear ===
      today.getFullYear() &&
    selectedMonth ===
      today.getMonth() + 1
  ) {

    daysElapsed =
      today.getDate();

  }


  const daysLeft =
    daysInMonth -
    daysElapsed;


  const dailyPace =
    current.totalRevenue /
    Math.max(
      daysElapsed,
      1
    );


  const projection =
    dailyPace *
    daysInMonth;


  const gap =
    projection -
    settings.monthlyBudget;


  const growth =
    calculateGrowth(
      current.totalRevenue,
      ly.totalRevenue
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
      settings.monthlyBudget
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
    "daysLeftCard",
    `${daysLeft} Days`
  );


  updateCard(
    "dailyPaceCard",
    formatMoney(
      dailyPace
    )
  );


  updateCard(
    "projectionCard",
    formatMoney(
      projection
    )
  );


  updateCard(
    "gapToTargetCard",
    formatMoney(
      gap
    )
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
    "totalCostCard",
    formatMoney(
      current.totalCost
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


  let bestDay =
    null;


  let worstDay =
    null;


  entries.forEach(
    entry => {

      const revenue =
        Number(
          entry.foodRevenue || 0
        ) +
        Number(
          entry.beverageRevenue || 0
        );


      if(
        !bestDay ||
        revenue >
          bestDay.revenue
      ) {

        bestDay = {

          date:
            entry.date,

          revenue

        };

      }


      if(
        !worstDay ||
        revenue <
          worstDay.revenue
      ) {

        worstDay = {

          date:
            entry.date,

          revenue

        };

      }

    }
  );


  const avg =
    current.totalRevenue /
    Math.max(
      entries.length,
      1
    );


  const achievement =
    calculateAchievement(
      current.totalRevenue,
      settings.monthlyBudget
    );


  updateCard(
    "summaryRevenueCard",
    formatMoney(
      current.totalRevenue
    )
  );


  updateCard(
    "summaryBudgetCard",
    formatMoney(
      avg
    )
  );


  updateCard(
    "summaryAchievementCard",
    `${achievement.toFixed(2)}%`
  );


  updateCard(
    "bestDayCard",
    bestDay
      ? bestDay.date
      : "-"
  );


  updateCard(
    "worstDayCard",
    worstDay
      ? worstDay.date
      : "-"
  );

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

  if(
    !el
  ) return;


  el.innerHTML =
    value;

}


function calculateAchievement(
  current,
  target
) {

  if(
    !target
  ) return 0;


  return (
    current / target
  ) * 100;

}


function calculateGrowth(
  current,
  ly
) {

  if(
    !ly
  ) return 0;


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
    settings.currency ||
    "RM";


  const negative =
    amount < 0;


  amount =
    Math.abs(
      amount
    );


  const formatted =
    amount.toLocaleString(
      undefined,
      {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

      }
    );


  if(
    negative
  ) {

    return `-${currency}${formatted}`;

  }


  return `${currency}${formatted}`;

}


// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
