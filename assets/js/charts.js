let revenueChart =
  null;

let gopChart =
  null;

let mixChart =
  null;


// ======================
// MAIN
// ======================

function renderCharts(
  entries
) {

  renderRevenueChart(
    entries
  );


  renderGopChart(
    entries
  );


  renderMixChart(
    entries
  );

}


// ======================
// REVENUE TREND
// ======================

function renderRevenueChart(
  entries
) {

  const canvas =
    document.getElementById(
      "revenueChart"
    );

  if(
    !canvas
  ) return;


  if(
    revenueChart
  ) {

    revenueChart.destroy();

  }


  const labels =
    [];

  const data =
    [];


  entries.forEach(
    entry => {

      labels.push(
        entry.date
      );


      const revenue =
        Number(
          entry.foodRevenue || 0
        ) +
        Number(
          entry.beverageRevenue || 0
        );


      data.push(
        revenue
      );

    }
  );


  revenueChart =
    new Chart(
      canvas,
      {

        type:
          "line",


        data: {

          labels,

          datasets: [

            {

              label:
                "Revenue",

              data,

              tension:
                0.3

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


// ======================
// GOP TREND
// ======================

function renderGopChart(
  entries
) {

  const canvas =
    document.getElementById(
      "gopChart"
    );

  if(
    !canvas
  ) return;


  if(
    gopChart
  ) {

    gopChart.destroy();

  }


  const labels =
    [];

  const data =
    [];


  entries.forEach(
    entry => {

      labels.push(
        entry.date
      );


      const calculated =
        calculateEntryMetrics(
          entry
        );


      data.push(
        calculated.gop
      );

    }
  );


  gopChart =
    new Chart(
      canvas,
      {

        type:
          "bar",


        data: {

          labels,

          datasets: [

            {

              label:
                "GOP",

              data

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


// ======================
// FOOD VS BEVERAGE
// ======================

function renderMixChart(
  entries
) {

  const canvas =
    document.getElementById(
      "mixChart"
    );

  if(
    !canvas
  ) return;


  if(
    mixChart
  ) {

    mixChart.destroy();

  }


  let food =
    0;


  let beverage =
    0;


  entries.forEach(
    entry => {

      food +=
        Number(
          entry.foodRevenue || 0
        );


      beverage +=
        Number(
          entry.beverageRevenue || 0
        );

    }
  );


  mixChart =
    new Chart(
      canvas,
      {

        type:
          "doughnut",


        data: {

          labels: [

            "Food",

            "Beverage"

          ],


          datasets: [

            {

              data: [

                food,

                beverage

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
