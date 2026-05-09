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


  const dateValue =
    entryDateField.value;

  if(
    !dateValue
  ) {

    budgetField.value =
      "";

    return;

  }


  const settings =
    getSettings();


  const date =
    new Date(
      dateValue
    );


  const daysInMonth =
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();


  const dailyBudget =
    settings.monthlyBudget /
    daysInMonth;


  budgetField.value =
    `${settings.currency}${dailyBudget.toFixed(2)}`;

}


// ======================
// FILTER
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
// SAVE ENTRY
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
// MAIN RENDER
// ======================

function renderDashboard() {

  const monthlyEntries =
    filterEntries(
      selectedYear,
      selectedMonth
    );


  const yearlyEntries =
    getEntries().filter(
      entry => {

        const date =
          new Date(
            entry.date
          );

        return (
          date.getFullYear() ===
          selectedYear
        );

      }
    );


  const mtd =
    calculatePeriodSummary(
      monthlyEntries
    );


  const ytd =
    calculatePeriodSummary(
      yearlyEntries
    );


  renderYtd(
    ytd
  );


  renderMtd(
    mtd
  );


  renderGop(
    mtd
  );


  renderFoodBeverage(
    mtd
  );


  renderSummary(
    monthlyEntries,
    mtd
  );


  renderTable(
    monthlyEntries
  );

}


// ======================
// YTD
// ======================

function renderYtd(
  data
) {

  const settings =
    getSettings();


  setCard(
    "ytdRevenueCard",
    `${settings.currency}${data.totalRevenue.toFixed(0)}`
  );


  setCard(
    "ytdBudgetCard",
    `${settings.currency}${(settings.monthlyBudget * 12).toFixed(0)}`
  );


  setCard(
    "ytdAchievementCard",
    `${calculateAchievement(
      data.totalRevenue,
      settings.annualRevenueTarget
    ).toFixed(1)}%`
  );

}


// ======================
// MTD
// ======================

function renderMtd(
  data
) {

  const settings =
    getSettings();


  setCard(
    "mtdRevenueCard",
    `${settings.currency}${data.totalRevenue.toFixed(0)}`
  );


  setCard(
    "mtdBudgetCard",
    `${settings.currency}${settings.monthlyBudget.toFixed(0)}`
  );


  setCard(
    "mtdGopCard",
    `${settings.currency}${data.totalGop.toFixed(0)}`
  );


  setCard(
    "mtdAchievementCard",
    `${calculateAchievement(
      data.totalRevenue,
      settings.monthlyBudget
    ).toFixed(1)}%`
  );

}


// ======================
// GOP
// ======================

function renderGop(
  data
) {

  const settings =
    getSettings();


  setCard(
    "gopRevenueCard",
    `${settings.currency}${data.totalRevenue.toFixed(0)}`
  );


  setCard(
    "gopCostCard",
    `${settings.currency}${data.totalCost.toFixed(0)}`
  );


  setCard(
    "gopMainCard",
    `${settings.currency}${data.totalGop.toFixed(0)}`
  );


  setCard(
    "gopMarginCard",
    `${data.gopMargin.toFixed(1)}%`
  );

}


// ======================
// FOOD & BEVERAGE
// ======================

function renderFoodBeverage(
  data
) {

  const settings =
    getSettings();


  setCard(
    "foodRevenueCard",
    `${settings.currency}${data.totalFoodRevenue.toFixed(0)}`
  );


  setCard(
    "bevRevenueCard",
    `${settings.currency}${data.totalBeverageRevenue.toFixed(0)}`
  );


  setCard(
    "totalCostCard",
    `${settings.currency}${data.totalCost.toFixed(0)}`
  );

}


// ======================
// SUMMARY
// ======================

function renderSummary(
  entries,
  data
) {

  const settings =
    getSettings();


  setCard(
    "summaryRevenueCard",
    `${settings.currency}${data.totalRevenue.toFixed(0)}`
  );


  setCard(
    "summaryBudgetCard",
    `${settings.currency}${settings.monthlyBudget.toFixed(0)}`
  );


  setCard(
    "summaryAchievementCard",
    `${calculateAchievement(
      data.totalRevenue,
      settings.monthlyBudget
    ).toFixed(1)}%`
  );

}


// ======================
// HELPERS
// ======================

function setCard(
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


  element.innerHTML =
    `
      <div class="bg-slate-50 rounded-xl p-4 text-center font-bold text-xl">
        ${value}
      </div>
    `;

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
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
