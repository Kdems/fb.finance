let reportYear =
  new Date().getFullYear();

let reportMonth =
  new Date().getMonth() + 1;


// ======================
// ELEMENTS
// ======================

const reportYearFilter =
  document.getElementById(
    "reportYearFilter"
  );

const reportMonthFilter =
  document.getElementById(
    "reportMonthFilter"
  );

const reportTypeFilter =
  document.getElementById(
    "reportTypeFilter"
  );

const reportTableBody =
  document.getElementById(
    "reportTableBody"
  );


// ======================
// INIT
// ======================

function initReports() {

  populateReportYears();

  populateReportMonths();

  bindReportEvents();

  renderReports();

}


// ======================
// FILTERS
// ======================

function populateReportYears() {

  if(!reportYearFilter) return;

  for(
    let year = 2025;
    year <= 2040;
    year++
  ) {

    const option =
      document.createElement(
        "option"
      );

    option.value = year;
    option.textContent = year;

    if(year === reportYear) {
      option.selected = true;
    }

    reportYearFilter.appendChild(
      option
    );

  }

}


function populateReportMonths() {

  if(!reportMonthFilter) return;

  for(
    let month = 1;
    month <= 12;
    month++
  ) {

    const option =
      document.createElement(
        "option"
      );

    option.value = month;
    option.textContent = month;

    if(month === reportMonth) {
      option.selected = true;
    }

    reportMonthFilter.appendChild(
      option
    );

  }

}


// ======================
// EVENTS
// ======================

function bindReportEvents() {

  if(reportYearFilter) {

    reportYearFilter.addEventListener(
      "change",
      handleReportFilterChange
    );

  }

  if(reportMonthFilter) {

    reportMonthFilter.addEventListener(
      "change",
      handleReportFilterChange
    );

  }

}


function handleReportFilterChange() {

  reportYear =
    Number(
      reportYearFilter.value
    );

  reportMonth =
    Number(
      reportMonthFilter.value
    );

  renderReports();

}


// ======================
// MAIN RENDER
// ======================

function renderReports() {

  const entries =
    filterEntries(
      reportYear,
      reportMonth
    );

  const summary =
    calculatePeriodSummary(
      entries
    );

  renderReportKPIs(
    summary
  );

  renderReportTable(
    entries
  );

}


// ======================
// KPI
// ======================

function renderReportKPIs(
  summary
) {

  updateReportValue(
    "reportTotalRevenue",
    summary.totalRevenue
  );

  updateReportValue(
    "reportTotalCost",
    summary.totalCost
  );

  updateReportValue(
    "reportTotalGop",
    summary.totalGop
  );

  updateReportPercent(
    "reportGopMargin",
    summary.gopMargin
  );

  updateReportValue(
    "reportBudgetVariance",
    summary.budgetVariance
  );

}


function updateReportValue(
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


function updateReportPercent(
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

function renderReportTable(
  entries
) {

  if(!reportTableBody) return;

  reportTableBody.innerHTML = "";

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
        RM${entry.foodRevenue.toFixed(2)}
      </td>

      <td>
        RM${entry.beverageRevenue.toFixed(2)}
      </td>

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
        RM${entry.dailyBudget.toFixed(2)}
      </td>

      <td>
        RM${calculated.budgetVariance.toFixed(2)}
      </td>
    `;

    reportTableBody.appendChild(
      row
    );

  });

}


// ======================
// PRINT
// ======================

function printReport() {

  window.print();

}


// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initReports
);
