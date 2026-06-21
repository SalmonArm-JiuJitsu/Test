// Schedule

const weeklySchedule = [ 
	// Monday
	{ day: 'Mon', time: '4:00 PM - 4:45 PM', title: 'Kids (Ages 7-9)', capacity: 'full', color: '#1ae195', textColor: '#505050' },
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
						btn.href = 'teens&adults-request.html';
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

	// Closes Filter Options On Outside Click
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

// Init
document.addEventListener('DOMContentLoaded', () => {
	initFilters();
	renderWeek();
});