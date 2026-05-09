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





// ====================
// REVENUE
// ====================

function renderRevenueChart(
  entries
) {

  const canvas =
    document.getElementById(
      "revenueChart"
    );

  if (!canvas)
    return;


  if (
    revenueChart
  ) {

    revenueChart.destroy();

  }


  const labels =
    entries.map(
      x =>
        new Date(
          x.date
        ).getDate()
    );


  const data =
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

          labels:
            labels,

          datasets: [

            {

              label:
                "Daily Revenue",

              data:
                data,

              borderWidth:
                3,

              tension:
                0.35,

              fill:
                false

            }

          ]

        },

        options: {

          responsive:
            true,

          plugins: {

            legend: {

              display:
                true

            }

          }

        }

      }
    );

}





// ====================
// GOP
// ====================

function renderGopChart(
  entries
) {

  const canvas =
    document.getElementById(
      "gopChart"
    );

  if (!canvas)
    return;


  if (
    gopChart
  ) {

    gopChart.destroy();

  }


  const labels =
    entries.map(
      x =>
        new Date(
          x.date
        ).getDate()
    );


  const values =
    entries.map(
      x => {

        const food =
          Number(
            x.foodRevenue || 0
          );

        const bev =
          Number(
            x.beverageRevenue || 0
          );

        const total =
          food + bev;

        const foodCost =
          Number(
            x.foodCost || 0
          );

        const bevCost =
          Number(
            x.beverageCost || 0
          );

        const fixCost =
          Number(
            x.fixCost || 0
          );


        return (

          total -

          foodCost -

          bevCost -

          fixCost

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

          labels:
            labels,

          datasets: [

            {

              label:
                "Daily GOP",

              data:
                values,

              borderWidth:
                1

            }

          ]

        },

        options: {

          responsive:
            true

        }

      }
    );

}





// ====================
// MIX
// ====================

function renderMixChart(
  entries
) {

  const canvas =
    document.getElementById(
      "mixChart"
    );

  if (!canvas)
    return;


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

          plugins: {

            legend: {

              position:
                "bottom"

            }

          }

        }

      }
    );

}
