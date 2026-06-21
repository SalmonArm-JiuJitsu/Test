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