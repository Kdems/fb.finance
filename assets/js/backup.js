const BACKUP_FILENAME =
  "skybar-finance-backup.json";


// ======================
// EXPORT BACKUP
// ======================

function exportBackup() {

  try {

    const payload = {

      exportedAt:
        new Date().toISOString(),


      version:
        "1.0",


      settings:
        getSettings(),


      entries:
        getEntries()

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


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


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


    alert(
      "Backup exported successfully."
    );

  }

  catch(
    error
  ) {

    console.error(
      error
    );


    alert(
      "Backup export failed."
    );

  }

}


// ======================
// RESTORE BACKUP
// ======================

function restoreBackup(
  file
) {

  if(
    !file
  ) {

    alert(
      "No backup file selected."
    );

    return;

  }


  const reader =
    new FileReader();


  reader.onload =
    function(
      event
    ) {

      try {

        const parsed =
          JSON.parse(
            event.target.result
          );


        if(
          !parsed.entries ||
          !parsed.settings
        ) {

          throw new Error(
            "Invalid backup file."
          );

        }


        localStorage.setItem(
          "skybar.finance.entries.v1",
          JSON.stringify(
            parsed.entries
          )
        );


        localStorage.setItem(
          "skybar.finance.settings.v1",
          JSON.stringify(
            parsed.settings
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

        console.error(
          error
        );


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
// INPUT HANDLER
// ======================

function handleBackupUpload(
  input
) {

  if(
    !input ||
    !input.files ||
    !input.files[0]
  ) {

    return;

  }


  restoreBackup(
    input.files[0]
  );

}
