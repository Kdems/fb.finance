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



function renderRecent() {
  document.getElementById(
    "recentSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>Recent Entries</h2>";
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








  const rankingData =

    outlets

      .map(
        outlet => {

          const result =

            calculateDashboardData(
              outlet,
              year,
              month
            );








          return {

            outlet,

            revenue:

              result.totalRevenue,



            score:

              result.revenueAchievement +

              result.gopAchievement

          };

        }
      )








      .sort(
        (
          a,
          b
        ) => {

          return b.score - a.score;

        }
      );








  document
    .getElementById(
      "rankingSection"
    )

    .innerHTML = `

      <div class="space-y-4">

        <h2 class="text-2xl font-bold">

          Outlet Ranking

        </h2>








        ${rankingData

          .map(
            (
              item,
              index
            ) => {

              return `

                <div class="bg-slate-50 rounded-2xl p-4 flex justify-between">

                  <div>

                    #${index + 1}

                    ${item.outlet}

                  </div>








                  <div>

                    RM${Math.round(
                      item.revenue
                    ).toLocaleString()}

                  </div>

                </div>

              `;

            }
          )

          .join("")}

      </div>

    `;

}



function renderAlerts() {
  document.getElementById(
    "alertSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>Executive Alerts</h2>";
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

  const highestDay =
    entries.reduce(
      (
        best,
        current
      ) =>

        !best ||

        current.totalRevenue >
          best.totalRevenue

          ? current

          : best,

      null
    );

  const lowestDay =
    entries.reduce(
      (
        worst,
        current
      ) =>

        !worst ||

        current.totalRevenue <
          worst.totalRevenue

          ? current

          : worst,

      null
    );

  const average =
    totalDays > 0

      ? entries.reduce(
          (
            sum,
            item
          ) =>

            sum +
            item.totalRevenue,

          0
        ) / totalDays

      : 0;

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

            <p>Best Day</p>

            <h3 class="text-xl font-bold">

              RM${Math.round(
                highestDay?.totalRevenue || 0
              ).toLocaleString()}

            </h3>

          </div>

          <div class="bg-slate-50 rounded-2xl p-5">

            <p>Worst Day</p>

            <h3 class="text-xl font-bold">

              RM${Math.round(
                lowestDay?.totalRevenue || 0
              ).toLocaleString()}

            </h3>

          </div>

          <div class="bg-slate-50 rounded-2xl p-5">

            <p>Daily Average</p>

            <h3 class="text-xl font-bold">

              RM${Math.round(
                average
              ).toLocaleString()}

            </h3>

          </div>

        </div>

      </div>

    `;
}