window.onload = function () {

  buildDropdowns();

  setupDailyAutoTotal();

  setupRecentFilters();

  setupTargetReload();

  bindDailyForm();

  bindMonthlyForm();

  bindAnnualForm();

  renderRecentEntries();

  loadMonthlyTargetToForm();

  loadAnnualTargetToForm();

};





function bindDailyForm() {

  const form =
    document.getElementById(
      "dailyForm"
    );



  form.addEventListener(
    "submit",

    function (
      event
    ) {

      event.preventDefault();

      const selectedDate =

        getValue(
          "dailyDate"
        );

        alert(
          selectedDate
        );

      if (
        !selectedDate ||

         selectedDate ===
         "dd/mm/yyyy"

      ) {

        alert(
          "Please select date first"
        );

        return;

      }



      const foodRevenue =

        Number(
          getValue(
            "dailyFoodRevenue"
          )
        );



      const beverageRevenue =

        Number(
          getValue(
            "dailyBeverageRevenue"
          )
        );





      addDailyEntry({

        outlet:
          getValue(
            "dailyOutlet"
          ),



        date:
          getValue(
            "dailyDate"
          ),



        foodRevenue,



        beverageRevenue

      });





      alert(
        "Daily entry saved successfully"
      );





      form.reset();

      document
        .getElementById(
          "dailyDate"
        )
        .focus();







      renderRecentEntries();

    }

  );

}

function bindMonthlyForm() {

  const form =
    document.getElementById(
      "monthlyForm"
    );



  form.addEventListener(
    "submit",

    function(
      event
    ) {

      event.preventDefault();




      saveMonthlyTarget({

        outlet:
          getValue(
            "monthlyOutlet"
          ),



        year:
          Number(
            getValue(
              "monthlyYear"
            )
          ),



        month:
          Number(
            getValue(
              "monthlyMonth"
            )
          ),



        foodTarget:
          Number(
            getValue(
              "foodTarget"
            )
          ),



        beverageTarget:
          Number(
            getValue(
              "beverageTarget"
            )
          ),



        lyFoodRevenue:
          Number(
            getValue(
              "lyFoodRevenue"
            )
          ),



        lyBeverageRevenue:
          Number(
            getValue(
              "lyBeverageRevenue"
            )
          ),



        foodCostPercent:
          Number(
            getValue(
              "foodCostPercent"
            )
          ),



        beverageCostPercent:
          Number(
            getValue(
              "beverageCostPercent"
            )
          ),



        fixedCostPercent:
          Number(
            getValue(
              "fixedCostPercent"
            )
          ),



        gopTarget:
          Number(
            getValue(
              "gopTarget"
            )
          )

      });



      alert(
        "Monthly target saved"
      );

    }

  );

}

function bindAnnualForm() {

  const form =
    document.getElementById(
      "annualForm"
    );



  form.addEventListener(
    "submit",

    function(
      event
    ) {

      event.preventDefault();



      saveAnnualTarget({

        outlet:
          getValue(
            "annualOutlet"
          ),



        year:
          Number(
            getValue(
              "annualYear"
            )
          ),



        annualRevenueTarget:
          Number(
            getValue(
              "annualRevenueTarget"
            )
          ),



        annualGopTarget:
          Number(
            getValue(
              "annualGopTarget"
            )
          )

      });



      alert(
        "Annual target saved"
      );

    }

  );

}

function renderRecentEntries() {

  const selectedOutlet =
    document.getElementById(
      "filterOutlet"
    ).value;



  const selectedYear =
    Number(
      document.getElementById(
        "filterYear"
      ).value
    );



  const selectedMonth =
    Number(
      document.getElementById(
        "filterMonth"
      ).value
    );





  const entries =

    getDailyEntries()

      .filter(
        item => {

          const date =
            new Date(
              item.date
            );



          const outletMatch =

            selectedOutlet ===
              "ALL"

              ||

            item.outlet ===
              selectedOutlet;





          const yearMatch =

            date.getFullYear() ===
              selectedYear;





          const monthMatch =

            date.getMonth() + 1 ===
              selectedMonth;





          return (

            outletMatch &&

            yearMatch &&

            monthMatch

          );

        }
      );





  const container =
    document.getElementById(
      "recentEntryList"
    );





  if (
    entries.length === 0
  ) {

    container.innerHTML =

      `
        <p class="text-slate-400">
          No entries found
        </p>
      `;

    return;

  }






  let html = `

    <div
      class="grid grid-cols-7 gap-4 font-semibold text-slate-600 border-b border-slate-200 pb-3 mb-3">

      <div>Date</div>

      <div>Outlet</div>

      <div>Food</div>

      <div>Beverage</div>

      <div>Total</div>

      <div>Edit</div>

      <div>Delete</div>

    </div>

  `;






  html +=

    entries
      .slice()
      .reverse()

      .map(
        item => {

          const food =
            Number(
              item.foodRevenue || 0
            );



          const beverage =
            Number(
              item.beverageRevenue || 0
            );



          const total =
            food + beverage;





          return `

            <div
              class="grid grid-cols-7 gap-4 border-b border-slate-200 py-3 hover:bg-cyan-50 rounded-xl px-3 transition-all duration-200">

              <div>
                ${item.date}
              </div>



              <div>
                ${item.outlet}
              </div>



              <div>
                RM${food.toLocaleString()}
              </div>



              <div>
                RM${beverage.toLocaleString()}
              </div>



              <div class="font-semibold">
                RM${total.toLocaleString()}
              </div>



              <button
                onclick="editEntry(${item.id})">

                Edit

              </button>



              <button
                onclick="removeEntry(${item.id})"
                class="text-red-500">

                Delete

              </button>

            </div>

          `;

        }
      )

      .join("");





  container.innerHTML =
    html;

}

function editEntry(
  entryId
) {

  const item =
    getDailyEntries()

      .find(
        x =>

          x.id ==
          entryId
      );



  if (
    !item
  ) return;



  document
    .getElementById(
      "dailyOutlet"
    ).value =
      item.outlet;



  document
    .getElementById(
      "dailyDate"
    ).value =
      item.date;



  document
    .getElementById(
      "dailyFoodRevenue"
    ).value =
      item.foodRevenue;



  document
    .getElementById(
      "dailyBeverageRevenue"
    ).value =
      item.beverageRevenue;



  deleteDailyEntry(
    entryId
  );



  renderRecentEntries();

}





function removeEntry(
  entryId
) {

  deleteDailyEntry(
    entryId
  );



  renderRecentEntries();

}





function getValue(
  id
) {

  return document
    .getElementById(
      id
    ).value;

}

function buildDropdowns() {

  buildYearDropdown(
    "monthlyYear"
  );



  buildYearDropdown(
    "annualYear"
  );



  buildYearDropdown(
    "filterYear"
  );





  buildMonthDropdown(
    "monthlyMonth"
  );



  buildMonthDropdown(
    "filterMonth"
  );








  const today =
    new Date();





  const currentYear =
    today.getFullYear();





  const currentMonth =
    today.getMonth() + 1;








  // MONTHLY
  document
    .getElementById(
      "monthlyYear"
    )
    .value =

    currentYear;



  document
    .getElementById(
      "monthlyMonth"
    )
    .value =

    currentMonth;








  // ANNUAL
  document
    .getElementById(
      "annualYear"
    )
    .value =

    currentYear;








  // FILTER
  document
    .getElementById(
      "filterYear"
    )
    .value =

    currentYear;



  document
    .getElementById(
      "filterMonth"
    )
    .value =

    currentMonth;

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
          name,
          index
        ) => {

          return `

            <option value="${index + 1}">

              ${name}

            </option>

          `;

        }
      )
      .join("");

}


function setupDailyAutoTotal() {

  const foodInput =
    document.getElementById(
      "dailyFoodRevenue"
    );



  const beverageInput =
    document.getElementById(
      "dailyBeverageRevenue"
    );



  const totalInput =
    document.getElementById(
      "dailyTotalRevenue"
    );





  function updateTotal() {

    const food =

      Number(
        foodInput.value || 0
      );



    const beverage =

      Number(
        beverageInput.value || 0
      );



    totalInput.value =

      food + beverage;

  }





  foodInput.addEventListener(
    "input",
    updateTotal
  );



  beverageInput.addEventListener(
    "input",
    updateTotal
  );

}

function setupRecentFilters() {

  const selectedOutlet =

  getValue(
    "filterOutlet"
  );



const selectedYear =

  Number(
    getValue(
      "filterYear"
    )
  );



const selectedMonth =

  Number(
    getValue(
      "filterMonth"
    )
  );

  document
    .getElementById(
      "filterOutlet"
    )
    .addEventListener(
      "change",
      renderRecentEntries
    );



  document
    .getElementById(
      "filterYear"
    )
    .addEventListener(
      "change",
      renderRecentEntries
    );



  document
    .getElementById(
      "filterMonth"
    )
    .addEventListener(
      "change",
      renderRecentEntries
    );

}

function setupTargetReload() {

  // MONTHLY
  document
    .getElementById(
      "monthlyOutlet"
    )
    .addEventListener(
      "change",
      loadMonthlyTargetToForm
    );



  document
    .getElementById(
      "monthlyYear"
    )
    .addEventListener(
      "change",
      loadMonthlyTargetToForm
    );



  document
    .getElementById(
      "monthlyMonth"
    )
    .addEventListener(
      "change",
      loadMonthlyTargetToForm
    );






  // ANNUAL
  document
    .getElementById(
      "annualOutlet"
    )
    .addEventListener(
      "change",
      loadAnnualTargetToForm
    );



  document
    .getElementById(
      "annualYear"
    )
    .addEventListener(
      "change",
      loadAnnualTargetToForm
    );

}

function loadMonthlyTargetToForm() {

  const outlet =
    getValue(
      "monthlyOutlet"
    );



  const year =
    Number(
      getValue(
        "monthlyYear"
      )
    );



  const month =
    Number(
      getValue(
        "monthlyMonth"
      )
    );





  const target =

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
      );





  if (
    !target
  ) return;





  document.getElementById(
    "foodTarget"
  ).value =
    target.foodTarget || "";



  document.getElementById(
    "beverageTarget"
  ).value =
    target.beverageTarget || "";



  document.getElementById(
    "lyFoodRevenue"
  ).value =
    target.lyFoodRevenue || "";



  document.getElementById(
    "lyBeverageRevenue"
  ).value =
    target.lyBeverageRevenue || "";



  document.getElementById(
    "foodCostPercent"
  ).value =
    target.foodCostPercent || "";



  document.getElementById(
    "beverageCostPercent"
  ).value =
    target.beverageCostPercent || "";



  document.getElementById(
    "fixedCostPercent"
  ).value =
    target.fixedCostPercent || "";



  document.getElementById(
    "gopTarget"
  ).value =
    target.gopTarget || "";

}

function loadAnnualTargetToForm() {

  const outlet =
    getValue(
      "annualOutlet"
    );



  const year =
    Number(
      getValue(
        "annualYear"
      )
    );





  const target =

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
      );





  if (
    !target
  ) return;





  document.getElementById(
    "annualRevenueTarget"
  ).value =
    target.annualRevenueTarget || "";



  document.getElementById(
    "annualGopTarget"
  ).value =
    target.annualGopTarget || "";

}