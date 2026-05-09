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

  yearFilter.innerHTML = "";

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

  monthFilter.innerHTML = "";

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
// ENTRY
// ======================

function handleSaveEntry(
  e
) {

  e.preventDefault();


  const data = {

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
      data
    );

    editingEntryId =
      null;

  }

  else {

    addEntry(
      data
    );

  }


  entryForm.reset();

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
    settings.monthlyBudget /
    days;


  budgetField.value =
    formatMoney(
      dailyBudget
    );

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
// DASHBOARD
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
    current,
    ly
  );


  renderFoodBeverage(
    current,
    ly
  );


  renderSummary(
    current
  );

}


// ======================
// KPI
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


  setSmartCard(
    "ytdRevenueCard",
    formatMoney(
      current.totalRevenue
    )
  );


  setSmartCard(
    "ytdAchievementCard",
    `${achievement.toFixed(2)}%`,
    achievement
  );


  setSmartCard(
    "ytdGrowthCard",
    `${growth.toFixed(2)}%`,
    growth
  );

}


function renderMtd(
  current,
  ly
) {

  const growth =
    calculateGrowth(
      current.totalRevenue,
      ly.totalRevenue
    );


  setSmartCard(
    "mtdRevenueCard",
    formatMoney(
      current.totalRevenue
    )
  );


  setSmartCard(
    "mtdGrowthCard",
    `${growth.toFixed(2)}%`,
    growth
  );

}


function renderGop(
  current,
  ly
) {

  const growth =
    calculateGrowth(
      current.totalGop,
      ly.totalGop
    );


  setSmartCard(
    "gopMainCard",
    formatMoney(
      current.totalGop
    )
  );


  setSmartCard(
    "gopGrowthCard",
    `${growth.toFixed(2)}%`,
    growth
  );

}


function renderFoodBeverage(
  current,
  ly
) {

  const foodGrowth =
    calculateGrowth(
      current.totalFoodRevenue,
      ly.totalFoodRevenue
    );


  const bevGrowth =
    calculateGrowth(
      current.totalBeverageRevenue,
      ly.totalBeverageRevenue
    );


  setSmartCard(
    "foodRevenueCard",
    formatMoney(
      current.totalFoodRevenue
    )
  );


  setSmartCard(
    "foodGrowthCard",
    `${foodGrowth.toFixed(2)}%`,
    foodGrowth
  );


  setSmartCard(
    "bevRevenueCard",
    formatMoney(
      current.totalBeverageRevenue
    )
  );


  setSmartCard(
    "bevGrowthCard",
    `${bevGrowth.toFixed(2)}%`,
    bevGrowth
  );

}


function renderSummary(
  current
) {

  setSmartCard(
    "summaryRevenueCard",
    formatMoney(
      current.totalRevenue
    )
  );

}


// ======================
// HELPERS
// ======================

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


// ======================
// FULL FINANCE FORMAT
// ======================

function formatMoney(
  amount
) {

  const settings =
    getSettings();


  const currency =
    settings.currency || "RM";


  const negative =
    amount < 0;


  amount =
    Math.abs(
      amount
    );


  let formatted =
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
// COLORS
// ======================

function getTheme(
  metric
) {

  if(
    metric >= 100
  ) {

    return "bg-green-50 text-green-700";

  }


  if(
    metric >= 80
  ) {

    return "bg-yellow-50 text-yellow-700";

  }


  return "bg-red-50 text-red-700";

}


function setSmartCard(
  id,
  value,
  metric = null
) {

  const element =
    document.getElementById(
      id
    );

  if(
    !element
  ) return;


  let theme =
    "bg-slate-50 text-slate-700";


  if(
    metric !== null
  ) {

    theme =
      getTheme(
        metric
      );

  }


  element.innerHTML =
    `
      <div class="${theme} rounded-xl p-4 text-center font-bold text-xl">
        ${value}
      </div>
    `;

}


// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
