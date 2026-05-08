const BACKUP_FILENAME =
  "skybar-finance-backup.json";


// ======================
// EXPORT BACKUP
// ======================

function exportBackup() {

  const entries =
    getEntries();

  const backupData = {

    app: "SKYBAR",

    version: "1.0.0",

    exportDate:
      new Date().toISOString(),

    totalEntries:
      entries.length,

    data:
      entries

  };

  const jsonString =
    JSON.stringify(
      backupData,
      null,
      2
    );

  const blob =
    new Blob(
      [jsonString],
      {
        type:
          "application/json"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    BACKUP_FILENAME;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(
    url
  );

}


// ======================
// IMPORT BACKUP
// ======================

function importBackup(
  event
) {

  const file =
    event.target.files[0];

  if(!file) return;

  const reader =
    new FileReader();

  reader.onload =
    function(e) {

      try {

        const importedData =
          JSON.parse(
            e.target.result
          );

        if(
          !importedData.data
        ) {

          alert(
            "Invalid backup file"
          );

          return;

        }

        saveEntries(
          importedData.data
        );

        alert(
          "Backup restored successfully"
        );

        if(
          typeof renderDashboard ===
          "function"
        ) {

          renderDashboard();

        }

        if(
          typeof renderReports ===
          "function"
        ) {

          renderReports();

        }

      }

      catch(error) {

        alert(
          "Backup file corrupted"
        );

      }

    };

  reader.readAsText(
    file
  );

}


// ======================
// RESET ALL DATA
// ======================

function clearAllData() {

  const confirmDelete =
    confirm(
      "Delete all SKYBAR finance data?"
    );

  if(
    !confirmDelete
  ) return;

  localStorage.removeItem(
    STORAGE_KEY
  );

  alert(
    "All data removed"
  );

  if(
    typeof renderDashboard ===
    "function"
  ) {

    renderDashboard();

  }

  if(
    typeof renderReports ===
    "function"
  ) {

    renderReports();

  }

}
