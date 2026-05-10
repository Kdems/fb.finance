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





  // ====================
  // REVENUE
  // ====================

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







  // ====================
  // COST
  // ====================

  const foodCost =

    foodRevenue *

    (
      monthlyTarget
        .foodCostPercent / 100
    );



  const beverageCost =

    beverageRevenue *

    (
      monthlyTarget
        .beverageCostPercent / 100
    );



  const fixedCost =

    totalRevenue *

    (
      monthlyTarget
        .fixedCostPercent / 100
    );



  const totalCost =

    foodCost +

    beverageCost +

    fixedCost;







  // ====================
  // GOP
  // ====================

  const gop =

    totalRevenue -

    totalCost;



  const gopMargin =

    totalRevenue

      ? (

          gop /

          totalRevenue

        ) * 100

      : 0;







  // ====================
  // TARGET
  // ====================

  const targetRevenue =

    monthlyTarget
      .foodTarget +

    monthlyTarget
      .beverageTarget;





  const revenueVariance =

    totalRevenue -

    targetRevenue;





  const revenueAchievement =

    targetRevenue

      ? (

          totalRevenue /

          targetRevenue

        ) * 100

      : 0;







  // ====================
  // LY
  // ====================

  const lyRevenue =

    monthlyTarget
      .lyFoodRevenue +

    monthlyTarget
      .lyBeverageRevenue;





  const lyGrowth =

    lyRevenue

      ? (

          (

            totalRevenue -

            lyRevenue

          ) /

          lyRevenue

        ) * 100

      : 0;







  // ====================
  // DAYS
  // ====================

  const today =
    new Date();



  const daysInMonth =
    new Date(

      year,

      month,

      0

    ).getDate();



  const daysLeft =

    daysInMonth -

    today.getDate();





  const dailyPace =

    daysLeft > 0

      ? (

          revenueVariance /

          daysLeft

        )

      : 0;





  const projectedRevenue =

    totalRevenue +

    (

      dailyPace *

      daysLeft

    );







  // ====================
  // YTD
  // ====================

  const ytdRevenue =
    getYtdRevenue(

      outlet,

      year,

      month

    );



  const ytdVariance =

    ytdRevenue -

    annualTarget
      .annualRevenueTarget;



  const ytdAchievement =

    annualTarget
      .annualRevenueTarget

      ? (

          ytdRevenue /

          annualTarget
            .annualRevenueTarget

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



    targetRevenue,

    revenueVariance,

    revenueAchievement,



    lyRevenue,

    lyGrowth,



    daysLeft,

    dailyPace,

    projectedRevenue,



    ytdRevenue,

    ytdVariance,

    ytdAchievement

  };

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

          outlet ===
          "ALL"

            ||

          item.outlet ===
            outlet;



        return (

          outletMatch &&

          date.getFullYear() ===
            year &&

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

  return (

    getMonthlyTargets()

      .find(
        item => {

          return (

            item.outlet ===
              outlet &&

            item.year ===
              year &&

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

  return (

    getAnnualTargets()

      .find(
        item => {

          return (

            item.outlet ===
              outlet &&

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

  let total =
    0;



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

}
