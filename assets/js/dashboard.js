function formatCurrency(value) {
  return "RM" + Number(value || 0).toLocaleString();
}

function getPerformanceColor(value) {

  if (value >= 100)
    return "#22c55e";

  if (value >= 90)
    return "#eab308";

  if (value >= 80)
    return "#f97316";

  return "#ef4444";

}

window.onload = function () {

  buildDashboardDropdowns();

  setupDashboardFilters();

  renderDashboard();

};









function buildDashboardDropdowns() {

  buildYearDropdown(
    "dashboardYear"
  );



  buildMonthDropdown(
    "dashboardMonth"
  );







  const today =
    new Date();





  const currentYear =
    today.getFullYear();





  const currentMonth =
    today.getMonth() + 1;







  document
    .getElementById(
      "dashboardYear"
    )
    .value =

    currentYear;







  document
    .getElementById(
      "dashboardMonth"
    )
    .value =

    currentMonth;

}










function setupDashboardFilters() {

  document
    .getElementById(
      "dashboardOutlet"
    )
    .addEventListener(
      "change",
      renderDashboard
    );



  document
    .getElementById(
      "dashboardYear"
    )
    .addEventListener(
      "change",
      renderDashboard
    );



  document
    .getElementById(
      "dashboardMonth"
    )
    .addEventListener(
      "change",
      renderDashboard
    );

}

function renderDashboard() {

  const outlet =
    document
      .getElementById(
        "dashboardOutlet"
      )
      .value;



  const year =
    Number(
      document
        .getElementById(
          "dashboardYear"
        )
        .value
    );



  const month =
    Number(
      document
        .getElementById(
          "dashboardMonth"
        )
        .value
    );





  const data =

    calculateDashboardData(

      outlet,

      year,

      month

    );





  renderYtd(
    data
  );



  renderMtd(
    data
  );



  renderGop(
    data
  );



  renderCost(
    data
  );



  renderSummary(
    data
  );




  renderTrend(
  outlet,
  year,
  month
  );



  renderRanking();


  renderRecent(
    outlet,
    year,
    month
  );


  



  renderAlerts(
    data
  );

}

function renderYtd(
  data
) {

  document
    .getElementById(
      "ytdSection"
    )

    .innerHTML = `

      <div class="space-y-5">


        <div>

          <h2 class="text-2xl font-bold">

            Year-To-Date Performance

          </h2>

        </div>







        <div
          class="grid grid-cols-4 gap-4">







          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              YTD Revenue

            </p>

            <h3 class="text-3xl font-bold">

              RM${data.ytdRevenue.toLocaleString()}

            </h3>

          </div>









          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              Annual Target

            </p>

            <h3 class="text-3xl font-bold">

              RM${data.annualRevenueTarget.toLocaleString()}

            </h3>

          </div>









          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              Variance

            </p>

            <h3 class="text-3xl font-bold">

              RM${data.ytdVariance.toLocaleString()}

            </h3>

            <div
              class="w-full bg-slate-200 rounded-full h-3 mt-3">

              <div
                class="bg-green-500 h-3 rounded-full"
                style="
                  width:
                  ${Math.min(
                    data.ytdAchievement,
                    100
                  )}%
                ">
              </div>

            </div>

          </div>









          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              Achievement

            </p>

            <h3 class="text-3xl font-bold">

              ${data.ytdAchievement.toFixed(1)}%

            </h3>

          </div>

          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">
              Projected Year End
            </p>

            <h3 class="text-3xl font-bold">
              RM${Math.round(
                data.projectedYtd
              ).toLocaleString()}
            </h3>

          </div>


        </div>

      </div>

    `;

}



function renderMtd(
  data
) {

  document
    .getElementById(
      "mtdSection"
    )

    .innerHTML = `

      <div class="space-y-5">


        <div>

          <h2 class="text-2xl font-bold">

            Month-To-Date Performance

          </h2>

        </div>





        <div
          class="grid grid-cols-5 gap-4">





          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              MTD Revenue

            </p>

            <h3 class="text-3xl font-bold">

              RM${data.totalRevenue.toLocaleString()}

            </h3>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              Target

            </p>

            <h3 class="text-3xl font-bold">

              RM${data.targetRevenue.toLocaleString()}

            </h3>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              Variance

            </p>

            <h3 class="text-3xl font-bold">

              RM${data.revenueVariance.toLocaleString()}

            </h3>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              Achievement

            </p>

            <h3 class="text-3xl font-bold">

              ${data.revenueAchievement.toFixed(1)}%

            </h3>

            <div
              class="w-full bg-slate-200 rounded-full h-3 mt-3">

              <div
                class="bg-blue-500 h-3 rounded-full"
                style="
                  width:
                  ${Math.min(
                    data.achievement,
                    100
                  )}%
                ">
              </div>

            </div>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p class="text-sm text-slate-500">

              Daily Pace

            </p>

            <h3 class="text-3xl font-bold">

              RM${Math.round(
                data.dailyPace
              ).toLocaleString()}

            </h3>

          </div>

          <div class="bg-slate-50 rounded-2xl p-5">
            <p>Projected</p>
            <h3 class="text-3xl font-bold">
              RM${Math.round(
                data.projectedMtd
              ).toLocaleString()}
            </h3>

          </div>

          <div class="bg-slate-50 rounded-2xl p-5">
            <p>Days Left</p>
            <h3 class="text-3xl font-bold">
              ${data.daysLeft}
            </h3>

          </div>          


        </div>

      </div>

    `;

}



function renderGop(
  data
) {





  const trafficLight =

    data.gopAchievement >= 100

      ? "🟢"

      :

    data.gopAchievement >= 90

      ? "🟡"

      :

      "🔴";








  document
    .getElementById(
      "gopSection"
    )

    .innerHTML = `

      <div class="space-y-5">


        <h2 class="text-2xl font-bold">

          GOP Performance

        </h2>








        <div
          class="grid grid-cols-5 gap-4">







          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p>Revenue</p>

            <h3 class="text-3xl font-bold">

              RM${data.totalRevenue.toLocaleString()}

            </h3>

          </div>








          <div
  class="bg-slate-50 rounded-2xl p-5">

  <p>

    Total COGS

  </p>






  <h3 class="text-3xl font-bold mb-3">

    RM${Math.round(
      data.totalCost
    ).toLocaleString()}

  </h3>







  <div class="text-sm space-y-1 text-slate-600">

    <div>

      Food:

      RM${Math.round(
        data.foodCost
      ).toLocaleString()}

      (

      ${data.foodCostPercent.toFixed(1)}%

      )

    </div>






    <div>

      Beverage:

      RM${Math.round(
        data.beverageCost
      ).toLocaleString()}

      (

      ${data.beverageCostPercent.toFixed(1)}%

      )

    </div>






    <div>

      Fixed:

      RM${Math.round(
        data.fixedCost
      ).toLocaleString()}

      (

      ${data.fixedCostPercent.toFixed(1)}%

      )

    </div>

  </div>

</div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p>GOP</p>

            <h3 class="text-3xl font-bold">

              RM${Math.round(
                data.gop
              ).toLocaleString()}

            </h3>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p>GOP %</p>

            <h3 class="text-3xl font-bold">

              ${data.gopMargin.toFixed(1)}%

            </h3>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p>Status</p>

            <h3 class="text-3xl font-bold">

              ${trafficLight}

              ${data.gopAchievement.toFixed(1)}%

            </h3>

          </div>


        </div>

      </div>

    `;

}



function renderCost(
  data
) {





  document
    .getElementById(
      "costSection"
    )

    .innerHTML = `

      <div class="space-y-5">

        <h2 class="text-2xl font-bold">

          Cost Control

        </h2>








        <div
          class="grid grid-cols-3 gap-4">







          ${renderCostCard(

            "Food",

            data.foodCost,

            data.targetFoodCost,

            data.foodCostVariance

          )}








          ${renderCostCard(

            "Beverage",

            data.beverageCost,

            data.targetBeverageCost,

            data.beverageCostVariance

          )}








          ${renderCostCard(

            "Fixed",

            data.fixedCost,

            data.targetFixedCost,

            data.fixedCostVariance

          )}





        </div>

      </div>

    `;

}



function renderSummary() {
  document.getElementById(
    "summarySection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>Summary</h2>";
}



function renderRecent(
  outlet,
  year,
  month
) {
  const entries =
    getFilteredDailyEntries(
      outlet,
      year,
      month
    )

    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )

    .slice(0, 5);

  document
    .getElementById(
      "recentSection"
    )
    .innerHTML = `

      <div class="space-y-5">

        <h2 class="text-2xl font-bold">
          Recent Entries
        </h2>

        <div class="space-y-3">

          ${entries.map(item => `

            <div class="bg-slate-50 rounded-2xl p-4 flex justify-between">

              <div>
                <p class="font-semibold">
                  ${item.date}
                </p>

                <p class="text-sm text-slate-500">
                  ${item.outlet}
                </p>
              </div>

              <div class="text-right">

                <p class="font-bold">
                  RM${Math.round(
                    item.totalRevenue || 0
                  ).toLocaleString()}
                </p>

                <p class="text-sm text-slate-500">
                  Food:
                  ${item.foodCostPercent || 0}%
                  |
                  Bev:
                  ${item.beverageCostPercent || 0}%
                </p>

              </div>

            </div>

          `).join("")}

        </div>

      </div>

    `;
}






function renderAlerts(
  data
) {
  const alerts = [];

  if (
    data.revenueAchievement < 90
  ) {
    alerts.push(
      "🔴 Revenue below target"
    );
  }

  if (
    data.foodCostVariance > 0
  ) {
    alerts.push(
      "🟡 Food cost above budget"
    );
  }

  if (
    data.beverageCostVariance > 0
  ) {
    alerts.push(
      "🟡 Beverage cost above budget"
    );
  }

  if (
    data.gopAchievement < 90
  ) {
    alerts.push(
      "🔴 GOP below target"
    );
  }

  if (
    alerts.length === 0
  ) {
    alerts.push(
      "🟢 All KPIs on track"
    );
  }

  document
    .getElementById(
      "alertSection"
    )
    .innerHTML = `

      <div class="space-y-5">

        <h2 class="text-2xl font-bold">
          Executive Alerts
        </h2>

        <div class="space-y-3">

          ${alerts.map(alert => `

            <div class="bg-slate-50 rounded-2xl p-4">
              ${alert}
            </div>

          `).join("")}

        </div>

      </div>

    `;
}

function buildYearDropdown(id) {

  const select =
    document.getElementById(id);



  let html = "";



  for (
    let year = 2025;
    year <= 2030;
    year++
  ) {

    html += `
      <option value="${year}">
        ${year}
      </option>
    `;

  }



  select.innerHTML =
    html;

}







function buildMonthDropdown(id) {

  const months = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",

    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

  ];



  const select =
    document.getElementById(id);



  select.innerHTML =

    months
      .map(
        (
          month,
          index
        ) => {

          return `
            <option value="${index + 1}">
              ${month}
            </option>
          `;

        }
      )
      .join("");

}

function renderCostCard(
  title,
  actual,
  target,
  variance
) {

  const indicator =

    variance <= 0

      ? "🟢"

      :

    variance <= 1000

      ? "🟡"

      :

      "🔴";








  return `

    <div
      class="bg-slate-50 rounded-2xl p-5">

      <h3 class="text-xl font-bold mb-4">

        ${title}

      </h3>







      <p>

        Actual:

        RM${Math.round(
          actual
        ).toLocaleString()}

      </p>







      <p>

        Target:

        RM${Math.round(
          target
        ).toLocaleString()}

      </p>







      <p class="font-semibold mt-3">

        ${indicator}

        Variance:

        RM${Math.round(
          variance
        ).toLocaleString()}

      </p>

    </div>

  `;

}

function renderSummary(
  data
) {

  document
    .getElementById(
      "summarySection"
    )

    .innerHTML = `

      <div class="space-y-5">

        <h2 class="text-2xl font-bold">

          Executive Summary

        </h2>








        <div
          class="grid grid-cols-4 gap-4">







          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p>Best Day</p>

            <h3 class="text-xl font-bold">

              RM${Math.round(
                data.bestDay.totalRevenue || 0
              ).toLocaleString()}

            </h3>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p>Worst Day</p>

            <h3 class="text-xl font-bold">

              RM${Math.round(
                data.worstDay.totalRevenue || 0
              ).toLocaleString()}

            </h3>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p>Daily Average</p>

            <h3 class="text-xl font-bold">

              RM${Math.round(
                data.averageDailyRevenue
              ).toLocaleString()}

            </h3>

          </div>








          <div
            class="bg-slate-50 rounded-2xl p-5">

            <p>Alert</p>

            <h3 class="text-lg font-bold">

              ${data.executiveAlert}

            </h3>

          </div>








        </div>

      </div>

    `;

}

function renderTrend(
  outlet,
  year,
  month
) {
  const entries =
    getFilteredDailyEntries(
      outlet,
      year,
      month
    );

  const totalDays =
    entries.length;

  const currentPace =
    totalDays > 0
      ? entries.reduce(
          (sum, item) =>
            sum +
            (item.totalRevenue || 0),
          0
        ) / totalDays
      : 0;

  const projectedRevenue =
    currentPace * 31;

  const dashboardData =
    calculateDashboardData(
      outlet,
      year,
      month
    );

  const today =
  new Date().getDate();

  const remainingDays =
    Math.max(
      31 - today,
      1
    );

  const requiredPerDay =
    dashboardData.targetRevenue > 0
      ? (
          dashboardData.targetRevenue -
          dashboardData.totalRevenue
        ) / remainingDays
      : 0;

  const vsTarget =
    dashboardData.targetRevenue > 0
      ? (
          projectedRevenue /
          dashboardData.targetRevenue
        ) * 100
      : 0;

  let forecastStatus =
  "🟢 Ahead of Target";

  if (
    vsTarget < 90
  ) {
    forecastStatus =
      "🔴 Critical";
  }

  else if (
    vsTarget < 100
  ) {
    forecastStatus =
      "🟡 At Risk";
  }

  document
    .getElementById(
      "trendSection"
    )
    .innerHTML = `

      <div class="space-y-5">

        <h2 class="text-2xl font-bold">
          Performance Trend
        </h2>

        <div class="grid grid-cols-3 gap-4">

          <div class="bg-slate-50 rounded-2xl p-5">
            <p>Current Pace</p>
            <h3 class="text-xl font-bold">
              RM${Math.round(
                currentPace
              ).toLocaleString()}
            </h3>
          </div>

          <div class="bg-slate-50 rounded-2xl p-5">
            <p>Projected Month End</p>
            <h3 class="text-xl font-bold">
              RM${Math.round(
                projectedRevenue
              ).toLocaleString()}
            </h3>
          </div>

          <div class="bg-slate-50 rounded-2xl p-5">
            <p>Vs Target</p>
            <h3 class="text-xl font-bold">
              ${vsTarget.toFixed(1)}%
            </h3>
            </div>

            <div class="bg-slate-50 rounded-2xl p-5">
              <p>Status</p>

              <h3 class="text-xl font-bold">
                ${forecastStatus}
              </h3>
            </div>

          <div class="bg-slate-50 rounded-2xl p-5">

            <p>Daily Required</p>
            <h3 class="text-xl font-bold">
              RM${Math.round(
                requiredPerDay > 0
                  ? requiredPerDay
                  : 0
              ).toLocaleString()}
            </h3>

          </div>  
          </div>

        </div>

      </div>

    `;
}

function renderRanking() {

  const outlets = [
    "SKYBAR",
    "GCC",
    "BO6"
  ];

  const year = Number(
    document
      .getElementById("dashboardYear")
      .value
  );

  const month = Number(
    document
      .getElementById("dashboardMonth")
      .value
  );

  const ranking =
    outlets.map(name => {

      const data =
        calculateDashboardData(
          name,
          year,
          month
        );

      return {
        name,
        revenue:
          data.totalRevenue || 0
      };

    });

  ranking.sort(
    (a, b) =>
      b.revenue -
      a.revenue
  );

  const best =
    ranking[0];

  const worst =
    ranking[
      ranking.length - 1
    ];

  const maxRevenue =
    Math.max(
      ...ranking.map(
        x => x.revenue
      )
    );

  document
    .getElementById(
      "rankingSection"
    )
    .innerHTML = `

      <h2 class="text-2xl font-bold mb-5">
        Outlet Ranking
      </h2>

      <div class="grid grid-cols-2 gap-4 mb-6">

        <div class="bg-slate-50 rounded-2xl p-4">
          <p>Top Performer</p>
          <h3 class="text-2xl font-bold">
            ${best.name}
          </h3>
          <p>
            RM${Math.round(
              best.revenue
            ).toLocaleString()}
          </p>
        </div>

        <div class="bg-slate-50 rounded-2xl p-4">
          <p>Lowest Performer</p>
          <h3 class="text-2xl font-bold">
            ${worst.name}
          </h3>
          <p>
            RM${Math.round(
              worst.revenue
            ).toLocaleString()}
          </p>
        </div>

      </div>

      <div class="space-y-4">

        ${ranking.map(item => {

          const width =
            maxRevenue > 0
            ? (
                item.revenue /
                maxRevenue
              ) * 100
            : 0;

          return `

            <div>

              <div class="flex justify-between mb-1">

                <span class="font-semibold">
                  ${item.name}
                </span>

                <span>
                  RM${Math.round(
                    item.revenue
                  ).toLocaleString()}
                </span>

              </div>

              <div class="bg-slate-100 rounded-full h-3">

                <div
                  class="bg-slate-800 h-3 rounded-full"
                  style="width:${width}%"
                ></div>

              </div>

            </div>

          `;

        }).join("")}

      </div>

    `;
}