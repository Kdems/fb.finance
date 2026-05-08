let dailyRevenueChart = null;
let gopChart = null;


// ======================
// CHART COLORS
// ======================

const chartBorder = "#0f172a";
const chartBackground = "rgba(15, 23, 42, 0.12)";


// ======================
// DESTROY OLD CHART
// ======================

function destroyChart(chartInstance) {

  if(chartInstance) {
    chartInstance.destroy();
  }

}


// ======================
// DAILY REVENUE
// ======================

function renderDailyRevenueChart(entries) {

  const canvas =
    document.getElementById(
      "dailyRevenueChart"
    );

  if(!canvas) return;

  destroyChart(
    dailyRevenueChart
  );

  const labels = [];
  const values = [];

  entries.forEach(entry => {

    const calculated =
      calculateEntryMetrics(entry);

    labels.push(
      entry.date
    );

    values.push(
      calculated.totalRevenue
    );

  });

  dailyRevenueChart =
    new Chart(canvas, {

      type: "line",

      data: {

        labels,

        datasets: [

          {
            label: "Revenue",

            data: values,

            borderColor:
              chartBorder,

            backgroundColor:
              chartBackground,

            fill: true,

            tension: 0.35

          }

        ]

      }

    });

}


// ======================
// GOP TREND
// ======================

function renderGopChart(entries) {

  const canvas =
    document.getElementById(
      "gopTrendChart"
    );

  if(!canvas) return;

  destroyChart(
    gopChart
  );

  const labels = [];
  const values = [];

  entries.forEach(entry => {

    const calculated =
      calculateEntryMetrics(entry);

    labels.push(
      entry.date
    );

    values.push(
      calculated.gop
    );

  });

  gopChart =
    new Chart(canvas, {

      type: "bar",

      data: {

        labels,

        datasets: [

          {
            label: "GOP",

            data: values,

            backgroundColor:
              chartBorder

          }

        ]

      }

    });

}


// ======================
// MAIN RENDER
// ======================

function renderCharts(entries) {

  renderDailyRevenueChart(
    entries
  );

  renderGopChart(
    entries
  );

}
