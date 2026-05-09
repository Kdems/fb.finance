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
// FILTER
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
    function () {

      selectedYear =
        Number(
          this.value
        );

      renderDashboard();

    };


  monthFilter.onchange =
    function () {

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

  const settings =
    getSettings();


  renderYtd(
    data,
    settings
  );

  renderMtd(
    data,
    settings,
    entries
  );

  renderGop(
    data
  );

  renderFoodBeverage(
    data
  );

  renderSummary(
    entries,
    data,
    settings
  );

  renderRecentEntries(
    entries,
    settings
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
// YTD
// ====================

function renderYtd(
  data,
  settings
) {

  const budget =
    Number(
      settings.annualRevenueTarget || 0
    );

  const ly =
    getLyRevenue();

  const ach =
    percentage(
      data.totalRevenue,
      budget
    );

  const lyAch =
    percentage(
      ly,
      budget
    );


  setText(
    "ytdRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "ytdBudgetCard",
    money(
      budget
    )
  );

  setText(
    "ytdAchievementCard",
    percent(
      ach
    )
  );

  setText(
    "ytdVarianceCard",
    money(
      data.totalRevenue -
      budget
    )
  );

  setText(
    "ytdBalanceCard",
    money(
      budget -
      data.totalRevenue
    )
  );

  setText(
    "lyRevenueCard",
    money(
      ly
    )
  );

  setText(
    "lyAchievementCard",
    percent(
      lyAch
    )
  );

  setText(
    "ytdGrowthCard",
    percent(
      percentageChange(
        data.totalRevenue,
        ly
      )
    )
  );

  setText(
    "achievementDiffCard",
    percent(
      ach -
      lyAch
    )
  );


  setBar(
    "ytdProgressBar",
    ach
  );

}





// ====================
// MTD
// ====================

function renderMtd(
  data,
  settings,
  entries
) {

  const budget =
    Number(
      settings.monthlyBudget || 0
    );

  const ach =
    percentage(
      data.totalRevenue,
      budget
    );

  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();

  const avg =
    entries.length
      ? data.totalRevenue /
        entries.length
      : 0;

  const projection =
    avg *
    daysInMonth;


  setText(
    "mtdRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "mtdBudgetCard",
    money(
      budget
    )
  );

  setText(
    "projectionCard",
    money(
      projection
    )
  );

  setText(
    "projectionGapCard",
    money(
      projection -
      budget
    )
  );

  setText(
    "mtdAchievementCard",
    percent(
      ach
    )
  );


  setBar(
    "mtdProgressBar",
    ach
  );

}





// ====================
// GOP
// ====================

function renderGop(
  data
) {

  setText(
    "gopRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "gopCostCard",
    money(
      data.totalCost
    )
  );

  setText(
    "gopMainCard",
    money(
      data.totalGop
    )
  );

  setText(
    "gopMarginCard",
    percent(
      data.gopMargin
    )
  );

}





// ====================
// F&B
// ====================

function renderFoodBeverage(
  data
) {

  setText(
    "foodRevenueCard",
    money(
      data.totalFoodRevenue
    )
  );

  setText(
    "foodCostCard",
    money(
      data.foodCost
    )
  );

  setText(
    "bevRevenueCard",
    money(
      data.totalBeverageRevenue
    )
  );

  setText(
    "bevCostCard",
    money(
      data.beverageCost
    )
  );

  setText(
    "fixCostCard",
    money(
      data.fixCost
    )
  );

}





// ====================
// SUMMARY
// ====================

function renderSummary(
  entries,
  data,
  settings
) {

  setText(
    "summaryRevenueCard",
    money(
      data.totalRevenue
    )
  );

  setText(
    "summaryBudgetCard",
    money(
      settings.monthlyBudget
    )
  );

  setText(
    "summaryAchievementCard",
    percent(
      percentage(
        data.totalRevenue,
        settings.monthlyBudget
      )
    )
  );

}





// ====================
// RECENT TABLE
// ====================

function renderRecentEntries(
  entries,
  settings
) {

  const container =
    document.getElementById(
      "recentEntriesList"
    );

  if (!container)
    return;


  const dailyBudget =
    Number(
      settings.monthlyBudget || 0
    ) / 31;


  container.innerHTML =

    `
    <div class="grid grid-cols-9 font-bold border-b pb-3 mb-3 text-sm">

      <div>Date</div>
      <div>Food</div>
      <div>Bev</div>
      <div>Total</div>
      <div>Budget</div>
      <div>Variance</div>
      <div>Ach.</div>
      <div>Status</div>
      <div>Action</div>

    </div>
    ` +

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

          const variance =
            total -
            dailyBudget;

          const ach =
            percentage(
              total,
              dailyBudget
            );


          const status =

            ach >= 100

              ? `<span class="text-green-600 font-bold">GOOD</span>`

              : `<span class="text-red-600 font-bold">LOW</span>`;


          return `

            <div class="grid grid-cols-9 border-b py-3 text-sm">

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

              <div>
                ${money(
                  dailyBudget
                )}
              </div>

              <div>
                ${money(
                  variance
                )}
              </div>

              <div>
                ${percent(
                  ach
                )}
              </div>

              <div>
                ${status}
              </div>

              <div>
                ✏️ 🗑️
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

  if (el) {

    el.innerHTML =
      value;

  }

}


function setBar(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );

  if (el) {

    el.style.width =
      Math.min(
        value,
        100
      ) + "%";

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


function percentageChange(
  current,
  old
) {

  if (!old)
    return 0;

  return (
    (
      current -
      old
    ) / old
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


function getLyRevenue() {

  const s =
    getSettings();

  return (

    Number(
      s.lyFoodRevenue || 0
    ) +

    Number(
      s.lyBeverageRevenue || 0
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
