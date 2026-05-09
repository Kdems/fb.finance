let revenueChartInstance =
  null;

let gopChartInstance =
  null;

let mixChartInstance =
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


  const ctx =
    canvas.getContext(
      "2d"
    );


  if(
    revenueChartInstance
  ) {

    revenueChartInstance.destroy();

  }


  const labels =
    entries.map(
      entry => {

        const date =
          new Date(
            entry.date
          );


        return date.getDate();

      }
    );


  const data =
    entries.map(
      entry => {

        return (

          Number(
            entry.foodRevenue || 0
          ) +

          Number(
            entry.beverageRevenue || 0
          )

        );

      }
    );


  revenueChartInstance =
    new Chart(
      ctx,
      {

        type:
          "line",


        data:
          {

            labels:
              labels,


            datasets:
              [

                {

                  label:
                    "Revenue",


                  data:
                    data,


                  tension:
                    0.3,

                  borderWidth:
                    2

                }

              ]

          },


        options:
          {

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


  const ctx =
    canvas.getContext(
      "2d"
    );


  if(
    gopChartInstance
  ) {

    gopChartInstance.destroy();

  }


  const settings =
    getSettings();


  const labels =
    [];


  const gopValues =
    [];


  entries.forEach(
    entry => {

      const date =
        new Date(
          entry.date
        );


      labels.push(
        date.getDate()
      );


      const foodRevenue =
        Number(
          entry.foodRevenue || 0
        );


      const beverageRevenue =
        Number(
          entry.beverageRevenue || 0
        );


      const revenue =
        foodRevenue +
        beverageRevenue;


      const foodCost =
        foodRevenue *
        (
          Number(
            settings.foodCostPercent || 0
          ) / 100
        );


      const beverageCost =
        beverageRevenue *
        (
          Number(
            settings.beverageCostPercent || 0
          ) / 100
        );


      const fixCost =
        revenue *
        (
          Number(
            settings.fixCostPercent || 0
          ) / 100
        );


      const totalCost =
        foodCost +
        beverageCost +
        fixCost;


      const gop =
        revenue -
        totalCost;


      gopValues.push(
        gop
      );

    );


  gopChartInstance =
    new Chart(
      ctx,
      {

        type:
          "bar",


        data:
          {

            labels:
              labels,


            datasets:
              [

                {

                  label:
                    "GOP",


                  data:
                    gopValues,

                  borderWidth:
                    1

                }

              ]

          },


        options:
          {

            responsive:
              true,


            maintainAspectRatio:
              false

          }

      }
    );

}



// ======================
// SALES MIX
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


  const ctx =
    canvas.getContext(
      "2d"
    );


  if(
    mixChartInstance
  ) {

    mixChartInstance.destroy();

  }


  let totalFood =
    0;

  let totalBeverage =
    0;


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


  mixChartInstance =
    new Chart(
      ctx,
      {

        type:
          "doughnut",


        data:
          {

            labels:
              [

                "Food",

                "Beverage"

              ],


            datasets:
              [

                {

                  data:
                    [

                      totalFood,

                      totalBeverage

                    ]

                }

              ]

          },


        options:
          {

            responsive:
              true,


            maintainAspectRatio:
              false

          }

      }
    );

}
