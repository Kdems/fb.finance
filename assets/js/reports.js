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

  if(
    !reportYearFilter
  ) return;


  reportYearFilter.innerHTML =
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
      year === reportYear
    ) {

      option.selected =
        true;

    }


    reportYearFilter.appendChild(
      option
    );

  }

}


function populateReportMonths() {

  if(
    !reportMonthFilter
  ) return;


  reportMonthFilter.innerHTML =
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
      month === reportMonth
    ) {

      option.selected =
        true;

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

  if(
    reportYearFilter
  ) {

    reportYearFilter.addEventListener(
      "change",
      handleFilterChange
    );

  }


  if(
    reportMonthFilter
  ) {

    reportMonthFilter.addEventListener(
      "change",
      handleFilterChange
    );

  }

}


function handleFilterChange() {

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
// RENDER
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


  renderReportKPI(
    summary
  );


  renderReportTable(
    entries
  );

}


// ======================
// KPI
// ======================

function renderReportKPI(
  summary
) {

  const settings =
    getSettings();

  const currency =
    settings.currency ||
    "RM";


  updateMoney(
    "reportTotalRevenue",
    summary.totalRevenue,
    currency
  );


  updateMoney(
    "reportTotalCost",
    summary.totalCost,
    currency
  );


  updateMoney(
    "reportTotalGop",
    summary.totalGop,
    currency
  );


  updatePercent(
    "reportGopMargin",
    summary.gopMargin
  );


  updateMoney(
    "reportBudgetVariance",
    summary.budgetVariance,
    currency
  );

}


function updateMoney(
  elementId,
  value,
  currency
) {

  const element =
    document.getElementById(
      elementId
    );

  if(
    !element
  ) return;


  element.textContent =
    `${currency}${value.toFixed(2)}`;

}


function updatePercent(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
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

function renderReportTable(
  entries
) {

  if(
    !reportTableBody
  ) return;


  reportTableBody.innerHTML =
    "";


  const settings =
    getSettings();

  const currency =
    settings.currency ||
    "RM";


  entries.forEach(
    entry => {

      const calculated =
        calculateEntryMetrics(
          entry
        );


      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `
        <td class="py-4">
          ${entry.date}
        </td>

        <td>
          ${currency}${entry.foodRevenue.toFixed(2)}
        </td>

        <td>
          ${currency}${entry.beverageRevenue.toFixed(2)}
        </td>

        <td>
          ${currency}${calculated.totalRevenue.toFixed(2)}
        </td>

        <td>
          ${currency}${calculated.totalCost.toFixed(2)}
        </td>

        <td>
          ${currency}${calculated.gop.toFixed(2)}
        </td>

        <td>
          ${currency}${entry.dailyBudget.toFixed(2)}
        </td>

        <td>
          ${currency}${calculated.budgetVariance.toFixed(2)}
        </td>
      `;


      reportTableBody.appendChild(
        row
      );

    }
  );

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
