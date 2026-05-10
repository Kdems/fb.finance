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

}
