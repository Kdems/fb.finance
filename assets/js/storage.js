const STORAGE_KEY =
  "skybar.finance.entries.v1";


// ======================
// GET ALL ENTRIES
// ======================

function getEntries() {

  const savedData =
    localStorage.getItem(
      STORAGE_KEY
    );


  if(
    !savedData
  ) {

    return [];

  }


  return JSON.parse(
    savedData
  );

}


// ======================
// SAVE ALL ENTRIES
// ======================

function saveEntries(
  entries
) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      entries
    )
  );

}


// ======================
// ADD ENTRY
// ======================

function addEntry(
  entry
) {

  const entries =
    getEntries();


  const newEntry = {

    ...entry,

    id:
      Date.now().toString()

  };


  entries.push(
    newEntry
  );


  saveEntries(
    entries
  );


  return newEntry;

}


// ======================
// GET SINGLE ENTRY
// ======================

function getEntryById(
  entryId
) {

  const entries =
    getEntries();


  return entries.find(
    entry =>
      entry.id ===
      entryId
  );

}


// ======================
// UPDATE ENTRY
// ======================

function updateEntry(
  entryId,
  updatedData
) {

  const entries =
    getEntries();


  const updatedEntries =
    entries.map(
      entry => {

        if(
          entry.id ===
          entryId
        ) {

          return {

            ...entry,

            ...updatedData

          };

        }


        return entry;

      }
    );


  saveEntries(
    updatedEntries
  );

}


// ======================
// DELETE ENTRY
// ======================

function deleteEntry(
  entryId
) {

  const entries =
    getEntries();


  const filteredEntries =
    entries.filter(
      entry =>
        entry.id !==
        entryId
    );


  saveEntries(
    filteredEntries
  );

}


// ======================
// FILTER ENTRIES
// ======================

function filterEntries(
  year,
  month
) {

  const entries =
    getEntries();


  return entries.filter(
    entry => {

      if(
        !entry.date
      ) {

        return false;

      }


      const date =
        new Date(
          entry.date
        );


      const entryYear =
        date.getFullYear();


      const entryMonth =
        date.getMonth() + 1;


      return (
        entryYear ===
          year &&
        entryMonth ===
          month
      );

    }
  );

}


// ======================
// RESET ALL DATA
// ======================

function clearAllData() {

  localStorage.removeItem(
    STORAGE_KEY
  );


  location.reload();

}
