 function calculateDashboardData(
  outlet,
  year,
  month
) {

  const dailyEntries =

    getFilteredDailyEntries(

      outlet,

      year,

      month

    );





  const monthlyTarget =

    getMonthlyTarget(

      outlet,

      year,

      month

    );





  const annualTarget =

    getAnnualTarget(

      outlet,

      year

    );







  // REVENUE
  const foodRevenue =

    sumField(
      dailyEntries,
      "foodRevenue"
    );



  const beverageRevenue =

    sumField(
      dailyEntries,
      "beverageRevenue"
    );



  const totalRevenue =

    foodRevenue +

    beverageRevenue;







  // COST %
  const foodCostPercent =

    Number(
      monthlyTarget
        .foodCostPercent || 0
    );



  const beverageCostPercent =

    Number(
      monthlyTarget
        .beverageCostPercent || 0
    );



  const fixedCostPercent =

    Number(
      monthlyTarget
        .fixedCostPercent || 0
    );







  // COST VALUE
  const foodCost =

    foodRevenue *

    (
      foodCostPercent / 100
    );



  const beverageCost =

    beverageRevenue *

    (
      beverageCostPercent / 100
    );



  const fixedCost =

    totalRevenue *

    (
      fixedCostPercent / 100
    );



  const totalCost =

    foodCost +

    beverageCost +

    fixedCost;







  // GOP
  const gop =

    totalRevenue -

    totalCost;





  const gopMargin =

    totalRevenue > 0

      ? (

          gop /

          totalRevenue

        ) * 100

      : 0;







  // TARGET
  const foodTarget =

    Number(
      monthlyTarget
        .foodTarget || 0
    );



  const beverageTarget =

    Number(
      monthlyTarget
        .beverageTarget || 0
    );





  const targetRevenue =

    foodTarget +

    beverageTarget;





  const revenueVariance =

    totalRevenue -

    targetRevenue;





  const revenueAchievement =

    targetRevenue > 0

      ? (

          totalRevenue /

          targetRevenue

        ) * 100

      : 0;







  // LY
  const lyFoodRevenue =

    Number(
      monthlyTarget
        .lyFoodRevenue || 0
    );



  const lyBeverageRevenue =

    Number(
      monthlyTarget
        .lyBeverageRevenue || 0
    );





  const lyRevenue =

    lyFoodRevenue +

    lyBeverageRevenue;





  const lyGrowth =

    lyRevenue > 0

      ? (

          (

            totalRevenue -

            lyRevenue

          ) /

          lyRevenue

        ) * 100

      : 0;







  // DAYS
  const today =
    new Date();



  const daysInMonth =
    new Date(

      year,

      month,

      0

    ).getDate();





  const daysLeft =

    Math.max(

      daysInMonth -

      today.getDate(),

      0

    );





  const dailyPace =

    daysLeft > 0

      ? (

          revenueVariance /

          daysLeft

        )

      : 0;







  // YTD
  const ytdRevenue =

    getYtdRevenue(

      outlet,

      year,

      month

    );





  const annualRevenueTarget =

    Number(
      annualTarget
        .annualRevenueTarget || 0
    );





  const ytdVariance =

    ytdRevenue -

    annualRevenueTarget;





  const ytdAchievement =

    annualRevenueTarget > 0

      ? (

          ytdRevenue /

          annualRevenueTarget

        ) * 100

      : 0;





    const gopTarget =

  Number(
    monthlyTarget
      .gopTarget || 0
  );





const gopAchievement =

  gopTarget > 0

    ? (

        gop /

        gopTarget

      ) * 100

    : 0;  






  return {

    foodRevenue,

    beverageRevenue,

    totalRevenue,



    foodCost,

    beverageCost,

    fixedCost,

    totalCost,



    gop,

    gopMargin,

    gopTarget,

    gopAchievement,



    targetRevenue,

    revenueVariance,

    revenueAchievement,



    lyRevenue,

    lyGrowth,



    daysLeft,

    dailyPace,



    ytdRevenue,

    annualRevenueTarget,

    ytdVariance,

    ytdAchievement

  };

}









function sumField(
  rows,
  field
) {

  return rows.reduce(

    (
      total,
      item
    ) => {

      return (

        total +

        Number(
          item[
            field
          ] || 0
        )

      );

    },

    0

  );

}









function getFilteredDailyEntries(
  outlet,
  year,
  month
) {

  return getDailyEntries()

    .filter(
      item => {

        const date =
          new Date(
            item.date
          );





        const outletMatch =

          outlet === "ALL"

            ||

          item.outlet ===
            outlet;







        return (

          outletMatch

          &&

          date.getFullYear() ===
            year

          &&

          date.getMonth() + 1 ===
            month

        );

      }
    );

}









function getMonthlyTarget(
  outlet,
  year,
  month
) {





  if (
    outlet === "ALL"
  ) {

    const targets =

      getMonthlyTargets()

        .filter(
          item => {

            return (

              item.year ===
                year

              &&

              item.month ===
                month

            );

          }
        );






    return {

      foodTarget:

        sumField(
          targets,
          "foodTarget"
        ),



      beverageTarget:

        sumField(
          targets,
          "beverageTarget"
        ),



      lyFoodRevenue:

        sumField(
          targets,
          "lyFoodRevenue"
        ),



      lyBeverageRevenue:

        sumField(
          targets,
          "lyBeverageRevenue"
        ),



      foodCostPercent:

        targets.length > 0

          ? (

              sumField(
                targets,
                "foodCostPercent"
              )

              /

              targets.length

            )

          : 0,



      beverageCostPercent:

        targets.length > 0

          ? (

              sumField(
                targets,
                "beverageCostPercent"
              )

              /

              targets.length

            )

          : 0,



      fixedCostPercent:

        targets.length > 0

          ? (

              sumField(
                targets,
                "fixedCostPercent"
              )

              /

              targets.length

            )

          : 0,



      gopTarget:

        sumField(
          targets,
          "gopTarget"
        )

    };

  }






  return (

    getMonthlyTargets()

      .find(
        item => {

          return (

            item.outlet ===
              outlet

            &&

            item.year ===
              year

            &&

            item.month ===
              month

          );

        }
      )

    ||

    {}

  );

}









function getAnnualTarget(
  outlet,
  year
) {





  if (
    outlet === "ALL"
  ) {

    const targets =

      getAnnualTargets()

        .filter(
          item => {

            return (

              item.year ===
                year

            );

          }
        );







    return {

      annualRevenueTarget:

        sumField(
          targets,
          "annualRevenueTarget"
        ),



      annualGopTarget:

        sumField(
          targets,
          "annualGopTarget"
        )

    };

  }









  return (

    getAnnualTargets()

      .find(
        item => {

          return (

            item.outlet ===
              outlet

            &&

            item.year ===
              year

          );

        }
      )

    ||

    {}

  );

}









function getYtdRevenue(
  outlet,
  year,
  month
) {

  let total = 0;



  for (
    let m = 1;
    m <= month;
    m++
  ) {

    const rows =

      getFilteredDailyEntries(

        outlet,

        year,

        m

      );



    total +=

      sumField(
        rows,
        "foodRevenue"
      )

      +

      sumField(
        rows,
        "beverageRevenue"
      );

  }



  return total;

}