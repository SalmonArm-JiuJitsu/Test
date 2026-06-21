// Registration Upload & Payment

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwU5PGst_YxIPr5J3GOq6kAraV4NEbIatR_6QChrO7NcCYCjAE0U17_EJI5sYtkPzs/exec";
const SQUARE_URL = "https://square.link/u/6dYq5Ews";

async function handleRegistrationPayment() {

    const form = document.getElementById("registrationForm");

    // HTML validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // payload
    const payload = {
        parentFirstName: document.getElementById("parentFirstName").value,
        parentLastName: document.getElementById("parentLastName").value,
        parentEmail: document.getElementById("parentEmail").value,
        parentPhone: document.getElementById("parentPhone").value,

        kidFirstName: document.getElementById("kidFirstName").value,
        kidLastName: document.getElementById("kidLastName").value,
        kidDOB: document.getElementById("kidDOB").value,
    };

    // send to Google Sheets
    try {

        await fetch(SHEETS_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        window.location.href = SQUARE_URL;

    }
    catch (err) {

        alert("There was a problem saving your registration. Please try again.");
        console.error(err);

    }
}

// bind button
document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("payButton");

    if (btn) {
        btn.addEventListener("click", handleRegistrationPayment);
    }

});