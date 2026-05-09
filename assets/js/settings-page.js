//
// SKYBAR SETTINGS PAGE ENGINE
// FULL MASTER VERSION
//



// ======================
// CLEAR DAILY ENTRIES
// ======================

function clearEntriesOnly() {

  const confirmed =

    confirm(
      "Delete all daily entries?"
    );



  if (
    !confirmed
  ) {

    return;

  }



  clearAllEntries();



  alert(
    "Daily entries deleted successfully."
  );



  location.reload();

}



// ======================
// RESET ENTIRE SYSTEM
// ======================

function resetAllData() {

  const confirmed =

    confirm(
      "Reset entire finance system?"
    );



  if (
    !confirmed
  ) {

    return;

  }



  clearAllEntries();



  resetSettings();



  localStorage.removeItem(

    "skybar.finance.dashboard.review.notes.v1"

  );



  alert(
    "System reset completed."
  );



  location.reload();

}



// ======================
// PAGE INIT
// ======================

document.addEventListener(

  "DOMContentLoaded",

  initSettingsPage

);



function initSettingsPage() {

  console.log(
    "Settings page loaded."
  );

}
