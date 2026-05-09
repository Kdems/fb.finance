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

  const sortedEntries =
    [...entries].sort(
      (
        a,
        b
      ) =>
        new Date(
          a.date
        ) -
        new Date(
          b.date
        )
    );


  renderRevenueChart(
    sortedEntries
  );


  renderGopChart(
    sortedEntries
  );


  renderMixChart(
    sortedEntries
  );

}



// ======================
// HELPERS
// ======================

function formatChartDate(
  rawDate
) {

  const date =
    new Date(
      rawDate
    );


  return String(
    date.getDate()
  ).padStart(
    2,
    "0"
  );

}



// ======================
// REVENUE
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


  const values =
    [];


  entries.forEach(
    entry => {

      labels.push(
        formatChartDate(
          entry.date
        )
      );


      values.push(

        Number(
          entry.foodRevenue || 0
        ) +

        Number(
          entry.beverageRevenue || 0
        )

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


              data:
                values,


              tension:
                0.35,

              borderWidth:
                2,

              fill:
                false

            }

          ]

        },


        options: {

          responsive:
            true,


          maintainAspectRatio:
            false,


          plugins: {

            legend: {

              display:
                true,

              position:
                "top"

            }

          }

        }

      }
    );

}



// ======================
// GOP
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


  const values =
    [];


  entries.forEach(
    entry => {

      labels.push(
        formatChartDate(
          entry.date
        )
      );


      const calc =
        calculateEntryMetrics(
          entry
        );


      values.push(
        calc.gop
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


              data:
                values

            }

          ]

        },


        options: {

          responsive:
            true,


          maintainAspectRatio:
            false,


          plugins: {

            legend: {

              display:
                true,

              position:
                "top"

            }

          }

        }

      }
    );

}



// ======================
// MIX
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
            false,


          plugins: {

            legend: {

              display:
                true,

              position:
                "top"

            }

          }

        }

      }
    );

}
