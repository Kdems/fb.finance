const BACKUP_FILENAME =
  "skybar-finance-backup.json";



// ======================
// EXPORT
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
        getEntries(),


      reviews:
        getStoredReviews()

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
      "Backup failed."
    );

  }

}



// ======================
// RESTORE
// ======================

function handleBackupUpload(
  input
) {

  if(
    !input ||
    !input.files ||
    !input.files[0]
  ) return;


  const file =
    input.files[0];


  const reader =
    new FileReader();


  reader.onload =
    function(
      event
    ) {

      try {

        const data =
          JSON.parse(
            event.target.result
          );


        if(
          data.entries
        ) {

          localStorage.setItem(
            "skybar.finance.entries.v1",
            JSON.stringify(
              data.entries
            )
          );

        }


        if(
          data.reviews
        ) {

          localStorage.setItem(
            "skybar.operating.review.v1",
            JSON.stringify(
              data.reviews
            )
          );

        }


        if(
          data.settings
        ) {

          localStorage.setItem(
            "skybar.finance.settings.v1",
            JSON.stringify(
              data.settings
            )
          );

        }


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
// RESET DATA
// ======================

function resetAllData() {

  const confirmed =
    confirm(
      "Delete all finance data?"
    );


  if(
    !confirmed
  ) return;


  localStorage.removeItem(
    "skybar.finance.entries.v1"
  );


  localStorage.removeItem(
    "skybar.operating.review.v1"
  );


  alert(
    "All operational data deleted. Settings kept."
  );


  location.reload();

}



// ======================
// REVIEW FALLBACK
// ======================

function getStoredReviews() {

  try {

    const saved =
      localStorage.getItem(
        "skybar.operating.review.v1"
      );


    if(
      !saved
    ) {

      return [];

    }


    return JSON.parse(
      saved
    );

  }

  catch(
    error
  ) {

    return [];

  }

}
