const DAILY_KEY =
  "skybar_daily_entries";



const MONTHLY_KEY =
  "skybar_monthly_targets";



const ANNUAL_KEY =
  "skybar_annual_targets";









// ======================
// DAILY ENTRIES
// ======================

function getDailyEntries() {

  const raw =
    localStorage.getItem(
      DAILY_KEY
    );



  return raw

    ? JSON.parse(
        raw
      )

    : [];

}





function saveDailyEntries(
  entries
) {

  localStorage.setItem(

    DAILY_KEY,

    JSON.stringify(
      entries
    )

  );

}





function addDailyEntry(
  payload
) {

  const entries =
    getDailyEntries();



  entries.push({

    id:
      Date.now(),



    ...payload

  });



  saveDailyEntries(
    entries
  );

}





function updateDailyEntry(
  entryId,
  payload
) {

  const entries =
    getDailyEntries()

      .map(
        item => {

          if (
            item.id ==
            entryId
          ) {

            return {

              ...item,

              ...payload

            };

          }



          return item;

        }
      );



  saveDailyEntries(
    entries
  );

}





function deleteDailyEntry(
  entryId
) {

  const entries =
    getDailyEntries()

      .filter(
        item =>

          item.id !=
          entryId
      );



  saveDailyEntries(
    entries
  );

}










// ======================
// MONTHLY TARGETS
// ======================

function getMonthlyTargets() {

  const raw =
    localStorage.getItem(
      MONTHLY_KEY
    );



  return raw

    ? JSON.parse(
        raw
      )

    : [];

}





function saveMonthlyTargets(
  targets
) {

  localStorage.setItem(

    MONTHLY_KEY,

    JSON.stringify(
      targets
    )

  );

}





function saveMonthlyTarget(
  payload
) {

  const targets =
    getMonthlyTargets();



  const existing =
    targets.find(
      item => {

        return (

          item.outlet ===
            payload.outlet &&

          item.year ===
            payload.year &&

          item.month ===
            payload.month

        );

      }
    );



  if (
    existing
  ) {

    Object.assign(

      existing,

      payload

    );

  }

  else {

    targets.push(
      payload
    );

  }



  saveMonthlyTargets(
    targets
  );

}










// ======================
// ANNUAL TARGETS
// ======================

function getAnnualTargets() {

  const raw =
    localStorage.getItem(
      ANNUAL_KEY
    );



  return raw

    ? JSON.parse(
        raw
      )

    : [];

}





function saveAnnualTargets(
  targets
) {

  localStorage.setItem(

    ANNUAL_KEY,

    JSON.stringify(
      targets
    )

  );

}





function saveAnnualTarget(
  payload
) {

  const targets =
    getAnnualTargets();



  const existing =
    targets.find(
      item => {

        return (

          item.outlet ===
            payload.outlet &&

          item.year ===
            payload.year

        );

      }
    );



  if (
    existing
  ) {

    Object.assign(

      existing,

      payload

    );

  }

  else {

    targets.push(
      payload
    );

  }



  saveAnnualTargets(
    targets
  );

}
