let editingEntryIndex =
  null;



// ======================
// INIT
// ======================

function initEntryPage() {

  bindEntryForm();

  renderRecentEntries();

  setDefaultDate();

  updateDailyBudget();

}



// ======================
// DEFAULT DATE
// ======================

function setDefaultDate() {

  const dateField =
    document.getElementById(
      "entryDate"
    );


  if(
    !dateField
  ) return;


  if(
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
// FORM
// ======================

function bindEntryForm() {

  const form =
    document.getElementById(
      "entryForm"
    );


  if(
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


  if(
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


  const data = {

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
      )

  };


  if(
    editingEntryIndex !==
    null
  ) {

    updateEntry(
      editingEntryIndex,
      data
    );


    editingEntryIndex =
      null;

  }

  else {

    addEntry(
      data
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
// TABLE
// ======================

function renderRecentEntries() {

  const tbody =
    document.getElementById(
      "recentEntriesBody"
    );


  if(
    !tbody
  ) return;


  const entries =
    getEntries();


  tbody.innerHTML =
    "";


  if(
    entries.length === 0
  ) {

    tbody.innerHTML =
      `
      <tr>
        <td colspan="8" class="py-4 text-center text-slate-400">
          No entries yet
        </td>
      </tr>
      `;

    return;

  }


  const reversed =
    [...entries].reverse();


  reversed.forEach(
    (
      entry,
      reverseIndex
    ) => {

      const realIndex =
        entries.length -
        1 -
        reverseIndex;


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
        <td class="py-3">${entry.date}</td>

        <td>${formatMoney(entry.foodRevenue)}</td>

        <td>${formatMoney(entry.beverageRevenue)}</td>

        <td>${formatMoney(calc.totalRevenue)}</td>

        <td>${formatMoney(calc.totalCost)}</td>

        <td>${formatMoney(calc.gop)}</td>

        <td>
          <button
            onclick="editEntry(${realIndex})"
            class="font-semibold"
          >
            Edit
          </button>
        </td>

        <td>
          <button
            onclick="deleteEntry(${realIndex})"
            class="font-semibold"
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
  index
) {

  const entries =
    getEntries();


  const entry =
    entries[
      index
    ];


  editingEntryIndex =
    index;


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

function deleteEntry(
  index
) {

  const entries =
    getEntries();


  entries.splice(
    index,
    1
  );


  localStorage.setItem(
    "skybar.finance.entries.v1",
    JSON.stringify(
      entries
    )
  );


  renderRecentEntries();

}



// ======================
// DAILY BUDGET
// ======================

function updateDailyBudget() {

  const display =
    document.getElementById(
      "dailyBudgetDisplay"
    );


  const dateField =
    document.getElementById(
      "entryDate"
    );


  if(
    !display ||
    !dateField ||
    !dateField.value
  ) return;


  const settings =
    getSettings();


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


  const budget =
    Number(
      settings.monthlyBudget || 0
    ) / daysInMonth;


  display.value =
    formatMoney(
      budget
    );

}



// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initEntryPage
);
