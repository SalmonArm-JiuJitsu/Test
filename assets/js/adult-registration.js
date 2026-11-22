// Registration Upload & Payment

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwnUYf-rUyWLS6Pfid8Ez0JNhpQ3tqJLvUpCqDRFT2bbtdqSosOj6eKKXuJnDAe5T4/exec";
const SQUARE_URL = "https://square.link/u/i5TY5RjJ";

async function handleRegistrationPayment() {

    const form = document.getElementById("registrationForm");

    // HTML Validation
    if (!form.checkValidity()) {

        const firstInvalid = form.querySelector(":invalid");
    
        if (firstInvalid) {
            firstInvalid.focus();
    
            firstInvalid.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    
        if (typeof form.reportValidity === "function") {
            form.reportValidity();
        }
    
        return;
    }

    // Phone Validation
    const phone = document.getElementById("adultPhone");

    if (phone.value.length !== 10) {
        alert("Please enter a 10-digit phone number.");
        phone.focus();
        return;
    }

    if (!/^\d+$/.test(phone.value)) {
        alert("Please include only numbers.");
        phone.focus();
        return;
    }

    // Payload
    const payload = {
        adultFirstName: document.getElementById("adultFirstName").value,
        adultLastName: document.getElementById("adultLastName").value,
        adultEmail: document.getElementById("adultEmail").value,
        adultPhone: document.getElementById("adultPhone").value,
        adultDOB: document.getElementById("adultDOB").value,
        classTime: "Adult",
    };

    // Show loading spinner
    document.getElementById("loadingOverlay").classList.add("show");

    // Send to Google Sheets
    try {

        await fetch(SHEETS_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        window.location.href = SQUARE_URL;

    }
    catch (err) {
        document.getElementById("loadingOverlay").classList.remove("show");

        alert("There was a problem saving your registration. Please try again.");
        console.error(err);

    }
}

// Bind Button
document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("payButton");

    if (btn) {
        btn.addEventListener("click", handleRegistrationPayment);
    }

    window.addEventListener("pageshow", () => {
        document.getElementById("loadingOverlay")?.classList.remove("show");
    });

});