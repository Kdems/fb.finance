let reportYear =
  new Date().getFullYear();

let reportMonth =
  new Date().getMonth() + 1;



// ======================
// INIT
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initReportsPage
);



function initReportsPage() {

  populateFilters();

  bindFilters();

  renderReport();

}



// ======================
// FILTERS
// ======================

function populateFilters() {

  const yearFilter =
    document.getElementById(
      "reportYear"
    );


  const monthFilter =
    document.getElementById(
      "reportMonth"
    );



  if (
    yearFilter
  ) {

    yearFilter.innerHTML =
      "";



    for (
      let year = 2025;
      year <= 2040;
      year++
    ) {

      yearFilter.innerHTML +=

        `
        <option
          value="${year}"
          ${
            year === reportYear
              ? "selected"
              : ""
          }>
          ${year}
        </option>
        `;

    }

  }



  if (
    monthFilter
  ) {

    monthFilter.innerHTML =
      "";



    for (
      let month = 1;
      month <= 12;
      month++
    ) {

      monthFilter.innerHTML +=

        `
        <option
          value="${month}"
          ${
            month === reportMonth
              ? "selected"
              : ""
          }>
          ${month}
        </option>
        `;

    }

  }

}



// ======================
// EVENTS
// ======================

function bindFilters() {

  const yearFilter =
    document.getElementById(
      "reportYear"
    );


  const monthFilter =
    document.getElementById(
      "reportMonth"
    );



  if (
    yearFilter
  ) {

    yearFilter.addEventListener(
      "change",
      function() {

        reportYear =
          Number(
            this.value
          );


        renderReport();

      }
    );

  }



  if (
    monthFilter
  ) {

    monthFilter.addEventListener(
      "change",
      function() {

        reportMonth =
          Number(
            this.value
          );


        renderReport();

      }
    );

  }

}



// ======================
// MAIN
// ======================

function renderReport() {

  const entries =
    filterEntries(
      reportYear,
      reportMonth
    );



  const summary =
    calculatePeriodSummary(
      entries
    );



  renderKpi(
    summary
  );



  renderTable(
    entries
  );

}



// ======================
// KPI
// ======================

function renderKpi(
  summary
) {

  setText(
    "reportRevenue",
    formatMoney(
      summary.totalRevenue
    )
  );



  setText(
    "reportBudget",
    formatMoney(
      summary.totalBudget
    )
  );



  setText(
    "reportAchievement",
    formatPercent(
      summary.achievement
    )
  );



  setText(
    "reportGop",
    formatMoney(
      summary.totalGop
    )
  );



  setText(
    "reportMargin",
    formatPercent(
      summary.gopMargin
    )
  );

}



// ======================
// TABLE
// ======================

function renderTable(
  entries
) {

  const tbody =
    document.getElementById(
      "reportTableBody"
    );



  if (
    !tbody
  ) return;



  tbody.innerHTML =
    "";



  if (
    entries.length === 0
  ) {

    tbody.innerHTML =

      `
      <tr>
        <td colspan="6" class="py-6 text-center text-slate-400">
          No report data found
        </td>
      </tr>
      `;

    return;

  }



  const sorted =
    [...entries].sort(
      (
        a,
        b
      ) =>

        new Date(
          a.date
        )

        -

        new Date(
          b.date
        )
    );



  sorted.forEach(
    entry => {

      const calc =
        calculateEntryMetrics(
          entry
        );



      tbody.innerHTML +=

        `
        <tr class="border-b">

          <td class="py-4">
            ${entry.date}
          </td>

          <td>
            ${formatMoney(
              entry.foodRevenue
            )}
          </td>

          <td>
            ${formatMoney(
              entry.beverageRevenue
            )}
          </td>

          <td>
            ${formatMoney(
              calc.totalRevenue
            )}
          </td>

          <td>
            ${formatMoney(
              calc.totalCost
            )}
          </td>

          <td>
            ${formatMoney(
              calc.gop
            )}
          </td>

        </tr>
        `;

    }
  );

}



// ======================
// EXPORT CSV
// ======================

function exportReportCSV() {

  const entries =
    filterEntries(
      reportYear,
      reportMonth
    );



  if (
    entries.length === 0
  ) {

    alert(
      "No data to export."
    );

    return;

  }



  let csv =

    "Date,Food,Beverage,Revenue,Cost,GOP\n";



  entries.forEach(
    entry => {

      const calc =
        calculateEntryMetrics(
          entry
        );



      csv +=

        `${entry.date},`

        +

        `${entry.foodRevenue},`

        +

        `${entry.beverageRevenue},`

        +

        `${calc.totalRevenue},`

        +

        `${calc.totalCost},`

        +

        `${calc.gop}\n`;

    }
  );



  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv"
      }
    );



  const url =
    URL.createObjectURL(
      blob
    );



  const link =
    document.createElement(
      "a"
    );



  link.href =
    url;



  link.download =

    `skybar-report-${reportYear}-${reportMonth}.csv`;



  link.click();



  URL.revokeObjectURL(
    url
  );

}



// ======================
// HELPER
// ======================

function setText(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );



  if (
    !el
  ) return;



  el.innerHTML =
    value;

}
