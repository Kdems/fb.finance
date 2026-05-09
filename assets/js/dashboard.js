let selectedYear =
  new Date().getFullYear();

let selectedMonth =
  new Date().getMonth() + 1;



// ======================
// INIT
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);



function initDashboard() {

  populateFilters();

  bindFilters();

  renderDashboard();

}



// ======================
// FILTERS
// ======================

function populateFilters() {

  const yearFilter =
    document.getElementById(
      "yearFilter"
    );


  const monthFilter =
    document.getElementById(
      "monthFilter"
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
            year === selectedYear
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
            month === selectedMonth
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
      "yearFilter"
    );


  const monthFilter =
    document.getElementById(
      "monthFilter"
    );



  if (
    yearFilter
  ) {

    yearFilter.addEventListener(
      "change",
      function() {

        selectedYear =
          Number(
            this.value
          );


        renderDashboard();

      }
    );

  }



  if (
    monthFilter
  ) {

    monthFilter.addEventListener(
      "change",
      function() {

        selectedMonth =
          Number(
            this.value
          );


        renderDashboard();

      }
    );

  }

}



// ======================
// MAIN
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



  renderKpi(
    summary
  );



  renderFoodBeverage(
    summary
  );



  renderRecentEntries(
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
    "ytdRevenueCard",
    formatMoney(
      summary.totalRevenue
    )
  );



  setText(
    "ytdBudgetCard",
    formatMoney(
      summary.totalBudget
    )
  );



  setText(
    "ytdAchievementCard",
    formatPercent(
      summary.achievement
    )
  );



  setText(
    "gopMarginCard",
    formatPercent(
      summary.gopMargin
    )
  );

}



// ======================
// FOOD / BEVERAGE
// ======================

function renderFoodBeverage(
  summary
) {

  setText(
    "foodRevenueCard",
    formatMoney(
      summary.totalFoodRevenue
    )
  );



  setText(
    "bevRevenueCard",
    formatMoney(
      summary.totalBeverageRevenue
    )
  );

}



// ======================
// RECENT
// ======================

function renderRecentEntries(
  entries
) {

  const container =
    document.getElementById(
      "recentEntriesList"
    );



  if (
    !container
  ) return;



  container.innerHTML =
    "";



  if (
    entries.length === 0
  ) {

    container.innerHTML =

      `
      <div class="text-slate-400">
        No entries found
      </div>
      `;

    return;

  }



  const reversed =
    [...entries].reverse();



  reversed.forEach(
    entry => {

      const revenue =

        Number(
          entry.foodRevenue || 0
        )

        +

        Number(
          entry.beverageRevenue || 0
        );



      container.innerHTML +=

        `
        <div class="grid grid-cols-4 border-b py-4">

          <div>
            ${entry.date}
          </div>

          <div>
            ${formatMoney(
              entry.foodRevenue
            )}
          </div>

          <div>
            ${formatMoney(
              entry.beverageRevenue
            )}
          </div>

          <div>
            ${formatMoney(
              revenue
            )}
          </div>

        </div>
        `;

    }
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
