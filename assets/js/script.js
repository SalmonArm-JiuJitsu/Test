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



// Home Icon Disappear On Scoll

window.addEventListener('scroll', function() {	

	const icon = document.querySelector(".icon");

	if (window.scrollY > 60) {
		icon.classList.add("disappear");
	}
	else {
		icon.classList.remove("disappear");
	}
   });



// Schedule

const weeklySchedule = [ 
	// Monday
	{ day: 'Mon', time: '4:00 PM - 4:45 PM', title: 'Kids (Ages 7-9)', capacity: 'available', color: '#1ae195', textColor: '#505050' },
	{ day: 'Mon', time: '5:00 PM - 6:00 PM', title: 'Kids (Ages 9-13)', capacity: 'available', color: '#00d5ff', textColor: '#505050'},
	{ day: 'Mon', time: '6:00 PM - 7:15 PM', title: 'No-Gi (Ages 13+)', capacity: 'available', color: '#4a0391', textColor: '#ccc'  },

	// Tuesday	
	{ day: 'Tue', time: '4:00 PM - 4:45 PM', title: 'Kids (Ages 7-9)', capacity: 'available', color: '#1ae195', textColor: '#505050' },
	{ day: 'Tue', time: '5:00 PM - 6:00 PM', title: 'Kids (Ages 9-13)', capacity: 'available', color: '#00d5ff', textColor: '#505050'},
	{ day: 'Tue', time: '6:00 PM - 7:15 PM', title: 'No-Gi (Ages 13+)', capacity: 'available', color: '#4a0391', textColor: '#ccc' },

	// Wednesday
	{ day: 'Wed', time: '4:00 PM - 4:45 PM', title: 'Kids (Ages 7-9)', capacity: 'available', color: '#1ae195', textColor: '#505050' },
	{ day: 'Wed', time: '5:00 PM - 6:00 PM', title: 'Kids (Ages 9-13)', capacity: 'available', color: '#00d5ff', textColor: '#505050'},
	{ day: 'Wed', time: '6:00 PM - 7:15 PM', title: 'No-Gi (Ages 13+)', capacity: 'available', color: '#4a0391', textColor: '#ccc' },

	// Thursday
	{ day: 'Thu', time: '4:00 PM - 4:45 PM', title: 'Kids (Ages 7-9)', capacity: 'available', color: '#1ae195', textColor: '#505050' },
	{ day: 'Thu', time: '5:00 PM - 6:00 PM', title: 'Kids (Ages 9-13)', capacity: 'available', color: '#00d5ff', textColor: '#505050'},
	{ day: 'Thu', time: '6:00 PM - 7:15 PM', title: 'No-Gi (Ages 13+)', capacity: 'available', color: '#4a0391', textColor: '#ccc' },

	// Friday
	{ day: 'Fri', time: '5:00 PM - 6:00 PM', title: 'Kids (Ages 9-13)', capacity: 'available', color: '#00d5ff', textColor: '#505050'},
	{ day: 'Fri', time: '6:00 PM - 7:15 PM', title: 'No-Gi (Ages 13+)', capacity: 'available', color: '#4a0391', textColor: '#ccc' },

	// Saturday - Closed
	{ day: 'Sat', time: '', title: 'Closed', capacity: 'closed' },

	// Sunday
	{ day: 'Sun', time: '10:30 AM - 11:30 AM', title: 'Open Mat', capacity: 'available', color: '#7c4dff' },
  
 ];

let currentOffset = 0;
let activeFilter = "all";

function addDays(date, days) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

function formatDayName(date) {
	return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDateRange(startDate) {
	const endDate = addDays(startDate, 6);
	const options = { month: 'short', day: 'numeric' };
	return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
}

// determine program
function getProgram(title) {
	if (title.includes('7-9')) return 'kids-7-9';
	if (title.includes('9-13')) return 'kids-9-13';
	if (title.includes('13+')) return 'no-gi-13+';
	if (title.includes('Open Mat')) return 'open-mat';
	return '';
}

function renderWeek() {
	const today = new Date();
	const startOfWeek = addDays(today, currentOffset * 7);
	const container = document.getElementById('scheduleApp');
	container.innerHTML = '';

	// controls
	const controls = document.createElement('div');
	controls.classList.add('controls');

	const prevBtn = document.createElement('button');
	prevBtn.innerHTML = `<img src="assets/fonts/fontawesome-pro/svgs/regular/arrow-left.svg" class="nav-arrow" />`;
	prevBtn.onclick = () => changeWeek(-1);

	const weekLabel = document.createElement('div');
	weekLabel.textContent = `${formatDateRange(startOfWeek)}`;
	weekLabel.classList.add('week-label');

	const nextBtn = document.createElement('button');
	nextBtn.innerHTML = `<img src="assets/fonts/fontawesome-pro/svgs/regular/arrow-right.svg" class="nav-arrow" />`;
	nextBtn.onclick = () => changeWeek(1);

	controls.appendChild(prevBtn);
	controls.appendChild(weekLabel);
	controls.appendChild(nextBtn);
	container.appendChild(controls);

	const row = document.createElement('div');
	row.className = 'week-row';

	for (let i = 0; i < 7; i++) {
		const date = addDays(startOfWeek, i);
		const dayName = formatDayName(date);

		const col = document.createElement('div');
		col.className = 'day-column';
		col.innerHTML = `<h3>${dayName}</h3>`;

		let dayClasses = weeklySchedule.filter(c => c.day === dayName);

		// apply filter
		if (activeFilter !== "all") {
			dayClasses = dayClasses.filter(c => {
		
				// ALWAYS keep closed blocks
				if (c.capacity === 'closed') return true;
		
				const program = getProgram(c.title);
		
				if (program === "open-mat") {
					return activeFilter === "kids-9-13" || activeFilter === "no-gi-13+";
				}
		
				return program === activeFilter;
			});
		}
		if (dayClasses.length === 0) {
			col.innerHTML += '<p>No classes</p>';
		} else {
			dayClasses.forEach(c => {

				const block = document.createElement('div');
				block.className = 'class-block';

				// closed
				if (c.capacity === 'closed') {
					block.classList.add('closed-block');
					block.textContent = 'Closed';
					col.appendChild(block);
					return;
				}

				block.style.background = c.color || '#1e1e1e';
				block.style.color = c.textColor || '#fff';

				const timeEl = document.createElement('div');
				timeEl.className = 'class-time';
				timeEl.textContent = c.time;
				block.appendChild(timeEl);

				const titleEl = document.createElement('div');
				titleEl.className = 'class-title';
				titleEl.textContent = c.title;
				block.appendChild(titleEl);

				// booking logic
				const classDateTime = new Date(date);
				const [startTime] = c.time.split(' - ');

				const [time, period] = startTime.trim().split(' ');
				let [hours, minutes] = time.split(':').map(Number);

				if (period === 'PM' && hours !== 12) hours += 12;
				if (period === 'AM' && hours === 12) hours = 0;

				classDateTime.setHours(hours, minutes, 0, 0);

				const now = new Date();
				const twoWeeksFromNow = new Date();
				twoWeeksFromNow.setDate(now.getDate() + 14);

				const isInFuture = classDateTime > now;
				const isWithin14Days = classDateTime <= twoWeeksFromNow;

				if (c.capacity === 'available') {

					if (isInFuture && isWithin14Days) {
						const btn = document.createElement('a');
						const program = getProgram(c.title);

					if (program === 'kids-7-9' || program === 'kids-9-13') {
						btn.href = 'youth-request.html';
					} else {
						btn.href = '13+request.html';
					}
						btn.className = 'schedule-button button-book';
						btn.textContent = 'Book Free Trial';
						block.appendChild(btn);
					}

					else if (isInFuture && !isWithin14Days) {
						const msg = document.createElement('div');
						msg.className = 'no-booking-yet';
						msg.textContent = 'Booking not available yet';
						block.appendChild(msg);
					}
				}

				else if (c.capacity === 'forming') {
					const formingBtn = document.createElement('a');
					formingBtn.href = 'youth-request.html';
					formingBtn.className = 'schedule-button forming-button';
					formingBtn.textContent = 'Join Spring Session';
					block.appendChild(formingBtn);
				}

				else {
					const waitlistBtn = document.createElement('a');
					waitlistBtn.href = 'youth-waitlist.html';
					waitlistBtn.className = 'schedule-button waitlist-button';
					waitlistBtn.textContent = 'Join Waitlist';
					block.appendChild(waitlistBtn);
				}

				col.appendChild(block);
			});
		}

		row.appendChild(col);
	}

	container.appendChild(row);
}

// Filter Dropdown
function initFilters() {
	const toggle = document.getElementById("filterToggle");
	const menu = document.getElementById("filterMenu");

	if (!toggle || !menu) return;

	toggle.onclick = () => {
		menu.classList.toggle("hidden");
	};

	menu.querySelectorAll("[data-filter]").forEach(opt => {
		opt.onclick = () => {
			activeFilter = opt.dataset.filter;
			menu.classList.add("hidden");
			renderWeek();
		};
	});

	// THIS PART closes on outside click
	document.addEventListener("click", (e) => {
		if (!menu.contains(e.target) && !toggle.contains(e.target)) {
			menu.classList.add("hidden");
		}
	});
}

function changeWeek(offsetChange) {
	currentOffset += offsetChange;
	renderWeek();
}

// init
document.addEventListener('DOMContentLoaded', () => {
	initFilters();
	renderWeek();
});



// Trials, Enrollment & Waitlist Forms

document.addEventListener("DOMContentLoaded", function () {
    const addChildBtn = document.getElementById("addChildBtn");
    const removeChildBtn = document.getElementById("removeChildBtn");
    const childrenContainer = document.getElementById("childrenContainer");

    let childCount = 1;

    addChildBtn.addEventListener("click", () => {
        childCount++;

        const childSection = document.createElement("div");
        childSection.classList.add("child-section");

        childSection.innerHTML = `
            <h2 style = "margin-top: 90px;">Child ${childCount}</h2>
            <div class = "field-left">
                <input type = "text" id = "child${childCount}FirstName" name = "child${childCount}FirstName" placeholder = "First Name" required>
            </div>

            <div class = "field-right">
                <input type = "text" id="child${childCount}LastName" name = "child${childCount}LastName" placeholder = "Last Name" required>
            </div>

            <div class = "field">
                <label for = "child${childCount}DOB">Birth Date</label>
                <input type = "date" id = "child${childCount}DOB" name = "child${childCount}DOB" required>
            </div>
        `;

        childrenContainer.appendChild(childSection);

        // Show "Remove" button if more than one child
        if (childCount > 1) {
            removeChildBtn.style.display = "inline-block";
        }
    });

    removeChildBtn.addEventListener("click", () => {
        if (childCount > 1) {
            const lastChild = childrenContainer.querySelector(".child-section:last-of-type");
            if (lastChild) {
                childrenContainer.removeChild(lastChild);
                childCount--;
            }
        }

        // Hide button if only one child remains
        if (childCount === 1) {
            removeChildBtn.style.display = "none";
        }
    });
});


	// Validate Trials, Enrollment & Waitlist Forms

	function validateRegistrationForm() {
		const parentPhone = document.getElementById('parentPhone');

		if (parentPhone.value.length !== 10) {
			alert("Please enter a 10-digit phone number.")
			return false;
		}

		if (!/^\d+$/.test(parentPhone.value)) {
			alert("Please include only numbers.")
			return false;
		}

		const fakeNumbers = ['1234567890, 0123456789, 1231231231', '1231231232', '1231231233, 1231231234, 1231231235, 1231231236, 1231231237, 1231231238, 1231231239, 1231231230'];

		if (fakeNumbers.includes(parentPhone.value)) {
			alert("Please enter a real phone number.");
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

		else {
			return true;
		}
	}


		// Waitlist Auto Generate Checkboxes

		function formatTimeRange(timeStr) {
			// Expecting format "3:10 PM - 3:50 PM"
			const [start, end] = timeStr.split(' - ');

			// Remove AM/PM from start, keep it on end
			const startWithoutAmPm = start.replace(/\s?[AP]M/i, '');
			return `${startWithoutAmPm} - ${end}`;
		}

		function generateWaitlistOptions() {
			const container = document.getElementById('waitlistOptions');
			container.innerHTML = '';
		
			const waitlistClasses = weeklySchedule.filter(c => c.capacity === 'full');
			const grouped = {};

			waitlistClasses.forEach(c => {
				if (!grouped[c.title]) grouped[c.title] = [];
				grouped[c.title].push(c);
			});

			Object.keys(grouped).forEach(title => {
				const classes = grouped[title];

				const daysTimes = classes.map(c => `<div>${c.day}: ${formatTimeRange(c.time)}</div>`).join('');

				const label = document.createElement('label');
				label.className = 'interest-option';

				label.innerHTML = `
					<input type="checkbox" name="classInterest[]" value="${title} | ${daysTimes}">
					<div>
						<a class="style5">${title}</a>
						<div>${daysTimes}</div>
					</div>
				`;

				container.appendChild(label);
			});
		}
		
		document.addEventListener('DOMContentLoaded', generateWaitlistOptions);


		// Trial Choice (Adult & Minor)
		
		function showTrialForm(type) {

			// hide chooser
			const choice = document.getElementById("trialChoice");
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