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


  // Annual Targets
  annualRevenueTarget:
    3000000,

  annualGopTarget:
    900000,


  // Monthly Finance
  monthlyFoodCost:
    0,

  monthlyBeverageCost:
    0,

  monthlyFixedCost:
    0,

  monthlyBudget:
    0,


  // Security
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


  if(
    !savedData
  ) {

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
// SET FIELD
// ======================

function setField(
  fieldId,
  value
) {

  const field =
    document.getElementById(
      fieldId
    );


  if(
    !field
  ) return;


  field.value =
    value;

}


// ======================
// LOAD FORM
// ======================

function loadSettingsForm() {

  const settings =
    getSettings();


  // PROFILE
  setField(
    "outletName",
    settings.outletName
  );


  setField(
    "currency",
    settings.currency
  );


  // ANNUAL TARGET
  setField(
    "annualRevenueTarget",
    settings.annualRevenueTarget
  );


  setField(
    "annualGopTarget",
    settings.annualGopTarget
  );


  // MONTHLY FINANCE
  setField(
    "monthlyFoodCost",
    settings.monthlyFoodCost
  );


  setField(
    "monthlyBeverageCost",
    settings.monthlyBeverageCost
  );


  setField(
    "monthlyFixedCost",
    settings.monthlyFixedCost
  );


  setField(
    "monthlyBudget",
    settings.monthlyBudget
  );


  // SECURITY
  setField(
    "pinCode",
    settings.pinCode
  );

}


// ======================
// SAVE FORM
// ======================

function handleSaveSettings(
  e
) {

  e.preventDefault();


  const settings = {

    // PROFILE
    outletName:
      document.getElementById(
        "outletName"
      ).value,


    currency:
      document.getElementById(
        "currency"
      ).value,


    // ANNUAL TARGET
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


    // MONTHLY FINANCE
    monthlyFoodCost:
      Number(
        document.getElementById(
          "monthlyFoodCost"
        ).value || 0
      ),


    monthlyBeverageCost:
      Number(
        document.getElementById(
          "monthlyBeverageCost"
        ).value || 0
      ),


    monthlyFixedCost:
      Number(
        document.getElementById(
          "monthlyFixedCost"
        ).value || 0
      ),


    monthlyBudget:
      Number(
        document.getElementById(
          "monthlyBudget"
        ).value || 0
      ),


    // SECURITY
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


  if(
    form
  ) {

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
