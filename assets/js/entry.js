document.addEventListener(
  "DOMContentLoaded",
  initEntryPage
);





function initEntryPage() {

  buildDropdowns();

  bindDailyForm();

  bindMonthlyForm();

  bindAnnualForm();

  renderRecentEntries();

}

function bindDailyForm() {

  const form =
    document.getElementById(
      "dailyForm"
    );



  form.addEventListener(
    "submit",

    function(
      event
    ) {

      event.preventDefault();



      addDailyEntry({

        outlet:
          getValue(
            "dailyOutlet"
          ),



        date:
          getValue(
            "dailyDate"
          ),



        foodRevenue:
          Number(
            getValue(
              "dailyFoodRevenue"
            )
          ),



        beverageRevenue:
          Number(
            getValue(
              "dailyBeverageRevenue"
            )
          )

      });



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

  const entries =
    getDailyEntries();



  const container =
    document.getElementById(
      "recentEntryList"
    );



  container.innerHTML =

    entries
      .slice()
      .reverse()
      .map(
        item => {

          const total =

            Number(
              item.foodRevenue
            )

            +

            Number(
              item.beverageRevenue
            );



          return `

            <div
              class="grid grid-cols-6 border-b py-3 gap-3">

              <div>
                ${item.date}
              </div>



              <div>
                ${item.outlet}
              </div>



              <div>
                ${total}
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



  buildMonthDropdown(
    "monthlyMonth"
  );

}







function buildYearDropdown(
  id
) {

  const select =
    document.getElementById(
      id
    );



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







function buildMonthDropdown(
  id
) {

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
    document.getElementById(
      id
    );



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