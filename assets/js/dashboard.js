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

const entryForm =
  document.getElementById(
    "entryForm"
  );

const tableBody =
  document.getElementById(
    "entriesTableBody"
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
// AUTO DAILY BUDGET
// ======================

function updateAutoDailyBudget() {

  const budgetField =
    document.getElementById(
      "dailyBudgetDisplay"
    );

  if(
    !budgetField ||
    !entryDateField
  ) return;


  const selectedDate =
    entryDateField.value;

  if(
    !selectedDate
  ) {

    budgetField.value =
      "";

    return;

  }


  const settings =
    getSettings();


  const monthlyBudget =
    Number(
      settings.monthlyBudget || 0
    );


  const date =
    new Date(
      selectedDate
    );


  const year =
    date.getFullYear();

  const month =
    date.getMonth();


  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  const dailyBudget =
    monthlyBudget /
    daysInMonth;


  const currency =
    settings.currency ||
    "RM";


  budgetField.value =
    `${currency}${dailyBudget.toFixed(2)}`;

}


// ======================
// FILTER CHANGE
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
// SAVE ENTRY
// ======================

function handleSaveEntry(
  e
) {

  e.preventDefault();


  const entry = {

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


  addEntry(
    entry
  );


  entryForm.reset();

  updateAutoDailyBudget();

  renderDashboard();

}


// ======================
// MAIN RENDER
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


  renderKPI(
    summary
  );


  renderTable(
    entries
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
// KPI
// ======================

function renderKPI(
  summary
) {

  const settings =
    getSettings();


  const currency =
    settings.currency ||
    "RM";


  updateKPIValue(
    "kpiMtdRevenue",
    summary.totalRevenue,
    currency
  );


  updateKPIValue(
    "kpiGop",
    summary.totalGop,
    currency
  );


  updateKPIValue(
    "kpiBudgetVariance",
    summary.budgetVariance,
    currency
  );


  const revenueAchievement =
    calculateAchievement(
      summary.totalRevenue,
      settings.annualRevenueTarget
    );


  const gopAchievement =
    calculateAchievement(
      summary.totalGop,
      settings.annualGopTarget
    );


  updateKPIPercent(
    "kpiAnnualRevenueTarget",
    revenueAchievement
  );


  updateKPIPercent(
    "kpiAnnualGopTarget",
    gopAchievement
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
    !target ||
    target <= 0
  ) {

    return 0;

  }

  return (
    current / target
  ) * 100;

}


function updateKPIValue(
  elementId,
  value,
  currency
) {

  const element =
    document.getElementById(
      elementId
    );

  if(!element) return;

  element.textContent =
    `${currency}${value.toFixed(2)}`;

}


function updateKPIPercent(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
    );

  if(!element) return;

  element.textContent =
    `${value.toFixed(2)}%`;

}


// ======================
// TABLE
// ======================

function renderTable(
  entries
) {

  if(
    !tableBody
  ) return;


  tableBody.innerHTML =
    "";


  const settings =
    getSettings();


  const currency =
    settings.currency ||
    "RM";


  entries.forEach(
    entry => {

      const data =
        calculateEntryMetrics(
          entry
        );


      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `
        <td>${entry.date}</td>
        <td>${currency}${data.totalRevenue.toFixed(2)}</td>
        <td>${currency}${data.totalCost.toFixed(2)}</td>
        <td>${currency}${data.gop.toFixed(2)}</td>
        <td><button>Edit</button></td>
        <td><button>Delete</button></td>
      `;


      tableBody.appendChild(
        row
      );

    }
  );

}


// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
