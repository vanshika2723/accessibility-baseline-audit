"use strict";

/* =========================================
   LOGOUT
========================================= */

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", () => {
  alert("You have been logged out.");
});


/* =========================================
   USER MODAL
========================================= */

const modal = document.getElementById("user-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeModalButton = document.getElementById("close-modal");

const viewUserButtons = document.querySelectorAll(
  ".view-user-button"
);


/* Open modal */

viewUserButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const userName = button.dataset.user;

    modalTitle.textContent = `${userName} details`;

    modalBody.innerHTML = `
      <dl>
        <dt><strong>Name</strong></dt>
        <dd>${userName}</dd>

        <dt><strong>Account status</strong></dt>
        <dd>Active</dd>

        <dt><strong>Access</strong></dt>
        <dd>Enterprise dashboard access</dd>
      </dl>
    `;

    modal.showModal();

  });

});


/* Close modal */

closeModalButton.addEventListener("click", () => {
  modal.close();
});


/* Close modal with Escape */

modal.addEventListener("cancel", () => {
  modal.close();
});


/* =========================================
   ACCOUNT FORM
========================================= */

const accountForm = document.getElementById(
  "account-form"
);

const formMessage = document.getElementById(
  "form-message"
);


accountForm.addEventListener("submit", (event) => {

  event.preventDefault();

  /*
    Browser-native validation is used first.
    This keeps the form accessible and avoids
    unnecessary custom validation.
  */

  if (!accountForm.checkValidity()) {

    accountForm.reportValidity();

    formMessage.textContent =
      "Please correct the highlighted fields.";

    return;
  }


  formMessage.textContent =
    "Your account settings have been saved successfully.";

});


/* =========================================
   KEYBOARD SUPPORT
========================================= */

/*
  Escape closes the dialog if it is open.
*/

document.addEventListener("keydown", (event) => {

  if (
    event.key === "Escape" &&
    modal.open
  ) {

    modal.close();

  }

});


/* =========================================
   CURRENT YEAR
========================================= */

const footerParagraph =
  document.querySelector(".site-footer p");

if (footerParagraph) {

  const currentYear =
    new Date().getFullYear();

  footerParagraph.innerHTML =
    `&copy; ${currentYear} Enterprise Dashboard.
     Built with semantic HTML5 and accessibility in mind.`;

}