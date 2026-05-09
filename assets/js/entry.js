let editingEntryId =
  null;



// ======================
// INIT
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initEntryPage
);



function initEntryPage() {

  bindEntryForm();

  setDefaultDate();

  updateDailyBudget();

  renderRecentEntries();

}



// ======================
// DEFAULT DATE
// ======================

function setDefaultDate() {

  const dateField =
    document.getElementById(
      "entryDate"
    );


  if (
    !dateField
  ) return;


  if (
    !dateField.value
  ) {

    const today =
      new Date();


    dateField.value =

      today
        .toISOString()
        .split(
          "T"
        )[0];

  }

}



// ======================
// BIND FORM
// ======================

function bindEntryForm() {

  const form =
    document.getElementById(
      "entryForm"
    );


  if (
    !form
  ) return;


  form.addEventListener(
    "submit",
    handleSaveEntry
  );



  const dateField =
    document.getElementById(
      "entryDate"
    );


  if (
    dateField
  ) {

    dateField.addEventListener(
      "change",
      updateDailyBudget
    );

  }

}



// ======================
// SAVE
// ======================

function handleSaveEntry(
  e
) {

  e.preventDefault();



  const settings =
    getSettings();



  const payload = {

    date:
      document.getElementById(
        "entryDate"
      ).value,



    foodRevenue:
      Number(
        document.getElementById(
          "foodRevenue"
        ).value || 0
      ),



    beverageRevenue:
      Number(
        document.getElementById(
          "beverageRevenue"
        ).value || 0
      ),



    foodCostPercent:
      settings.foodCostPercent,



    beverageCostPercent:
      settings.beverageCostPercent,



    fixedCostPercent:
      settings.fixedCostPercent,



    dailyBudget:
      getDailyBudget()

  };



  if (
    editingEntryId !==
    null
  ) {

    updateEntry(
      editingEntryId,
      payload
    );


    editingEntryId =
      null;

  }

  else {

    addEntry(
      payload
    );

  }



  document.getElementById(
    "entryForm"
  ).reset();



  setDefaultDate();

  updateDailyBudget();

  renderRecentEntries();

}



// ======================
// DAILY BUDGET
// ======================

function getDailyBudget() {

  const settings =
    getSettings();


  const dateField =
    document.getElementById(
      "entryDate"
    );


  if (
    !dateField ||
    !dateField.value
  ) {

    return 0;

  }



  const date =
    new Date(
      dateField.value
    );



  const daysInMonth =

    new Date(

      date.getFullYear(),

      date.getMonth() + 1,

      0

    ).getDate();



  return (

    Number(
      settings.monthlyBudget || 0
    )

    /

    daysInMonth

  );

}



function updateDailyBudget() {

  const field =
    document.getElementById(
      "dailyBudgetDisplay"
    );


  if (
    !field
  ) return;



  field.value =

    formatMoney(
      getDailyBudget()
    );

}



// ======================
// TABLE
// ======================

function renderRecentEntries() {

  const tbody =
    document.getElementById(
      "recentEntriesBody"
    );


  if (
    !tbody
  ) return;



  const entries =
    getAllEntries();



  tbody.innerHTML =
    "";



  if (
    entries.length === 0
  ) {

    tbody.innerHTML =

      `
      <tr>
        <td colspan="8" class="py-6 text-center text-slate-400">
          No entries found
        </td>
      </tr>
      `;

    return;

  }



  const reversed =
    [...entries].reverse();



  reversed.forEach(
    entry => {

      const calc =
        calculateEntryMetrics(
          entry
        );



      const row =
        document.createElement(
          "tr"
        );



      row.className =
        "border-b";



      row.innerHTML =

        `
        <td class="py-4">
          ${entry.date}
        </td>

        <td>
          ${formatMoney(
            entry.foodRevenue
          )}
        </td>

        <td>
          ${formatMoney(
            entry.beverageRevenue
          )}
        </td>

        <td>
          ${formatMoney(
            calc.totalRevenue
          )}
        </td>

        <td>
          ${formatMoney(
            calc.totalCost
          )}
        </td>

        <td>
          ${formatMoney(
            calc.gop
          )}
        </td>

        <td>
          <button
            onclick="editEntry(${entry.id})"
            class="font-semibold"
          >
            Edit
          </button>
        </td>

        <td>
          <button
            onclick="removeEntry(${entry.id})"
            class="text-red-600 font-semibold"
          >
            Delete
          </button>
        </td>
        `;



      tbody.appendChild(
        row
      );

    }
  );

}



// ======================
// EDIT
// ======================

function editEntry(
  entryId
) {

  const entry =
    getEntryById(
      entryId
    );


  if (
    !entry
  ) return;



  editingEntryId =
    entryId;



  document.getElementById(
    "entryDate"
  ).value =
    entry.date;



  document.getElementById(
    "foodRevenue"
  ).value =
    entry.foodRevenue;



  document.getElementById(
    "beverageRevenue"
  ).value =
    entry.beverageRevenue;

}



// ======================
// DELETE
// ======================

function removeEntry(
  entryId
) {

  const confirmed =
    confirm(
      "Delete this entry?"
    );


  if (
    !confirmed
  ) return;



  deleteEntry(
    entryId
  );



  renderRecentEntries();

}
