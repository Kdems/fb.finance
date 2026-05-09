let reportYear =
  new Date().getFullYear();

let reportMonth =
  new Date().getMonth() + 1;



// ======================
// INIT
// ======================

function initReportsPage() {

  populateYearFilter();

  populateMonthFilter();

  bindFilters();

  renderReport();

}



// ======================
// FILTERS
// ======================

function populateYearFilter() {

  const select =
    document.getElementById(
      "reportYear"
    );


  if(
    !select
  ) return;


  select.innerHTML =
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


    select.appendChild(
      option
    );

  }

}


function populateMonthFilter() {

  const select =
    document.getElementById(
      "reportMonth"
    );


  if(
    !select
  ) return;


  select.innerHTML =
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


    select.appendChild(
      option
    );

  }

}



// ======================
// EVENTS
// ======================

function bindFilters() {

  const year =
    document.getElementById(
      "reportYear"
    );


  const month =
    document.getElementById(
      "reportMonth"
    );


  if(
    year
  ) {

    year.addEventListener(
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


  if(
    month
  ) {

    month.addEventListener(
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


  const settings =
    getSettings();


  const monthlyBudget =
    Number(
      settings.monthlyBudget || 0
    );


  const achievement =
    monthlyBudget > 0
      ? (
          summary.totalRevenue /
          monthlyBudget
        ) * 100
      : 0;


  updateText(
    "reportRevenue",
    formatMoney(
      summary.totalRevenue
    )
  );


  updateText(
    "reportBudget",
    formatMoney(
      monthlyBudget
    )
  );


  updateText(
    "reportAchievement",
    `${achievement.toFixed(2)}%`
  );


  updateText(
    "reportGop",
    formatMoney(
      summary.totalGop
    )
  );


  updateText(
    "reportMargin",
    `${summary.gopMargin.toFixed(2)}%`
  );


  renderReportTable(
    entries
  );

}



// ======================
// TABLE
// ======================

function renderReportTable(
  entries
) {

  const tbody =
    document.getElementById(
      "reportTableBody"
    );


  if(
    !tbody
  ) return;


  tbody.innerHTML =
    "";


  if(
    entries.length === 0
  ) {

    tbody.innerHTML =
      `
      <tr>
        <td colspan="6" class="py-4 text-center text-slate-400">
          No data found
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
        ) -
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


      const row =
        document.createElement(
          "tr"
        );


      row.className =
        "border-b";


      row.innerHTML =
        `
        <td class="py-3">
          ${entry.date}
        </td>

        <td>
          ${formatMoney(entry.foodRevenue)}
        </td>

        <td>
          ${formatMoney(entry.beverageRevenue)}
        </td>

        <td>
          ${formatMoney(calc.totalRevenue)}
        </td>

        <td>
          ${formatMoney(calc.totalCost)}
        </td>

        <td>
          ${formatMoney(calc.gop)}
        </td>
        `;


      tbody.appendChild(
        row
      );

    }
  );

}



// ======================
// HELPERS
// ======================

function updateText(
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



// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initReportsPage
);
