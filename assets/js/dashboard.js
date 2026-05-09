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


  if(
    !entryDateField.value
  ) {

    budgetField.value =
      "";

    return;

  }


  const settings =
    getSettings();


  const date =
    new Date(
      entryDateField.value
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
// FILTER CHANGE
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
// ENTRY SAVE
// ======================

function handleSaveEntry(
  e
) {

  e.preventDefault();


  const data = {

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
      data
    );

    editingEntryId =
      null;

  }

  else {

    addEntry(
      data
    );

  }


  entryForm.reset();

  renderDashboard();

}


// ======================
// DASHBOARD
// ======================

function renderDashboard() {

  const allEntries =
    getEntries();


  const currentMonthEntries =
    filterEntries(
      selectedYear,
      selectedMonth
    );


  const currentYearEntries =
    allEntries.filter(
      entry =>
        new Date(
          entry.date
        ).getFullYear() ===
        selectedYear
    );


  const lyMonthEntries =
    filterEntries(
      selectedYear - 1,
      selectedMonth
    );


  const lyYearEntries =
    allEntries.filter(
      entry =>
        new Date(
          entry.date
        ).getFullYear() ===
        selectedYear - 1
    );


  const mtd =
    calculatePeriodSummary(
      currentMonthEntries
    );


  const ytd =
    calculatePeriodSummary(
      currentYearEntries
    );


  const lyMtd =
    calculatePeriodSummary(
      lyMonthEntries
    );


  const lyYtd =
    calculatePeriodSummary(
      lyYearEntries
    );


  renderYtd(
    ytd,
    lyYtd
  );


  renderMtd(
    mtd,
    lyMtd
  );


  renderGop(
    mtd,
    lyMtd
  );


  renderFoodBeverage(
    mtd,
    lyMtd
  );


  renderSummary(
    mtd
  );

}


// ======================
// YTD
// ======================

function renderYtd(
  current,
  ly
) {

  const settings =
    getSettings();


  setCard(
    "ytdRevenueCard",
    `${settings.currency}${current.totalRevenue.toFixed(0)}`
  );


  setCard(
    "lyYtdRevenueCard",
    `${settings.currency}${ly.totalRevenue.toFixed(0)}`
  );


  setCard(
    "ytdGrowthCard",
    `${calculateGrowth(
      current.totalRevenue,
      ly.totalRevenue
    ).toFixed(1)}%`
  );

}


// ======================
// MTD
// ======================

function renderMtd(
  current,
  ly
) {

  const settings =
    getSettings();


  setCard(
    "mtdRevenueCard",
    `${settings.currency}${current.totalRevenue.toFixed(0)}`
  );


  setCard(
    "lyMtdRevenueCard",
    `${settings.currency}${ly.totalRevenue.toFixed(0)}`
  );


  setCard(
    "mtdGrowthCard",
    `${calculateGrowth(
      current.totalRevenue,
      ly.totalRevenue
    ).toFixed(1)}%`
  );

}


// ======================
// GOP
// ======================

function renderGop(
  current,
  ly
) {

  const settings =
    getSettings();


  setCard(
    "gopMainCard",
    `${settings.currency}${current.totalGop.toFixed(0)}`
  );


  setCard(
    "lyGopCard",
    `${settings.currency}${ly.totalGop.toFixed(0)}`
  );


  setCard(
    "gopGrowthCard",
    `${calculateGrowth(
      current.totalGop,
      ly.totalGop
    ).toFixed(1)}%`
  );

}


// ======================
// FOOD / BEVERAGE
// ======================

function renderFoodBeverage(
  current,
  ly
) {

  const settings =
    getSettings();


  setCard(
    "foodRevenueCard",
    `${settings.currency}${current.totalFoodRevenue.toFixed(0)}`
  );


  setCard(
    "lyFoodCard",
    `${settings.currency}${ly.totalFoodRevenue.toFixed(0)}`
  );


  setCard(
    "foodGrowthCard",
    `${calculateGrowth(
      current.totalFoodRevenue,
      ly.totalFoodRevenue
    ).toFixed(1)}%`
  );


  setCard(
    "bevRevenueCard",
    `${settings.currency}${current.totalBeverageRevenue.toFixed(0)}`
  );


  setCard(
    "lyBevCard",
    `${settings.currency}${ly.totalBeverageRevenue.toFixed(0)}`
  );


  setCard(
    "bevGrowthCard",
    `${calculateGrowth(
      current.totalBeverageRevenue,
      ly.totalBeverageRevenue
    ).toFixed(1)}%`
  );

}


// ======================
// SUMMARY
// ======================

function renderSummary(
  data
) {

  const settings =
    getSettings();


  setCard(
    "summaryRevenueCard",
    `${settings.currency}${data.totalRevenue.toFixed(0)}`
  );

}


// ======================
// HELPERS
// ======================

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


// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initDashboard
);
