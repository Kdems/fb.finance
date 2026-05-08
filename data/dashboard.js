let selectedYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth() + 1;

const yearFilter =
  document.getElementById("yearFilter");

const monthFilter =
  document.getElementById("monthFilter");

const entryForm =
  document.getElementById("entryForm");

const tableBody =
  document.getElementById("entriesTableBody");


// ====================
// INIT
// ====================

function initDashboard() {

  populateYearFilter();

  populateMonthFilter();

  bindEvents();

  renderDashboard();

}


// ====================
// FILTERS
// ====================

function populateYearFilter() {

  for(let year = 2025; year <= 2040; year++) {

    const option =
      document.createElement("option");

    option.value = year;
    option.textContent = year;

    if(year === selectedYear) {
      option.selected = true;
    }

    yearFilter.appendChild(option);

  }

}


function populateMonthFilter() {

  for(let month = 1; month <= 12; month++) {

    const option =
      document.createElement("option");

    option.value = month;
    option.textContent = month;

    if(month === selectedMonth) {
      option.selected = true;
    }

    monthFilter.appendChild(option);

  }

}


// ====================
// EVENTS
// ====================

function bindEvents() {

  yearFilter.addEventListener(
    "change",
    handleFilterChange
  );

  monthFilter.addEventListener(
    "change",
    handleFilterChange
  );

  entryForm.addEventListener(
    "submit",
    handleSaveEntry
  );

}


function handleFilterChange() {

  selectedYear =
    Number(yearFilter.value);

  selectedMonth =
    Number(monthFilter.value);

  renderDashboard();

}


// ====================
// SAVE ENTRY
// ====================

function handleSaveEntry(e) {

  e.preventDefault();

  const entry = {

    date:
      document.getElementById("entryDate").value,

    foodRevenue:
      Number(document.getElementById("foodRevenue").value),

    beverageRevenue:
      Number(document.getElementById("beverageRevenue").value),

    foodCostPercent:
      Number(document.getElementById("foodCostPercent").value),

    beverageCostPercent:
      Number(document.getElementById("beverageCostPercent").value),

    fixedCostPercent:
      Number(document.getElementById("fixedCostPercent").value),

    dailyBudget:
      Number(document.getElementById("dailyBudget").value)

  };

  addEntry(entry);

  entryForm.reset();

  renderDashboard();

}


// ====================
// RENDER
// ====================

function renderDashboard() {

  const entries =
    filterEntries(
      selectedYear,
      selectedMonth
    );

  const summary =
    calculatePeriodSummary(entries);

  renderKPI(summary);

  renderTable(entries);

}


// ====================
// KPI
// ====================

function renderKPI(summary) {

  document.getElementById(
    "kpiMtdRevenue"
  ).textContent =
    `RM${summary.totalRevenue.toFixed(2)}`;


  document.getElementById(
    "kpiGop"
  ).textContent =
    `RM${summary.totalGop.toFixed(2)}`;


  document.getElementById(
    "kpiBudgetVariance"
  ).textContent =
    `RM${summary.budgetVariance.toFixed(2)}`;

}


// ====================
// TABLE
// ====================

function renderTable(entries) {

  tableBody.innerHTML = "";

  entries.forEach(entry => {

    const calculated =
      calculateEntryMetrics(entry);

    const row =
      document.createElement("tr");

    row.innerHTML = `
      <td>${entry.date}</td>
      <td>RM${calculated.totalRevenue.toFixed(2)}</td>
      <td>RM${calculated.totalCost.toFixed(2)}</td>
      <td>RM${calculated.gop.toFixed(2)}</td>
      <td>
        <button>Edit</button>
      </td>
      <td>
        <button onclick="removeEntry('${entry.id}')">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);

  });

}


// ====================
// DELETE
// ====================

function removeEntry(id) {

  deleteEntry(id);

  renderDashboard();

}


// ====================
// START
// ====================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
