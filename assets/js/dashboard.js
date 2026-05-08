let selectedYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth() + 1;


// ======================
// ELEMENTS
// ======================

const yearFilter =
  document.getElementById("yearFilter");

const monthFilter =
  document.getElementById("monthFilter");

const entryForm =
  document.getElementById("entryForm");

const tableBody =
  document.getElementById(
    "entriesTableBody"
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

  if(!yearFilter) return;

  yearFilter.innerHTML = "";

  for(
    let year = 2025;
    year <= 2040;
    year++
  ) {

    const option =
      document.createElement("option");

    option.value = year;
    option.textContent = year;

    if(year === selectedYear) {
      option.selected = true;
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
      document.createElement("option");

    option.value = month;
    option.textContent = month;

    if(month === selectedMonth) {
      option.selected = true;
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
// SAVE ENTRY
// ======================

function handleSaveEntry(e) {

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
      ),

    foodCostPercent:
      Number(
        document.getElementById(
          "foodCostPercent"
        ).value || 0
      ),

    beverageCostPercent:
      Number(
        document.getElementById(
          "beverageCostPercent"
        ).value || 0
      ),

    fixedCostPercent:
      Number(
        document.getElementById(
          "fixedCostPercent"
        ).value || 0
      ),

    dailyBudget:
      Number(
        document.getElementById(
          "dailyBudget"
        ).value || 0
      )

  };

  addEntry(entry);

  entryForm.reset();

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

  renderKPI(summary);

  renderTable(entries);

  renderCharts(entries);

}


// ======================
// KPI
// ======================

function renderKPI(summary) {

  updateKPI(
    "kpiMtdRevenue",
    summary.totalRevenue
  );

  updateKPI(
    "kpiGop",
    summary.totalGop
  );

  updateKPI(
    "kpiBudgetVariance",
    summary.budgetVariance
  );

}


function updateKPI(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
    );

  if(!element) return;

  element.textContent =
    `RM${value.toFixed(2)}`;

}


// ======================
// TABLE
// ======================

function renderTable(entries) {

  if(!tableBody) return;

  tableBody.innerHTML = "";

  entries.forEach(entry => {

    const calculated =
      calculateEntryMetrics(
        entry
      );

    const row =
      document.createElement(
        "tr"
      );

    row.innerHTML = `
      <td>${entry.date}</td>

      <td>
        RM${calculated.totalRevenue.toFixed(2)}
      </td>

      <td>
        RM${calculated.totalCost.toFixed(2)}
      </td>

      <td>
        RM${calculated.gop.toFixed(2)}
      </td>

      <td>
        <button onclick="editEntry('${entry.id}')">
          Edit
        </button>
      </td>

      <td>
        <button onclick="removeEntry('${entry.id}')">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(
      row
    );

  });

}


// ======================
// DELETE
// ======================

function removeEntry(id) {

  deleteEntry(id);

  renderDashboard();

}


// ======================
// EDIT
// ======================

function editEntry(id) {

  const entry =
    getEntryById(id);

  if(!entry) return;

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

  document.getElementById(
    "foodCostPercent"
  ).value =
    entry.foodCostPercent;

  document.getElementById(
    "beverageCostPercent"
  ).value =
    entry.beverageCostPercent;

  document.getElementById(
    "fixedCostPercent"
  ).value =
    entry.fixedCostPercent;

  document.getElementById(
    "dailyBudget"
  ).value =
    entry.dailyBudget;

}


// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
