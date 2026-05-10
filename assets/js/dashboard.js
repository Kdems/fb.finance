window.onload = function () {

  buildDashboardDropdowns();

  setupDashboardFilters();

  renderDashboard();

};









function buildDashboardDropdowns() {

  buildYearDropdown(
    "dashboardYear"
  );



  buildMonthDropdown(
    "dashboardMonth"
  );

}










function setupDashboardFilters() {

  document
    .getElementById(
      "dashboardOutlet"
    )
    .addEventListener(
      "change",
      renderDashboard
    );



  document
    .getElementById(
      "dashboardYear"
    )
    .addEventListener(
      "change",
      renderDashboard
    );



  document
    .getElementById(
      "dashboardMonth"
    )
    .addEventListener(
      "change",
      renderDashboard
    );

}

function renderDashboard() {

  const outlet =
    document
      .getElementById(
        "dashboardOutlet"
      )
      .value;



  const year =
    Number(
      document
        .getElementById(
          "dashboardYear"
        )
        .value
    );



  const month =
    Number(
      document
        .getElementById(
          "dashboardMonth"
        )
        .value
    );





  const data =

    calculateDashboardData(

      outlet,

      year,

      month

    );





  renderYtd(
    data
  );



  renderMtd(
    data
  );



  renderGop(
    data
  );



  renderCost(
    data
  );





  renderSummary(
    data
  );



  renderRecent(
    outlet,
    year,
    month
  );



  renderRanking(
    year,
    month
  );



  renderAlerts(
    data
  );

}

function renderYtd() {
  document.getElementById(
    "ytdSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>YTD Performance</h2>";
}



function renderMtd() {
  document.getElementById(
    "mtdSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>MTD Performance</h2>";
}



function renderGop() {
  document.getElementById(
    "gopSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>GOP Performance</h2>";
}



function renderCost() {
  document.getElementById(
    "costSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>Cost Control</h2>";
}



function renderSummary() {
  document.getElementById(
    "summarySection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>Summary</h2>";
}



function renderRecent() {
  document.getElementById(
    "recentSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>Recent Entries</h2>";
}



function renderRanking() {
  document.getElementById(
    "rankingSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>Outlet Ranking</h2>";
}



function renderAlerts() {
  document.getElementById(
    "alertSection"
  ).innerHTML =
    "<h2 class='text-2xl font-bold'>Executive Alerts</h2>";
}

function buildYearDropdown(id) {

  const select =
    document.getElementById(id);



  let html = "";



  for (
    let year = 2025;
    year <= 2030;
    year++
  ) {

    html += `
      <option value="${year}">
        ${year}
      </option>
    `;

  }



  select.innerHTML =
    html;

}







function buildMonthDropdown(id) {

  const months = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",

    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

  ];



  const select =
    document.getElementById(id);



  select.innerHTML =

    months
      .map(
        (
          month,
          index
        ) => {

          return `
            <option value="${index + 1}">
              ${month}
            </option>
          `;

        }
      )
      .join("");

}