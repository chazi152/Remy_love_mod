class DateTime {
	/* plain static variables are still too new of a feature for a considerable number of old mobiles, they are re-declared in Time object instead
	static secondsPerDay = 86400;
	static secondsPerHour = 3600;
	static secondsPerMinute = 60;
	static standardYearMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	static leapYearMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	static monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	static daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	*/

	constructor(year = 2020, month = 1, day = 1, hour = 0, minute = 0, second = 0) {
		if (arguments.length === 1) {
			// If the argument is a DateTime object, copy its properties
			if (year instanceof DateTime) {
				this.year = year.year;
				this.month = year.month;
				this.day = year.day;
				this.hour = year.hour;
				this.minute = year.minute;
				this.second = year.second;
				this.timeStamp = year.timeStamp;
				return;
			}
			// If the argument is a timestamp, validate it and set the DateTime object accordingly
			if (arguments[0] < 0 || arguments[0] > 315569437199)
				throw new Error("Invalid timestamp: Timestamp cannot be lower than 0 or higher than 315569437199.");
			this.fromTimestamp(arguments[0]);
			return;
		}

		this.toTimestamp(year, month, day, hour, minute, second);
	}

	/*
	 * Total days since start of timeStamp calculation (year 1)
	 */
	static getTotalDaysSinceStart(year) {
		return (year - 1) * 365 + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400);
	}

	static isLeapYear(year) {
		return year !== 0 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	}

	static getDaysOfMonthFromYear(year) {
		return DateTime.isLeapYear(year) ? Time.leapYearMonths : Time.standardYearMonths;
	}

	static getDaysOfYear(year) {
		return DateTime.isLeapYear(year) ? 366 : 365;
	}

	// Convert year, month, day, hour, minute, and second to a timestamp
	toTimestamp(year, month, day, hour, minute, second) {
		if (year < 1 || year > 9999) throw new Error("Invalid year: Year must be between 1-9999.");
		if (month < 1 || month > 12) throw new Error("Invalid month: Month must be between 1-12.");
		const daysInMonth = DateTime.getDaysOfMonthFromYear(year);
		if (day < 1 || day > daysInMonth[month - 1]) throw new Error("Invalid date: Day must be between 1-" + daysInMonth[month - 1] + ".");

		const totalDays = DateTime.getTotalDaysSinceStart(year) + daysInMonth.slice(0, month - 1).reduce((a, b) => a + b, 0) + day - 1;
		const totalSeconds = totalDays * Time.secondsPerDay + hour * Time.secondsPerHour + minute * Time.secondsPerMinute + second;

		this.timeStamp = totalSeconds;
		this.year = year;
		this.month = month;
		this.day = day;
		this.hour = hour;
		this.minute = minute;
		this.second = second;
	}

	// Convert a timestamp to year, month, day, hour, minute, and second
	fromTimestamp(timestamp) {
		// Initialize the year to 1
		let year = 1;
		let month = 0;
		let day = (timestamp / Time.secondsPerDay) | 0;
		const hour = (timestamp / Time.secondsPerHour) | 0;
		const minute = (timestamp / Time.secondsPerMinute) | 0;
		const second = timestamp;

		// Maps the total number of days to the corresponding year and day.
		while (day > DateTime.getDaysOfYear(year)) {
			day -= DateTime.getDaysOfYear(year++);
		}

		const daysPerMonth = DateTime.getDaysOfMonthFromYear(year);

		// Determines the month and day by subtracting the number of days in each month and incrementing the month value.
		while (day >= daysPerMonth[month]) {
			day -= daysPerMonth[month++];
			if (month > 11) {
				month = 0;
				year++;
			}
		}

		this.timeStamp = timestamp;
		this.year = year;
		this.month = month + 1;
		this.day = day + 1;
		this.hour = hour % 24;
		this.minute = minute % 60;
		this.second = second % 60;
	}

	// Returns the first occurrence of a given weekday (1-7 for Sun-Sat) in the current month.
	getFirstWeekdayOfMonth(weekDay) {
		if (weekDay < 1 || weekDay > 7) throw new Error("Invalid weekDay: Must be between 1-7");

		const date = new DateTime(this.year, this.month, 1);
		return date.addDays((weekDay - date.weekDay + 7) % 7);
	}

	// Returns the next occurrence of a given weekday (1-7 for Sun-Sat) after the current date.
	getNextWeekdayDate(weekDay) {
		if (weekDay < 1 || weekDay > 7) throw new Error("Invalid weekDay: Must be between 1-7");

		const days = ((7 + weekDay - this.weekDay - 1) % 7) + 1;
		const date = new DateTime(this);
		return date.addDays(days);
	}

	// Returns the previous occurrence of a given weekday (1-7 for Sun-Sat) before the current date.
	getPreviousWeekdayDate(weekDay) {
		if (weekDay < 1 || weekDay > 7) throw new Error("Invalid weekDay: Must be between 1-7");
		const days = ((7 + weekDay - this.weekDay) % 7) - 7;
		const date = new DateTime(this);
		return date.addDays(days);
	}

	// Adds the specified number of years to the current date
	// Adding a negative value (e.g. -1) subtracts the years instead
	addYears(years) {
		if (years === 0) return this;
		const newYear = this.year + years;
		const daysInMonth = DateTime.getDaysOfMonthFromYear(newYear);
		const newDay = Math.min(this.day, daysInMonth[this.month - 1]);

		this.toTimestamp(newYear, this.month, newDay, this.hour, this.minute, this.second);
		return this;
	}

	// Adds the specified number of months to the current date
	// Adding a negative value (e.g. -1) subtracts the months instead
	addMonths(months) {
		if (months === 0) return this;
		const addedMonths = this.month + months;
		const newYear = this.year + Math.floor((addedMonths - 1) / 12);
		const newMonth = ((addedMonths - 1) % 12) + 1;
		const newDay = Math.min(this.day, DateTime.getDaysOfMonthFromYear(newYear)[newMonth - 1]);

		this.toTimestamp(newYear, newMonth, newDay, this.hour, this.minute, this.second);
		return this;
	}

	// Adds the specified number of days to the current date
	// Adding a negative value (e.g. -1) subtracts the days instead
	addDays(days) {
		if (days === 0) return this;
		this.fromTimestamp(this.timeStamp + days * Time.secondsPerDay);
		return this;
	}

	// Adds the specified number of hours to the current date and time
	// Adding a negative value (e.g. -1) subtracts the hours instead
	addHours(hours) {
		if (hours === 0) return this;
		this.timeStamp += hours * Time.secondsPerHour;
		this.fromTimestamp(this.timeStamp);
		return this;
	}

	// Adds the specified number of minutes to the current date and time
	// Adding a negative value (e.g. -1) subtracts the minutes instead
	addMinutes(minutes) {
		if (minutes === 0) return this;
		this.timeStamp += minutes * Time.secondsPerMinute;
		this.fromTimestamp(this.timeStamp);
		return this;
	}

	// Adds the specified number of seconds to the current date and time
	// Adding a negative value (e.g. -1) subtracts the seconds instead
	addSeconds(seconds) {
		if (seconds === 0) return this;
		this.timeStamp += seconds;
		this.fromTimestamp(this.timeStamp);
		return this;
	}

	// Returns the weekday (1-7 for Sun-Sat) of the current object's date.
	get weekDay() {
		const daysSinceStart = DateTime.getTotalDaysSinceStart(this.year + 1);
		const daysInMonth = Time.standardYearMonths.slice(0, this.month - 1).reduce((a, b) => a + b, 0);
		const isLeapYear = DateTime.isLeapYear(this.year) && this.month < 3;
		const weekDayOffset = V.weekDayOffset !== undefined ? V.weekDayOffset : 6;

		const totalDays = daysSinceStart + daysInMonth + this.day - Number(isLeapYear) + weekDayOffset;
		const weekDay = (totalDays % 7) + 1;

		return weekDay;
	}

	// Returns the name of the weekday (e.g. "Sunday") of the current object's date.
	get weekDayName() {
		return Time.daysOfWeek[this.weekDay - 1];
	}

	// Returns the name of the month (e.g. "January") of the current object's date.
	get monthName() {
		return Time.monthNames[this.month - 1];
	}

	// Returns a boolean indicating whether the current object's date falls on a weekend (Saturday or Sunday).
	get weekEnd() {
		return this.weekDay === 7 || this.weekDay === 1;
	}

	// Returns the last date of the current month.
	get lastDayOfMonth() {
		const daysPerMonth = DateTime.getDaysOfMonthFromYear(this.year);
		return daysPerMonth[this.month - 1];
	}

	// Returns the day of the year (1-365 or 1-366 for leap years) for the current object's date.
	get yearDay() {
		const daysPerMonth = DateTime.getDaysOfMonthFromYear(this.year);
		return daysPerMonth.slice(0, this.month - 1).reduce((a, b) => a + b, 0) + this.day;
	}
}
window.DateTime = DateTime;
