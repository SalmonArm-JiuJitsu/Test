// ---------- Config ----------
 
const BOOKING_WINDOW_DAYS = 14;
const ICON_PATH = 'assets/fonts/fontawesome-pro/svgs/regular/';
 
const PAGES = {
	youthRequest: 'youth-request.html',
	adultRequest: 'teens&adults-request.html'
};
 
// Each program defines its styling and where "Book Free Trial" sends people.
// Program ids double as the filter values used by the dropdown (data-filter).

const PROGRAMS = {
	'no-gi-7-13': {
		title: 'No-Gi (Ages 7-13)',
		color: '#00d5ff',
		textColor: '#131313',
		bookingPage: PAGES.youthRequest,
		allowSelf: false
	},
	'no-gi-14+': {
		title: 'No-Gi (Ages 14+)',
		color: '#4a0391',
		textColor: '#eee',
		bookingPage: PAGES.adultRequest
	},
	'mma-14+': {
		title: 'MMA (Ages 14+)',
		color: '#252525',
		textColor: '#eee',
		bookingPage: PAGES.adultRequest
	},
	'open-mat': {
		title: 'Open Mat',
		color: '#7c4dff',
		bookingPage: PAGES.adultRequest
	}
};
 
// Open Mat stays visible when one of these filters is active

const OPEN_MAT_FILTERS = ['no-gi-14+', 'mma-14+'];
 
// ---------- Schedule data ----------

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const WEEKDAY_CLASSES = [
	{ time: '5:00 PM - 6:00 PM', program: 'no-gi-7-13' },
	{ time: '6:00 PM - 7:15 PM', program: 'no-gi-14+' },
	{ time: '7:15 PM - 8:15 PM', program: 'mma-14+' }
];
 
const weeklySchedule = [
	...WEEKDAYS.flatMap(day =>
		WEEKDAY_CLASSES.map(c => ({ day, ...c }))
	),
	{ day: 'Sat', time: '10:30 AM - 11:30 AM', program: 'open-mat' },
	{ day: 'Sun', time: '10:30 AM - 11:30 AM', program: 'open-mat' }
];
 
// ---------- State ----------
 
let currentOffset = 0;
let activeFilter = 'all';
 
// ---------- Helpers ----------
 
function createEl(tag, className, text) {
	const el = document.createElement(tag);
	if (className) el.className = className;
	if (text) el.textContent = text;
	return el;
}
 
function addDays(date, days) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}
 
function formatDayName(date) {
	return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatShortDate(date) {
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
 
function formatDateRange(startDate) {
	const options = { month: 'short', day: 'numeric' };
	const start = startDate.toLocaleDateString('en-US', options);
	const end = addDays(startDate, 6).toLocaleDateString('en-US', options);
	return `${start} - ${end}`;
}
 
// Turns "5:00 PM - 6:00 PM" on a given date into a Date for the start time
function getStartDateTime(date, timeRange) {
	const [startTime] = timeRange.split(' - ');
	const [time, period] = startTime.trim().split(' ');
	let [hours, minutes] = time.split(':').map(Number);
 
	if (period === 'PM' && hours !== 12) hours += 12;
	if (period === 'AM' && hours === 12) hours = 0;
 
	const start = new Date(date);
	start.setHours(hours, minutes, 0, 0);
	return start;
}
 
function matchesFilter(entry, filter) {
	if (filter === 'all') return true;
 
	if (entry.program === 'open-mat') return OPEN_MAT_FILTERS.includes(filter);
 
	return entry.program === filter;
}
 
// ---------- Rendering ----------
 
function createControls(startOfWeek) {
	const controls = createEl('div', 'controls');
 
	const makeNavButton = (icon, offsetChange) => {
		const btn = document.createElement('button');
		btn.innerHTML = `<i class="fa-regular fa-${icon}"></i>`;
		btn.onclick = () => changeWeek(offsetChange);
		return btn;
	};
 
	controls.append(
		makeNavButton('arrow-left', -1),
		createEl('div', 'week-label', formatDateRange(startOfWeek)),
		makeNavButton('arrow-right', 1)
	);
 
	return controls;
}
 
function createActionElement(entry, startTime) {
	const now = new Date();
	if (startTime <= now) return null;

	const cutoff = addDays(now, BOOKING_WINDOW_DAYS);
	if (startTime > cutoff) {
		return createEl('div', 'no-booking-yet', 'Booking not available yet');
	}

	const btn = createEl('a', 'schedule-button button-book', 'Book Free Trial');
	btn.href = '#';
	btn.setAttribute('role', 'button');
	btn.onclick = e => {
		e.preventDefault();
		openBookingModal(entry, startTime);
	};
	return btn;
}

 
function createClassBlock(entry, date) {
	const block = createEl('div', 'class-block');
 
	const program = PROGRAMS[entry.program];
	block.style.background = program.color || '#1e1e1e';
	block.style.color = program.textColor || '#fff';
 
	block.appendChild(createEl('div', 'class-time', entry.time));
	block.appendChild(createEl('div', 'class-title', program.title));
 
	const action = createActionElement(entry, getStartDateTime(date, entry.time));
	if (action) block.appendChild(action);
 
	return block;
}
 
function createDayColumn(date) {
	const dayName = formatDayName(date);
	const col = createEl('div', 'day-column');

	const header = createEl('h3', 'day-header');
	header.append(
		createEl('span', 'day-name', dayName),
		createEl('span', 'day-date', formatShortDate(date))
	);
	col.appendChild(header);

	const dayClasses = weeklySchedule.filter(
		c => c.day === dayName && matchesFilter(c, activeFilter)
	);

	if (dayClasses.length === 0) {
		col.appendChild(createEl('p', '', 'No classes'));
	} else {
		dayClasses.forEach(c => col.appendChild(createClassBlock(c, date)));
	}

	return col;
}
 
function renderWeek() {
	const startOfWeek = addDays(new Date(), currentOffset * 7);
	const container = document.getElementById('scheduleApp');
	container.innerHTML = '';
 
	container.appendChild(createControls(startOfWeek));
 
	const row = createEl('div', 'week-row');
	for (let i = 0; i < 7; i++) {
		row.appendChild(createDayColumn(addDays(startOfWeek, i)));
	}
	container.appendChild(row);
}
 
function changeWeek(offsetChange) {
	currentOffset += offsetChange;
	renderWeek();
}
 
// ---------- Filter dropdown ----------
 
function initFilters() {
	const toggle = document.getElementById('filterToggle');
	const menu = document.getElementById('filterMenu');
	if (!toggle || !menu) return;
 
	toggle.onclick = () => menu.classList.toggle('hidden');
 
	menu.querySelectorAll('[data-filter]').forEach(opt => {
		opt.onclick = () => {
			activeFilter = opt.dataset.filter;
			menu.classList.add('hidden');
			renderWeek();
		};
	});
 
	// Close the menu on outside click
	document.addEventListener('click', e => {
		if (!menu.contains(e.target) && !toggle.contains(e.target)) {
			menu.classList.add('hidden');
		}
	});
}
 
// ---------- Init ----------
 
document.addEventListener('DOMContentLoaded', () => {
	initFilters();
	renderWeek();
});

// ---------- Booking popup ----------

// TODO: swap for PowerForm later. Using the same endpoint as the contact form for now.
const BOOKING_ENDPOINT = 'https://formsubmit.co/5706783fd4c76300c52561682502228e';

// Google Sheet (Apps Script web app)
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzGxX4lWJe1r8sgzVuwML_K7wnbdtApFHobdWF8wcYGe6FNS3jwsKgOhdqJuGLk8VVGLQ/exec';

const ADULT_AGE = 19;

let bookingModal = null;

const GENDER_OPTIONS = `
	<option value="" disabled selected>Select gender</option>
	<option>Male</option>
	<option>Female</option>`;

// Sends a copy of the booking to the Google Sheet
function sendToSheet(form) {
	if (!SHEET_ENDPOINT.startsWith('https://')) return;
	const data = new URLSearchParams(new FormData(form));
	fetch(SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data, keepalive: true })
		.catch(() => {});
}

function field(id, name, label, type = 'text', extra = '') {
	return `
		<div class="bk-field">
			<label for="${id}">${label}</label>
			<input id="${id}" name="${name}" type="${type}" required ${extra}>
		</div>`;
}

function genderField(id) {
	return `
		<div class="bk-field">
			<label for="${id}">Gender</label>
			<select id="${id}" name="gender" required>${GENDER_OPTIONS}</select>
		</div>`;
}

function cardHead(step, title, subtitle) {
	return `
		<div class="booking-card-head">
			${step ? `<span class="booking-step">${step}</span>` : ''}
			<div>
				<h4>${title}</h4>
				<p class="booking-sub">${subtitle}</p>
			</div>
		</div>`;
}

const PHONE_ATTRS = 'inputmode="numeric" maxlength="10" pattern="[0-9]{10}" title="10 digits, numbers only" autocomplete="tel"';

// Hidden inputs that carry the class info with the submission
const CLASS_HIDDEN = `
	<input type="hidden" name="class_program" class="js-program">
	<input type="hidden" name="class_date" class="js-date">
	<input type="hidden" name="class_time" class="js-time">
	<input type="hidden" name="_subject" value="New free trial booking">`;

function buildBookingModal() {
	const overlay = createEl('div', 'booking-overlay');
	overlay.hidden = true;

	overlay.innerHTML = `
		<div class="booking-modal" role="dialog" aria-modal="true" aria-labelledby="bookingTitle">
			<h2 id="bookingTitle" class="booking-title">Book a class</h2>
			<button type="button" class="booking-close" aria-label="Close">&times;</button>

			<div class="booking-summary">
				<div class="booking-program-row">
					<h3 class="booking-program-name"></h3>
					<span class="booking-program-ages"></span>
				</div>
				<div class="booking-meta"><i class="fa-regular fa-calendar"></i><span class="js-date-text"></span></div>
				<div class="booking-meta"><i class="fa-regular fa-clock"></i><span class="js-time-text"></span></div>
			</div>

			<div class="booking-who">
				<h4>Who are you booking for?</h4>
				<div class="booking-toggle">
					<button type="button" data-mode="self" aria-pressed="false">Myself</button>
					<button type="button" data-mode="child" aria-pressed="false">My child</button>
				</div>
			</div>

			<!-- MYSELF (19+) -->
			<form class="booking-form" data-for="self" method="post" action="${BOOKING_ENDPOINT}" hidden>
				<fieldset disabled>
					<input type="hidden" name="booking_for" value="Myself">
					${CLASS_HIDDEN}

					<div class="booking-card">
						${cardHead(null, 'Participant', 'Who is taking the class')}
						<div class="bk-row">
							${field('selfFirst', 'participant_first_name', 'First name', 'text', 'autocomplete="given-name"')}
							${field('selfLast', 'participant_last_name', 'Last name', 'text', 'autocomplete="family-name"')}
						</div>
						${field('selfDob', 'participant_dob', 'Date of birth', 'date', 'class="js-dob" data-rule="adult"')}
						${genderField('selfGender')}
						${field('selfEmail', 'participant_email', 'Email', 'email', 'autocomplete="email"')}
						${field('selfPhone', 'participant_phone', 'Phone number', 'tel', PHONE_ATTRS)}
					</div>

					<button type="submit" class="booking-submit">Book Class</button>
				</fieldset>
			</form>

			<!-- MY CHILD (under 19) -->
			<form class="booking-form" data-for="child" method="post" action="${BOOKING_ENDPOINT}" hidden>
				<fieldset disabled>
					<input type="hidden" name="booking_for" value="Child">
					${CLASS_HIDDEN}

					<div class="booking-card">
						${cardHead(1, 'Child', 'Your child\'s details')}
						<div class="bk-row">
							${field('childFirst', 'participant_first_name', 'First name')}
							${field('childLast', 'participant_last_name', 'Last name')}
						</div>
						${field('childDob', 'participant_dob', 'Date of birth', 'date', 'class="js-dob" data-rule="minor"')}
						${genderField('childGender')}
					</div>

					<div class="booking-card">
						${cardHead(2, 'Parent / Legal Guardian', 'Parent or guardian who will sign the waiver')}
						<div class="booking-alert">
							<i class="fa-regular fa-triangle-exclamation"></i>
							<span>Anyone under ${ADULT_AGE} needs a parent or legal guardian to sign their waiver, so we need the parent or guardian's contact info below.</span>
						</div>
						<div class="bk-row">
							${field('parentFirst', 'parent_first_name', 'First name', 'text', 'autocomplete="given-name"')}
							${field('parentLast', 'parent_last_name', 'Last name', 'text', 'autocomplete="family-name"')}
						</div>
						${field('parentEmail', 'parent_email', 'Email', 'email', 'autocomplete="email"')}
						${field('parentPhone', 'parent_phone', 'Phone number', 'tel', PHONE_ATTRS)}
					</div>

					<button type="submit" class="booking-submit">Book Class</button>
				</fieldset>
			</form>
		</div>`;

	document.body.appendChild(overlay);

	// Close: X button, backdrop click, Escape
	overlay.querySelector('.booking-close').onclick = closeBookingModal;
	overlay.addEventListener('click', e => { if (e.target === overlay) closeBookingModal(); });
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && !overlay.hidden) closeBookingModal();
	});

	// Myself / My child toggle
	overlay.querySelectorAll('.booking-toggle button').forEach(btn => {
		btn.onclick = () => setBookingMode(btn.dataset.mode);
	});

	// DOB rules: "Myself" must be 19+, "My child" must be under 19
	const today = new Date().toISOString().split('T')[0];
	overlay.querySelectorAll('.js-dob').forEach(input => {
		input.max = today;
		input.addEventListener('input', () => validateDob(input));
	});

	// Also log each booking to the Google Sheet (only fires after validation passes)
	overlay.querySelectorAll('.booking-form').forEach(form => {
		form.addEventListener('submit', () => sendToSheet(form));
	});

	return overlay;
}

function ageFromDob(value) {
	const dob = new Date(value + 'T00:00:00');
	const now = new Date();
	let age = now.getFullYear() - dob.getFullYear();
	const m = now.getMonth() - dob.getMonth();
	if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
	return age;
}

function validateDob(input) {
	input.setCustomValidity('');
	if (!input.value) return;

	const age = ageFromDob(input.value);
	if (input.dataset.rule === 'adult' && age < ADULT_AGE) {
		input.setCustomValidity(`Participants under ${ADULT_AGE} need a parent or guardian to book. Please choose "My child".`);
	}
	if (input.dataset.rule === 'minor' && age >= ADULT_AGE) {
		input.setCustomValidity(`Participants ${ADULT_AGE} or older book for themselves. Please choose "Myself".`);
	}
}

// Shows one form and disables the other so its required fields can't block submission
function setBookingMode(mode) {
	bookingModal.querySelectorAll('.booking-form').forEach(form => {
		const active = form.dataset.for === mode;
		form.hidden = !active;
		form.querySelector('fieldset').disabled = !active;
	});

	bookingModal.querySelectorAll('.booking-toggle button').forEach(btn => {
		const on = btn.dataset.mode === mode;
		btn.classList.toggle('active', on);
		btn.setAttribute('aria-pressed', on);
	});
}

function formatLongDate(date) {
	const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
	const month = date.toLocaleDateString('en-US', { month: 'short' });
	return `${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
}

function openBookingModal(entry, startTime) {
	if (!bookingModal) bookingModal = buildBookingModal();

	const program = PROGRAMS[entry.program];
	const dateText = formatLongDate(startTime);

	// "No-Gi (Ages 7-13)" -> "No-Gi" + "Ages 7-13"
	const parts = program.title.match(/^(.*?)\s*\((.*)\)$/);
	const programName = parts ? parts[1] : program.title;
	const programAges = parts ? parts[2] : '';

	// Summary at the top of the popup
	bookingModal.querySelector('.booking-program-name').textContent = programName;
	bookingModal.querySelector('.booking-program-ages').textContent = programAges;
	bookingModal.querySelector('.js-date-text').textContent = dateText;
	bookingModal.querySelector('.js-time-text').textContent = entry.time;

	// Class info that gets submitted with the form
	bookingModal.querySelectorAll('.js-program').forEach(el => el.value = program.title);
	bookingModal.querySelectorAll('.js-date').forEach(el => el.value = dateText);
	bookingModal.querySelectorAll('.js-time').forEach(el => el.value = entry.time);

	// Reset any previous entries
	bookingModal.querySelectorAll('.booking-form').forEach(f => f.reset());
	bookingModal.querySelectorAll('.js-dob').forEach(i => i.setCustomValidity(''));

	// Youth-only classes skip the toggle
	const allowSelf = program.allowSelf !== false;
	bookingModal.querySelector('.booking-who').hidden = !allowSelf;
	setBookingMode(allowSelf ? null : 'child');

	bookingModal.hidden = false;
	document.body.style.overflow = 'hidden';
	bookingModal.querySelector('.booking-modal').scrollTop = 0;
}

function closeBookingModal() {
	bookingModal.hidden = true;
	document.body.style.overflow = '';
}