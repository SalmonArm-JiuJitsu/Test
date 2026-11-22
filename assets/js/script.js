// Hide Until CSS Loads

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';

    const todayDateField = document.getElementById("todayDate");
    if (todayDateField) {
        todayDateField.value = new Date().toLocaleDateString();
    }
});



// Menu

const burger = document.querySelector(".burger");
const Menu = document.querySelector(".menu");

burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    Menu.classList.toggle("active");
})

document.querySelectorAll(".menu-link").forEach(n => n.addEventListener("click", () => {
    burger.classList.remove("active");
    Menu.classList.remove("active");
}))

document.querySelector(".close").addEventListener("click", () => {
    burger.classList.remove("active");
    Menu.classList.remove("active");
})

document.querySelector(".contact-button").addEventListener("click", () => {
    burger.classList.remove("active");
    Menu.classList.remove("active");
})



// Trial Choice (Adult & Youth)
		
function showForm(type) {

	// hide chooser
	const choice = document.getElementById("formChoice");
	if (choice) choice.style.display = "none";

	// hide both forms first
	const child = document.getElementById("childForm");
	const adult = document.getElementById("adultForm");

	if (child) child.style.display = "none";
	if (adult) adult.style.display = "none";

	// show selected
	if (type === "adult") {
		if (adult) adult.style.display = "block";
	} else {
		if (child) child.style.display = "block";
	}

	// scroll to top cleanly
	window.scrollTo({ top: 0, behavior: "smooth" });
}



// Contact Form Validation

function contactForm() {
	const name = document.getElementById('nameInput');
	const email = document.getElementById('emailInput');
	const message = document.getElementById('messageTextArea');

	if(name.value === '' || email.value === '' || message.value === '') {
		alert("Please Fill Out Each Field.")
		return false;
	}

	if(email.value === 'info@salmonarmjiujitsu.ca') {
		alert("Please Enter Your Email Address.")
		return false;
	}

	if(message.length < 5) {
		alert("Please enter a message.")
		return false;
	}

	else {
		return true;
    }
}



// Validate Trials & Waitlist Forms

function validateRegistrationForm() {

	const phone = document.getElementById("parentPhone");

	if (!document.getElementById("registrationForm").checkValidity()) {
		document.getElementById("registrationForm").reportValidity();
		return false;
	}

	if (phone.value.length !== 10) {
		alert("Please enter a 10-digit phone number.");
		phone.focus();
		return false;
	}

	if (!/^\d+$/.test(phone.value)) {
		alert("Please include only numbers.");
		phone.focus();
		return false;
	}

	const fakeNumbers = [
		'1234567890',
		'0123456789',
		'1231231231',
		'1231231232',
		'1231231233',
		'1231231234',
		'1231231235',
		'1231231236',
		'1231231237',
		'1231231238',
		'1231231239',
		'1231231230'
	];

	if (fakeNumbers.includes(phone.value)) {
		alert("Please enter a real phone number.");
		phone.focus();
		return false;
	}

	const interests = document.querySelectorAll('input[name="classInterest[]"]');

	if (interests.length > 0) {

		const checked = document.querySelectorAll('input[name="classInterest[]"]:checked');

		if (checked.length === 0) {
			alert("Please select at least one class option.");
			return false;
		}
	}

	return true;
}