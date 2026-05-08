const SETTINGS_KEY =
  "skybar.finance.dashboard.settings.v1";


// ======================
// DEFAULT SETTINGS
// ======================

const defaultSettings = {

  outletName:
    "SKYBAR",

  currency:
    "RM",

  annualRevenueTarget:
    3000000,

  annualGopTarget:
    900000,

  foodCostTarget:
    35,

  beverageCostTarget:
    25,

  fixedCostTarget:
    18,

  pinCode:
    "1298"

};


// ======================
// GET SETTINGS
// ======================

function getSettings() {

  const savedData =
    localStorage.getItem(
      SETTINGS_KEY
    );

  if(!savedData) {

    return defaultSettings;

  }

  return JSON.parse(
    savedData
  );

}


// ======================
// SAVE SETTINGS
// ======================

function saveSettings(
  settings
) {

  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(
      settings
    )
  );

}


// ======================
// LOAD TO FORM
// ======================

function loadSettingsForm() {

  const settings =
    getSettings();


  setField(
    "outletName",
    settings.outletName
  );

  setField(
    "currency",
    settings.currency
  );

  setField(
    "annualRevenueTarget",
    settings.annualRevenueTarget
  );

  setField(
    "annualGopTarget",
    settings.annualGopTarget
  );

  setField(
    "foodCostTarget",
    settings.foodCostTarget
  );

  setField(
    "beverageCostTarget",
    settings.beverageCostTarget
  );

  setField(
    "fixedCostTarget",
    settings.fixedCostTarget
  );

  setField(
    "pinCode",
    settings.pinCode
  );

}


// ======================
// HELPER
// ======================

function setField(
  fieldId,
  value
) {

  const field =
    document.getElementById(
      fieldId
    );

  if(!field) return;

  field.value =
    value;

}


// ======================
// FORM SUBMIT
// ======================

function handleSaveSettings(
  e
) {

  e.preventDefault();


  const settings = {

    outletName:
      document.getElementById(
        "outletName"
      ).value,


    currency:
      document.getElementById(
        "currency"
      ).value,


    annualRevenueTarget:
      Number(
        document.getElementById(
          "annualRevenueTarget"
        ).value || 0
      ),


    annualGopTarget:
      Number(
        document.getElementById(
          "annualGopTarget"
        ).value || 0
      ),


    foodCostTarget:
      Number(
        document.getElementById(
          "foodCostTarget"
        ).value || 0
      ),


    beverageCostTarget:
      Number(
        document.getElementById(
          "beverageCostTarget"
        ).value || 0
      ),


    fixedCostTarget:
      Number(
        document.getElementById(
          "fixedCostTarget"
        ).value || 0
      ),


    pinCode:
      document.getElementById(
        "pinCode"
      ).value

  };


  saveSettings(
    settings
  );


  alert(
    "Settings saved successfully"
  );

}


// ======================
// INIT
// ======================

function initSettings() {

  loadSettingsForm();


  const form =
    document.getElementById(
      "settingsForm"
    );

  if(form) {

    form.addEventListener(
      "submit",
      handleSaveSettings
    );

  }

}


// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initSettings
);
