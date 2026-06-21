// Init

document.addEventListener("DOMContentLoaded", () => {
    document.body.style.visibility = "visible";

    const todayDateField = document.getElementById("todayDate");
    if (todayDateField) {
        todayDateField.value = new Date().toLocaleDateString();
    }

    bindRegistrationButton();
});


// Validate Form

function validateRegistrationForm() {
    const parentPhone = document.getElementById("parentPhone");
    if (!parentPhone) return true;

    if (parentPhone.value.length !== 10) {
        alert("Please enter a 10-digit phone number.");
        return false;
    }

    if (!/^\d+$/.test(parentPhone.value)) {
        alert("Please include only numbers.");
        return false;
    }

    return true;
}


// Square Payment & Registration Capture

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwYn_UhVUvum5T-VVJrfRCY11BW8F8WH2eFbt3W9zKXPoxIkyrhgRUnKHMl8IsUIpRm/exec";
const SQUARE_URL = "https://square.link/u/6dYq5Ews";

async function handleRegistrationPayment() {

    const form = document.getElementById("registrationForm");
    if (!form) return;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (!validateRegistrationForm()) return;

    const payload = {
        parentFirstName: document.getElementById("parentFirstName").value,
        parentLastName: document.getElementById("parentLastName").value,
        parentEmail: document.getElementById("parentEmail").value,
        parentPhone: document.getElementById("parentPhone").value,
        todayDate: document.getElementById("todayDate").value,
        childFirstName: document.getElementById("childFirstName").value,
        childLastName: document.getElementById("childLastName").value,
        childDOB: document.getElementById("childDOB").value
    };

    try {
        await fetch(SHEETS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        window.location.href = SQUARE_URL;

    } catch (err) {
        console.error(err);
        alert("There was a problem saving your registration. Please try again.");
    }
}


// Button Bind

function bindRegistrationButton() {
    const btn = document.getElementById("payButton");
    if (!btn) return;

    btn.addEventListener("click", handleRegistrationPayment);
}