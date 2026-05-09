const REVIEW_KEY =
  "skybar.operating.review.v1";



// ======================
// INIT
// ======================

function initReviewPage() {

  bindReviewForm();

  setDefaultReviewDate();

  renderReviewHistory();

}



// ======================
// STORAGE
// ======================

function getReviews() {

  const saved =
    localStorage.getItem(
      REVIEW_KEY
    );


  if(
    !saved
  ) {

    return [];

  }


  try {

    return JSON.parse(
      saved
    );

  }

  catch(
    error
  ) {

    console.error(
      error
    );


    return [];

  }

}


function saveReviews(
  reviews
) {

  localStorage.setItem(
    REVIEW_KEY,
    JSON.stringify(
      reviews
    )
  );

}



// ======================
// FORM
// ======================

function bindReviewForm() {

  const form =
    document.getElementById(
      "reviewForm"
    );


  if(
    !form
  ) return;


  form.addEventListener(
    "submit",
    handleSaveReview
  );

}


function handleSaveReview(
  e
) {

  e.preventDefault();


  const reviews =
    getReviews();


  reviews.push({

    date:
      getValue(
        "reviewDate"
      ),


    revenueComment:
      getValue(
        "revenueComment"
      ),


    costComment:
      getValue(
        "costComment"
      ),


    operationComment:
      getValue(
        "operationComment"
      ),


    actionPlan:
      getValue(
        "actionPlan"
      )

  });


  saveReviews(
    reviews
  );


  document.getElementById(
    "reviewForm"
  ).reset();


  setDefaultReviewDate();

  renderReviewHistory();

}



// ======================
// UI
// ======================

function renderReviewHistory() {

  const container =
    document.getElementById(
      "reviewHistory"
    );


  if(
    !container
  ) return;


  const reviews =
    getReviews();


  container.innerHTML =
    "";


  if(
    reviews.length === 0
  ) {

    container.innerHTML =
      `
      <div class="text-slate-400">
        No reviews yet
      </div>
      `;

    return;

  }


  const sorted =
    [...reviews].sort(
      (
        a,
        b
      ) =>
        new Date(
          b.date
        ) -
        new Date(
          a.date
        )
    );


  sorted.forEach(
    review => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "border rounded-2xl p-5";


      card.innerHTML =
        `
        <div class="font-bold mb-4">
          ${review.date}
        </div>

        <div class="mb-3">
          <strong>Revenue:</strong>
          <br>
          ${review.revenueComment || "-"}
        </div>

        <div class="mb-3">
          <strong>Cost:</strong>
          <br>
          ${review.costComment || "-"}
        </div>

        <div class="mb-3">
          <strong>Operation:</strong>
          <br>
          ${review.operationComment || "-"}
        </div>

        <div>
          <strong>Action:</strong>
          <br>
          ${review.actionPlan || "-"}
        </div>
        `;


      container.appendChild(
        card
      );

    }
  );

}



// ======================
// HELPERS
// ======================

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


function setDefaultReviewDate() {

  const dateField =
    document.getElementById(
      "reviewDate"
    );


  if(
    !dateField
  ) return;


  const today =
    new Date();


  dateField.value =
    today
      .toISOString()
      .split(
        "T"
      )[0];

}



// ======================
// START
// ======================

document.addEventListener(
  "DOMContentLoaded",
  initReviewPage
);
