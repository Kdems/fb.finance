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
          <td colspan="6" class="py-4 text-center text-slate-400">
            No entries yet
          </td>
        </tr>
      `;

    return;

  }


  const sortedEntries =
    [...entries].reverse();


  sortedEntries.forEach(
    (
      entry,
      index
    ) => {

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
          <td class="py-3">
            ${entry.date}
          </td>

          <td>
            ${formatMoney(calc.totalRevenue)}
          </td>

          <td>
            ${formatMoney(calc.totalCost)}
          </td>

          <td>
            ${formatMoney(calc.gop)}
          </td>

          <td>
            <button
              onclick="editEntry(${index})"
              class="text-blue-600 font-semibold"
            >
              Edit
            </button>
          </td>

          <td>
            <button
              onclick="removeEntryByIndex(${index})"
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



function removeEntryByIndex(
  index
) {

  const entries =
    getEntries();


  const actualIndex =
    entries.length - 1 - index;


  entries.splice(
    actualIndex,
    1
  );


  localStorage.setItem(
    "skybar.finance.entries.v1",
    JSON.stringify(
      entries
    )
  );


  renderRecentEntries();


  if(
    typeof renderDashboard ===
    "function"
  ) {

    renderDashboard();

  }

}



function editEntry(
  index
) {

  const entries =
    getEntries();


  const actualIndex =
    entries.length - 1 - index;


  const entry =
    entries[
      actualIndex
    ];


  editingEntryId =
    actualIndex;


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
