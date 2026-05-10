window.onload = function () {

  buildDropdowns();

  setupDailyAutoTotal();

  setupRecentFilters();

  bindDailyForm();

  bindMonthlyForm();

  bindAnnualForm();

  renderRecentEntries();

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





      console.log(
        "Saved successfully"
      );





      form.reset();





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
      class="grid grid-cols-7 gap-4 font-bold border-b pb-3 mb-3">

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
              class="grid grid-cols-7 gap-4 border-b py-3">

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