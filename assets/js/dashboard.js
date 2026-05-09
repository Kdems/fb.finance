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


  if(entryDateField) {

    entryDateField.addEventListener(
      "change",
      updateAutoDailyBudget
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
// DAILY BUDGET
// ======================

function updateAutoDailyBudget() {

  const budgetField =
    document.getElementById(
      "dailyBudgetDisplay"
    );


  if(
    !budgetField ||
    !entryDateField ||
    !entryDateField.value
  ) return;


  const settings =
    getSettings();


  const date =
    new Date(
      entryDateField.value
    );


  const days =
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();


  const dailyBudget =
    Number(
      settings.monthlyBudget || 0
    ) / days;


  budgetField.value =
    formatMoney(
      dailyBudget
    );

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


  const current =
    calculatePeriodSummary(
      entries
    );


  renderYtd(current);

  renderMtd(current);

  renderGop(current);

  renderFoodBeverage(current);

  renderSummary(
    entries,
    current
  );

  renderRecentEntries(
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
// RECENT ENTRIES
// ======================

function renderRecentEntries(
  entries
) {

  const container =
    document.getElementById(
      "recentEntriesList"
    );


  if(
    !container
  ) return;


  if(
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


  const latest =
    [...entries]
    .sort(
      (
        a,
        b
      ) =>

        new Date(
          b.date
        ) -

        new Date(
          a.date
        )
    )
    .slice(
      0,
      10
    );


  container.innerHTML =
    latest.map(
      entry => {

        const date =
          new Date(
            entry.date
          );


        const day =
          date
          .toLocaleDateString(
            "en-GB"
          );


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

          <div class="border rounded-xl p-4 flex justify-between">

            <div>
              <div class="font-medium">
                ${day}
              </div>

              <div class="text-sm text-slate-500">
                Food ${formatMoney(food)}
              </div>

              <div class="text-sm text-slate-500">
                Beverage ${formatMoney(bev)}
              </div>
            </div>


            <div class="font-bold">
              ${formatMoney(total)}
            </div>

          </div>

        `;

      }
    ).join(
      ""
    );

}



// ======================
// HELPERS
// ======================

function getLyTotalRevenue() {

  const settings =
    getSettings();


  return (

    Number(
      settings.lyFoodRevenue || 0
    ) +

    Number(
      settings.lyBeverageRevenue || 0
    )

  );

}


function updateCard(
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


function updateSubCard(
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


  const small =
    el.parentElement.querySelector(
      "small"
    );


  if(
    small
  ) {

    small.innerHTML =
      value;

  }

}


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


function calculateGrowth(
  current,
  ly
) {

  if(
    !ly
  ) return 0;


  return (
    (
      current - ly
    ) / ly
  ) * 100;

}


function formatMoney(
  amount
) {

  const settings =
    getSettings();

  const currency =
    settings.currency || "RM";

  return (

    currency +

    Number(
      amount || 0
    ).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )

  );

}



// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
