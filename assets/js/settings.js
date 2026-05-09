const SETTINGS_STORAGE_KEY =
  "skybar_settings";



// ======================
// DEFAULT SETTINGS
// ======================

const DEFAULT_SETTINGS = {

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


  // COST %
  foodCostPercent:
    35,


  beverageCostPercent:
    25,


  fixCostPercent:
    18,


  // LY BASELINE
  lyFoodRevenue:
    0,


  lyBeverageRevenue:
    0

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


    if(
      !raw
    ) {

      return {
        ...DEFAULT_SETTINGS
      };

    }


    const saved =
      JSON.parse(
        raw
      );


    return {

      ...DEFAULT_SETTINGS,

      ...saved

    };

  }

  catch(
    error
  ) {

    console.error(
      "Settings load error:",
      error
    );


    return {
      ...DEFAULT_SETTINGS
    };

  }

}



// ======================
// SAVE SETTINGS
// ======================

function saveSettings(
  payload
) {

  const current =
    getSettings();


  const merged =
    {

      ...current,

      ...payload

    };


  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(
      merged
    )
  );


  return merged;

}



// ======================
// UI LOAD
// ======================

function loadSettingsPage() {

  const form =
    document.getElementById(
      "settingsForm"
    );


  if(
    !form
  ) return;


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
    "monthlyBudget",
    settings.monthlyBudget
  );


  // COST %
  setField(
    "foodCostPercent",
    settings.foodCostPercent
  );

  setField(
    "beverageCostPercent",
    settings.beverageCostPercent
  );

  setField(
    "fixCostPercent",
    settings.fixCostPercent
  );


  // LY
  setField(
    "lyFoodRevenue",
    settings.lyFoodRevenue
  );

  setField(
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
          getField(
            "outletName"
          ),


        currency:
          getField(
            "currency"
          ),


        annualRevenueTarget:
          Number(
            getField(
              "annualRevenueTarget"
            ) || 0
          ),


        annualGopTarget:
          Number(
            getField(
              "annualGopTarget"
            ) || 0
          ),


        monthlyBudget:
          Number(
            getField(
              "monthlyBudget"
            ) || 0
          ),


        // COST %
        foodCostPercent:
          Number(
            getField(
              "foodCostPercent"
            ) || 0
          ),


        beverageCostPercent:
          Number(
            getField(
              "beverageCostPercent"
            ) || 0
          ),


        fixCostPercent:
          Number(
            getField(
              "fixCostPercent"
            ) || 0
          ),


        // LY
        lyFoodRevenue:
          Number(
            getField(
              "lyFoodRevenue"
            ) || 0
          ),


        lyBeverageRevenue:
          Number(
            getField(
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

function setField(
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


function getField(
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
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadSettingsPage();

    bindSettingsForm();

  }
);
