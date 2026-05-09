const SETTINGS_STORAGE_KEY = "skybar_settings";

const defaultSettings = {
  outletName: "SKYBAR",
  currency: "RM",
  annualRevenueTarget: 0,
  monthlyBudget: 0,
  foodCostPercent: 35,
  beverageCostPercent: 25,
  fixCostPercent: 18,
  lyFoodRevenue: 0,
  lyBeverageRevenue: 0
};

function getSettings() {
  try {
    const raw = localStorage.getItem(
      SETTINGS_STORAGE_KEY
    );

    if (!raw) {
      return {
        ...defaultSettings
      };
    }

    const parsed = JSON.parse(raw);

    return {
      ...defaultSettings,
      ...parsed
    };

  } catch (error) {

    console.error(error);

    return {
      ...defaultSettings
    };

  }
}

function saveSettings(settings) {

  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(settings)
  );

}

function loadSettingsForm() {

  const settings =
    getSettings();

  setValue(
    "outletName",
    settings.outletName
  );

  setValue(
    "currency",
    settings.currency
  );

  setValue(
    "annualRevenueTarget",
    settings.annualRevenueTarget
  );

  setValue(
    "monthlyBudget",
    settings.monthlyBudget
  );

  setValue(
    "foodCostPercent",
    settings.foodCostPercent
  );

  setValue(
    "beverageCostPercent",
    settings.beverageCostPercent
  );

  setValue(
    "fixCostPercent",
    settings.fixCostPercent
  );

  setValue(
    "lyFoodRevenue",
    settings.lyFoodRevenue
  );

  setValue(
    "lyBeverageRevenue",
    settings.lyBeverageRevenue
  );

}

function bindSettingsForm() {

  const form =
    document.getElementById(
      "settingsForm"
    );

  if (!form) return;

  form.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();

      const payload = {

        outletName:
          getValue("outletName"),

        currency:
          getValue("currency"),

        annualRevenueTarget:
          Number(
            getValue(
              "annualRevenueTarget"
            )
          ),

        monthlyBudget:
          Number(
            getValue(
              "monthlyBudget"
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

        fixCostPercent:
          Number(
            getValue(
              "fixCostPercent"
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
          )

      };

      saveSettings(
        payload
      );

      alert(
        "Settings saved."
      );

    }
  );
}

function exportBackup() {

  const backup = {

    settings:
      getSettings(),

    entries:
      getAllEntries()

  };

  const blob =
    new Blob(
      [
        JSON.stringify(
          backup,
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

  a.href = url;

  a.download =
    "skybar-backup.json";

  a.click();

}

function importBackup(file) {

  const reader =
    new FileReader();

  reader.onload =
    function(event) {

      const data =
        JSON.parse(
          event.target.result
        );

      if (data.settings) {

        saveSettings(
          data.settings
        );

      }

      if (data.entries) {

        localStorage.setItem(
          "skybar_entries",
          JSON.stringify(
            data.entries
          )
        );

      }

      alert(
        "Backup restored."
      );

      location.reload();

    };

  reader.readAsText(file);

}

function resetAllData() {

  localStorage.clear();

  alert(
    "All data deleted."
  );

  location.reload();

}

function bindButtons() {

  const exportBtn =
    document.getElementById(
      "exportBackupBtn"
    );

  const importBtn =
    document.getElementById(
      "importBackupBtn"
    );

  const importFile =
    document.getElementById(
      "importBackupFile"
    );

  const resetBtn =
    document.getElementById(
      "resetDataBtn"
    );

  if (exportBtn) {
    exportBtn.onclick =
      exportBackup;
  }

  if (importBtn) {

    importBtn.onclick =
      function() {

        importFile.click();

      };

  }

  if (importFile) {

    importFile.onchange =
      function() {

        if (
          this.files.length
        ) {

          importBackup(
            this.files[0]
          );

        }

      };

  }

  if (resetBtn) {

    resetBtn.onclick =
      resetAllData;

  }

}

function setValue(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );

  if (el) {

    el.value =
      value;

  }

}

function getValue(id) {

  const el =
    document.getElementById(
      id
    );

  if (!el) return "";

  return el.value;

}

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadSettingsForm();

    bindSettingsForm();

    bindButtons();

  }
);
