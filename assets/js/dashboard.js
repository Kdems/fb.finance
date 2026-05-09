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
      <option value="${y}"
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
      <option value="${m}"
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


  renderYtd(
    data
  );

  renderMtd(
    data,
    entries
  );

  renderFoodBeverage(
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
// YTD
// ====================

function renderYtd(
  data
) {

  const settings =
    getSettings();


  const budget =
    Number(
      settings.annualRevenueTarget || 0
    );


  const lyRevenue =

    Number(
      settings.lyFoodRevenue || 0
    ) +

    Number(
      settings.lyBeverageRevenue || 0
    );


  const achievement =
    percentage(
      data.totalRevenue,
      budget
    );


  const lyAchievement =
    percentage(
      lyRevenue,
      budget
    );


  const variance =
    data.totalRevenue -
    budget;


  const remaining =
    budget -
    data.totalRevenue;


  const growth =
    percentageChange(
      data.totalRevenue,
      lyRevenue
    );


  const diff =
    achievement -
    lyAchievement;



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
    "ytdVarianceCard",
    money(
      variance
    )
  );


  setText(
    "ytdBalanceCard",
    money(
      remaining
    )
  );


  setText(
    "ytdAchievementCard",
    percent(
      achievement
    )
  );


  setText(
    "lyRevenueCard",
    money(
      lyRevenue
    )
  );


  setText(
    "ytdGrowthCard",
    percent(
      growth
    )
  );


  setText(
    "achievementDiffCard",
    percent(
      diff
    )
  );


  setBar(
    "ytdProgressBar",
    achievement
  );

}





// ====================
// MTD
// ====================

function renderMtd(
  data,
  entries
) {

  const settings =
    getSettings();


  const budget =
    Number(
      settings.monthlyBudget || 0
    );


  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth,
      0
    ).getDate();


  const daysPassed =
    entries.length || 1;


  const daysLeft =
    daysInMonth -
    daysPassed;


  const dailyPace =
    data.totalRevenue /
    daysPassed;


  const projection =
    dailyPace *
    daysInMonth;


  const gap =
    projection -
    budget;



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
    "dailyPaceCard",
    money(
      dailyPace
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
      gap
    )
  );


  setText(
    "daysLeftCard",
    daysLeft
  );

}





// ====================
// F&B
// ====================

function renderFoodBeverage(
  data
) {

  const totalRevenue =
    data.totalRevenue || 0;


  const settings =
    getSettings();


  const lyFood =
    Number(
      settings.lyFoodRevenue || 0
    );



  const foodMix =
    percentage(
      data.totalFoodRevenue,
      totalRevenue
    );


  const foodCost =
    percentage(
      data.foodCost,
      data.totalFoodRevenue
    );


  const foodGrowth =
    percentageChange(
      data.totalFoodRevenue,
      lyFood
    );



  setText(
    "foodRevenueCard",
    money(
      data.totalFoodRevenue
    )
  );


  setText(
    "foodMixCard",
    percent(
      foodMix
    )
  );


  setText(
    "foodCostCard",
    percent(
      foodCost
    )
  );


  setText(
    "foodGrowthCard",
    percent(
      foodGrowth
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


function setBar(
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


function formatDate(
  value
) {

  return new Date(
    value
  ).toLocaleDateString(
      "en-GB"
    );

}
