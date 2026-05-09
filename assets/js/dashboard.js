let selectedYear =
  new Date().getFullYear();

let selectedMonth =
  new Date().getMonth() + 1;



document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);



function initDashboard() {

  setupFilters();

  renderDashboard();

}





// ====================
// FILTERS
// ====================

function setupFilters() {

  const yearFilter =
    document.getElementById(
      "yearFilter"
    );

  const monthFilter =
    document.getElementById(
      "monthFilter"
    );


  for (
    let y = 2025;
    y <= 2040;
    y++
  ) {

    yearFilter.innerHTML += `
      <option
        value="${y}"
        ${
          y === selectedYear
            ? "selected"
            : ""
        }>
        ${y}
      </option>
    `;

  }



  for (
    let m = 1;
    m <= 12;
    m++
  ) {

    monthFilter.innerHTML += `
      <option
        value="${m}"
        ${
          m === selectedMonth
            ? "selected"
            : ""
        }>
        ${m}
      </option>
    `;

  }



  yearFilter.onchange =
    function() {

      selectedYear =
        Number(
          this.value
        );

      renderDashboard();

    };


  monthFilter.onchange =
    function() {

      selectedMonth =
        Number(
          this.value
        );

      renderDashboard();

    };

}





// ====================
// MAIN
// ====================

function renderDashboard() {

  const entries =
    filterEntries(
      selectedYear,
      selectedMonth
    );


  const data =
    calculatePeriodSummary(
      entries
    );


  renderGop(
    data
  );

  renderRecentEntries(
    entries
  );


  if (
    typeof renderCharts ===
    "function"
  ) {

    renderCharts(
      entries
    );

  }

}





// ====================
// GOP
// ====================

function renderGop(
  data
) {

  const totalRevenue =
    data.totalRevenue || 0;


  const totalCost =
    data.totalCost || 0;


  const gop =
    totalRevenue -
    totalCost;


  const margin =
    percentage(
      gop,
      totalRevenue
    );



  const foodCostPercent =
    percentage(
      data.foodCost,
      totalRevenue
    );


  const bevCostPercent =
    percentage(
      data.beverageCost,
      totalRevenue
    );


  const fixCostPercent =
    percentage(
      data.fixCost,
      totalRevenue
    );



  setText(
    "gopRevenueCard",
    money(
      totalRevenue
    )
  );


  setText(
    "gopCostCard",
    money(
      totalCost
    )
  );


  setText(
    "gopMainCard",
    money(
      gop
    )
  );


  setText(
    "gopMarginCard",
    percent(
      margin
    )
  );



  setText(
    "gopFoodCostCard",
    percent(
      foodCostPercent
    )
  );


  setText(
    "gopBevCostCard",
    percent(
      bevCostPercent
    )
  );


  setText(
    "gopFixCostCard",
    percent(
      fixCostPercent
    )
  );

}





// ====================
// RECENT
// ====================

function renderRecentEntries(
  entries
) {

  const el =
    document.getElementById(
      "recentEntriesList"
    );


  if (!el)
    return;


  el.innerHTML =
    entries
      .slice()
      .reverse()
      .map(
        entry => {

          const food =
            Number(
              entry.foodRevenue || 0
            );

          const bev =
            Number(
              entry.beverageRevenue || 0
            );

          const total =
            food + bev;


          return `
            <div class="grid grid-cols-4 border-b py-3">

              <div>
                ${formatDate(
                  entry.date
                )}
              </div>

              <div>
                ${money(
                  food
                )}
              </div>

              <div>
                ${money(
                  bev
                )}
              </div>

              <div>
                ${money(
                  total
                )}
              </div>

            </div>
          `;

        }
      )
      .join("");

}





// ====================
// HELPERS
// ====================

function setText(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );

  if (
    el
  ) {

    el.innerHTML =
      value;

  }

}


function percentage(
  actual,
  target
) {

  if (!target)
    return 0;

  return (
    actual / target
  ) * 100;

}


function percent(
  value
) {

  return (
    Number(
      value || 0
    ).toFixed(1) +
    "%"
  );

}


function money(
  value
) {

  return (

    getSettings()
      .currency +

    Number(
      value || 0
    ).toLocaleString(
      undefined,
      {
        maximumFractionDigits: 0
      }
    )

  );

}


function formatDate(
  value
) {

  return new Date(
    value
  ).toLocaleDateString(
      "en-GB"
    );

}
