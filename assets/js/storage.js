const ENTRY_STORAGE_KEY =
  "skybar_entries";



// ======================
// GET ALL ENTRIES
// ======================

function getAllEntries() {

  try {

    const raw =
      localStorage.getItem(
        ENTRY_STORAGE_KEY
      );


    if(
      !raw
    ) {

      return [];

    }


    const parsed =
      JSON.parse(
        raw
      );


    if(
      !Array.isArray(
        parsed
      )
    ) {

      return [];

    }


    return parsed;

  }

  catch(
    error
  ) {

    console.error(
      "Storage read error:",
      error
    );


    return [];

  }

}



// ======================
// SAVE ALL ENTRIES
// ======================

function saveAllEntries(
  entries
) {

  localStorage.setItem(
    ENTRY_STORAGE_KEY,
    JSON.stringify(
      entries
    )
  );

}



// ======================
// ADD ENTRY
// ======================

function addEntry(
  payload
) {

  const entries =
    getAllEntries();


  const newEntry =
    {

      id:
        Date.now(),


      date:
        payload.date || "",


      foodRevenue:
        Number(
          payload.foodRevenue || 0
        ),


      beverageRevenue:
        Number(
          payload.beverageRevenue || 0
        )

    };


  entries.push(
    newEntry
  );


  saveAllEntries(
    entries
  );


  return newEntry;

}



// ======================
// UPDATE ENTRY
// ======================

function updateEntry(
  entryId,
  payload
) {

  const entries =
    getAllEntries();


  const updated =
    entries.map(
      entry => {

        if(
          entry.id != entryId
        ) {

          return entry;

        }


        return {

          ...entry,


          date:
            payload.date,


          foodRevenue:
            Number(
              payload.foodRevenue || 0
            ),


          beverageRevenue:
            Number(
              payload.beverageRevenue || 0
            )

        };

      }
    );


  saveAllEntries(
    updated
  );

}



// ======================
// DELETE ENTRY
// ======================

function deleteEntry(
  entryId
) {

  const entries =
    getAllEntries();


  const filtered =
    entries.filter(
      entry =>

        entry.id !=
        entryId
    );


  saveAllEntries(
    filtered
  );

}



// ======================
// GET SINGLE ENTRY
// ======================

function getEntryById(
  entryId
) {

  const entries =
    getAllEntries();


  return entries.find(
    entry =>

      entry.id ==
      entryId
  );

}



// ======================
// CLEAR
// ======================

function clearAllEntries() {

  localStorage.removeItem(
    ENTRY_STORAGE_KEY
  );

}
