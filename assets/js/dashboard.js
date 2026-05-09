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
// SAVE / UPDATE ENTRY
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

  updateAutoDailyBudget();

  renderDashboard();

}


// ======================
// EDIT
// ======================

function editEntry(
  entryId
) {

  const entry =
    getEntryById(
      entryId
    );

  if(
    !entry
  ) return;


  editingEntryId =
    entryId;


  document.getElementById(
    "entryDate"
  ).value =
    entry.date;


  document.getElementById(
    "foodRevenue"
  ).value =
    entry.foodRevenue;


  document.getElementById(
    "beverageRevenue"
  ).value =
    entry.beverageRevenue;


  updateAutoDailyBudget();

}


// ======================
// DELETE
// ======================

function removeEntry(
  entryId
) {

  deleteEntry(
    entryId
  );


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


  updateKPIPercent(
    "kpiAnnualRevenueTarget",
    calculateAchievement(
      summary.totalRevenue,
      settings.annualRevenueTarget
    )
  );


  updateKPIPercent(
    "kpiAnnualGopTarget",
    calculateAchievement(
      summary.totalGop,
      settings.annualGopTarget
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


function updateKPIValue(
  id,
  value,
  currency
) {

  const element =
    document.getElementById(
      id
    );

  if(
    !element
  ) return;


  element.textContent =
    `${currency}${value.toFixed(2)}`;

}


function updateKPIPercent(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );

  if(
    !element
  ) return;


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

        <td>
          <button
            onclick="editEntry('${entry.id}')"
          >
            Edit
          </button>
        </td>

        <td>
          <button
            onclick="removeEntry('${entry.id}')"
          >
            Delete
          </button>
        </td>
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
