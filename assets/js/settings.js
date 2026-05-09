const SETTINGS_KEY =
  "skybar.finance.settings.v1";



// ======================
// DEFAULT SETTINGS
// ======================

const DEFAULT_SETTINGS = {

  outletName:
    "SKYBAR",


  currency:
    "RM",


  annualRevenueTarget:
    7472762,


  annualGopTarget:
    900000,


  monthlyBudget:
    575649,


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
// GET SETTINGS
// ======================

function getSettings() {

  const saved =
    localStorage.getItem(
      SETTINGS_KEY
    );


  if(
    !saved
  ) {

    return DEFAULT_SETTINGS;

  }


  try {

    const parsed =
      JSON.parse(
        saved
      );


    return {

      ...DEFAULT_SETTINGS,

      ...parsed

    };

  }

  catch(
    error
  ) {

    console.error(
      "Settings load error:",
      error
    );


    return DEFAULT_SETTINGS;

  }

}



// ======================
// SAVE SETTINGS
// ======================

function saveSettings(
  newSettings
) {

  const merged =
    {

      ...getSettings(),

      ...newSettings

    };


  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(
      merged
    )
  );


  return merged;

}



// ======================
// FORM INIT
// ======================

function loadSettingsForm() {

  const form =
    document.getElementById(
      "settingsForm"
    );


  if(
    !form
  ) return;


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
    "annualGopTarget",
    settings.annualGopTarget
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



// ======================
// FORM SAVE
// ======================

function bindSettingsForm() {

  const form =
    document.getElementById(
      "settingsForm"
    );


  if(
    !form
  ) return;


  form.addEventListener(
    "submit",
    function(
      e
    ) {

      e.preventDefault();


      saveSettings({

        outletName:
          getValue(
            "outletName"
          ),


        currency:
          getValue(
            "currency"
          ),


        annualRevenueTarget:
          Number(
            getValue(
              "annualRevenueTarget"
            ) || 0
          ),


        annualGopTarget:
          Number(
            getValue(
              "annualGopTarget"
            ) || 0
          ),


        monthlyBudget:
          Number(
            getValue(
              "monthlyBudget"
            ) || 0
          ),


        foodCostPercent:
          Number(
            getValue(
              "foodCostPercent"
            ) || 0
          ),


        beverageCostPercent:
          Number(
            getValue(
              "beverageCostPercent"
            ) || 0
          ),


        fixCostPercent:
          Number(
            getValue(
              "fixCostPercent"
            ) || 0
          ),


        lyFoodRevenue:
          Number(
            getValue(
              "lyFoodRevenue"
            ) || 0
          ),


        lyBeverageRevenue:
          Number(
            getValue(
              "lyBeverageRevenue"
            ) || 0
          )

      });


      alert(
        "Settings saved successfully."
      );

    }
  );

}



// ======================
// HELPERS
// ======================

function setValue(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );


  if(
    !el
  ) return;


  el.value =
    value;

}


function getValue(
  id
) {

  const el =
    document.getElementById(
      id
    );


  if(
    !el
  ) return "";


  return el.value;

}



// ======================
// INIT
// ======================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadSettingsForm();

    bindSettingsForm();

  }
);
