let revenueChart =
  null;

let gopChart =
  null;

let mixChart =
  null;





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
// REVENUE
// ======================

function renderRevenueChart(
  entries
) {

  const canvas =
    document.getElementById(
      "revenueChart"
    );

  if (!canvas)
    return;


  canvas.height =
    280;


  if (
    revenueChart
  ) {

    revenueChart.destroy();

  }


  const labels =
    entries.map(
      x =>
        formatShortDate(
          x.date
        )
    );


  const values =
    entries.map(
      x =>

        Number(
          x.foodRevenue || 0
        ) +

        Number(
          x.beverageRevenue || 0
        )

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

              borderWidth:
                3,

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

  if (!canvas)
    return;


  canvas.height =
    280;


  if (
    gopChart
  ) {

    gopChart.destroy();

  }


  const labels =
    entries.map(
      x =>
        formatShortDate(
          x.date
        )
    );


  const values =
    entries.map(
      x => {

        const revenue =

          Number(
            x.foodRevenue || 0
          ) +

          Number(
            x.beverageRevenue || 0
          );


        const cost =

          Number(
            x.foodCost || 0
          ) +

          Number(
            x.beverageCost || 0
          ) +

          Number(
            x.fixCost || 0
          );


        return (
          revenue -
          cost
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
            false

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

  if (!canvas)
    return;


  canvas.height =
    280;


  if (
    mixChart
  ) {

    mixChart.destroy();

  }


  let food =
    0;

  let bev =
    0;


  entries.forEach(
    x => {

      food +=
        Number(
          x.foodRevenue || 0
        );

      bev +=
        Number(
          x.beverageRevenue || 0
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

                bev

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





function formatShortDate(
  value
) {

  const date =
    new Date(
      value
    );


  return date.getDate();

}
