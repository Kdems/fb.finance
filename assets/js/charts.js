let dailyRevenueChart = null;
let gopTrendChart = null;
let revenueMixChart = null;


// =========================
// COMMON CONFIG
// =========================

function destroyChart(chart) {

  if(chart) {
    chart.destroy();
  }

}


function getChartLabels(entries) {

  return entries.map(
    entry => entry.date
  );

}


// =========================
// DAILY REVENUE TREND
// =========================

function renderDailyRevenueChart(
  entries
) {

  const canvas =
    document.getElementById(
      "dailyRevenueChart"
    );

  if(
    !canvas ||
    typeof Chart ===
    "undefined"
  ) return;


  destroyChart(
    dailyRevenueChart
  );


  const labels =
    getChartLabels(
      entries
    );


  const revenueData =
    entries.map(
      entry => {

        const calculated =
          calculateEntryMetrics(
            entry
          );

        return (
          calculated.totalRevenue
        );

      }
    );


  dailyRevenueChart =
    new Chart(
      canvas,
      {

        type: "line",

        data: {

          labels,

          datasets: [

            {

              label:
                "Revenue",

              data:
                revenueData,

              borderColor:
                "#0f172a",

              backgroundColor:
                "rgba(15,23,42,0.1)",

              borderWidth:
                2,

              fill: true,

              tension:
                0.35

            }

          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false

        }

      }
    );

}


// =========================
// GOP TREND
// =========================

function renderGopTrendChart(
  entries
) {

  const canvas =
    document.getElementById(
      "gopTrendChart"
    );

  if(
    !canvas ||
    typeof Chart ===
    "undefined"
  ) return;


  destroyChart(
    gopTrendChart
  );


  const labels =
    getChartLabels(
      entries
    );


  const gopData =
    entries.map(
      entry => {

        const calculated =
          calculateEntryMetrics(
            entry
          );

        return (
          calculated.gop
        );

      }
    );


  gopTrendChart =
    new Chart(
      canvas,
      {

        type: "bar",

        data: {

          labels,

          datasets: [

            {

              label:
                "GOP",

              data:
                gopData,

              backgroundColor:
                "#1e293b"

            }

          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false

        }

      }
    );

}


// =========================
// FOOD VS BEVERAGE
// =========================

function renderRevenueMixChart(
  entries
) {

  const canvas =
    document.getElementById(
      "revenueMixChart"
    );

  if(
    !canvas ||
    typeof Chart ===
    "undefined"
  ) return;


  destroyChart(
    revenueMixChart
  );


  let totalFood = 0;
  let totalBeverage = 0;


  entries.forEach(
    entry => {

      totalFood +=
        Number(
          entry.foodRevenue || 0
        );

      totalBeverage +=
        Number(
          entry.beverageRevenue || 0
        );

    }
  );


  revenueMixChart =
    new Chart(
      canvas,
      {

        type: "doughnut",

        data: {

          labels: [
            "Food",
            "Beverage"
          ],

          datasets: [

            {

              data: [
                totalFood,
                totalBeverage
              ],

              backgroundColor: [
                "#0f172a",
                "#475569"
              ]

            }

          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false

        }

      }
    );

}


// =========================
// MASTER RENDER
// =========================

function renderCharts(
  entries
) {

  renderDailyRevenueChart(
    entries
  );

  renderGopTrendChart(
    entries
  );

  renderRevenueMixChart(
    entries
  );

}
