const SETTINGS_STORAGE_KEY =
  "skybar.finance.dashboard.settings.v1";



// ======================
// DEFAULT SETTINGS
// ======================

const DEFAULT_SETTINGS = {

  outletName:
    "SKYBAR",


  currency:
    "RM",


  annualRevenueTarget:
    3000000,


  annualGopTarget:
    900000,


  monthlyBudget:
    575649,


  foodCostPercent:
    35,


  beverageCostPercent:
    25,


  fixedCostPercent:
    18

};



// ======================
// GET SETTINGS
// ======================

function getSettings() {

  try {

    const raw =
      localStorage.getItem(
        SETTINGS_STORAGE_KEY
      );


    if (
      !raw
    ) {

      saveSettings(
        DEFAULT_SETTINGS
      );

      return DEFAULT_SETTINGS;

    }


    const parsed =
      JSON.parse(
        raw
      );


    return {

      ...DEFAULT_SETTINGS,

      ...parsed

    };

  }

  catch (
    error
  ) {

    console.error(
      "Settings error:",
      error
    );


    return DEFAULT_SETTINGS;

  }

}



// ======================
// SAVE SETTINGS
// ======================

function saveSettings(
  payload
) {

  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(
      payload
    )
  );

}



// ======================
// RESET SETTINGS
// ======================

function resetSettings() {

  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(
      DEFAULT_SETTINGS
    )
  );

}



// ======================
// EXPORT BACKUP
// ======================

function exportBackup() {

  const entries =
    getAllEntries();


  const settings =
    getSettings();


  const payload = {

    version:
      "2.0",


    exportedAt:
      new Date().toISOString(),


    entries:
      entries,


    settings:
      settings

  };


  const blob =
    new Blob(
      [
        JSON.stringify(
          payload,
          null,
          2
        )
      ],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const a =
    document.createElement(
      "a"
    );


  a.href =
    url;


  a.download =
    `skybar-backup-${Date.now()}.json`;


  a.click();


  URL.revokeObjectURL(
    url
  );

}



// ======================
// IMPORT BACKUP
// ======================

function importBackup(
  input
) {

  const file =
    input.files[0];


  if (
    !file
  ) return;


  const reader =
    new FileReader();


  reader.onload =
    function (
      e
    ) {

      try {

        const data =
          JSON.parse(
            e.target.result
          );


        saveAllEntries(
          data.entries || []
        );


        saveSettings(
          {

            ...DEFAULT_SETTINGS,

            ...(data.settings || {})

          }
        );


        alert(
          "Backup restored successfully."
        );


        location.reload();

      }

      catch (
        error
      ) {

        alert(
          "Invalid backup file."
        );

      }

    };


  reader.readAsText(
    file
  );

}



// ======================
// RESET SYSTEM
// ======================

function resetAllData() {

  const confirmReset =
    confirm(
      "Reset all finance data?"
    );


  if (
    !confirmReset
  ) return;


  clearAllEntries();

  resetSettings();


  alert(
    "System reset completed."
  );


  location.reload();

}
