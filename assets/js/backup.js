const ENTRY_STORAGE_KEY =
  "skybar_entries";

const SETTINGS_STORAGE_KEY =
  "skybar_settings";



// ======================
// DEFAULT SETTINGS
// ======================

const BACKUP_DEFAULT_SETTINGS = {

  outletName:
    "SKYBAR",


  currency:
    "RM",


  annualRevenueTarget:
    0,


  annualGopTarget:
    0,


  monthlyBudget:
    0,


  foodCostPercent:
    35,


  beverageCostPercent:
    25,


  fixCostPercent:
    18,


  lyFoodRevenue:
    0,


  lyBeverageRevenue:
    0

};



// ======================
// SETTINGS MIGRATION
// ======================

function migrateSettingsSchema() {

  try {

    const raw =
      localStorage.getItem(
        SETTINGS_STORAGE_KEY
      );


    if(
      !raw
    ) {

      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(
          BACKUP_DEFAULT_SETTINGS
        )
      );

      return;

    }


    const oldSettings =
      JSON.parse(
        raw
      );


    const repaired =
      {

        ...BACKUP_DEFAULT_SETTINGS,

        ...oldSettings

      };


    // LEGACY KEY FIX
    if(
      oldSettings.foodLyRevenue !==
      undefined
    ) {

      repaired.lyFoodRevenue =
        Number(
          oldSettings.foodLyRevenue || 0
        );

    }


    if(
      oldSettings.beverageLyRevenue !==
      undefined
    ) {

      repaired.lyBeverageRevenue =
        Number(
          oldSettings.beverageLyRevenue || 0
        );

    }


    if(
      oldSettings.fixedCostPercent !==
      undefined
    ) {

      repaired.fixCostPercent =
        Number(
          oldSettings.fixedCostPercent || 0
        );

    }


    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(
        repaired
      )
    );

  }

  catch(
    error
  ) {

    console.error(
      "Migration error:",
      error
    );


    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(
        BACKUP_DEFAULT_SETTINGS
      )
    );

  }

}



// ======================
// EXPORT
// ======================

function exportBackup() {

  migrateSettingsSchema();


  const entries =
    JSON.parse(
      localStorage.getItem(
        ENTRY_STORAGE_KEY
      ) || "[]"
    );


  const settings =
    JSON.parse(
      localStorage.getItem(
        SETTINGS_STORAGE_KEY
      ) || "{}"
    );


  const payload =
    {

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
// IMPORT
// ======================

function handleBackupUpload(
  input
) {

  const file =
    input.files[0];


  if(
    !file
  ) return;


  const reader =
    new FileReader();


  reader.onload =
    function(
      e
    ) {

      try {

        const data =
          JSON.parse(
            e.target.result
          );


        localStorage.setItem(
          ENTRY_STORAGE_KEY,
          JSON.stringify(
            data.entries || []
          )
        );


        const repairedSettings =
          {

            ...BACKUP_DEFAULT_SETTINGS,

            ...(data.settings || {})

          };


        localStorage.setItem(
          SETTINGS_STORAGE_KEY,
          JSON.stringify(
            repairedSettings
          )
        );


        alert(
          "Backup restored successfully."
        );


        location.reload();

      }

      catch(
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
// RESET
// ======================

function resetAllData() {

  const confirmReset =
    confirm(
      "Reset all finance data?"
    );


  if(
    !confirmReset
  ) return;


  localStorage.removeItem(
    ENTRY_STORAGE_KEY
  );


  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(
      BACKUP_DEFAULT_SETTINGS
    )
  );


  alert(
    "System reset completed."
  );


  location.reload();

}



// ======================
// AUTO FIX ON LOAD
// ======================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    migrateSettingsSchema();

  }
);
