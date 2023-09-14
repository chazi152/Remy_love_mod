/* eslint-disable no-undef */

function displayMonthday() {
	return ordinalSuffixOf(Time.monthDay);
}
DefineMacroS("displayMonthday", displayMonthday);

/* Redundant - use Time.monthName */
// function month() {
// 	return Time.monthName.slice(0, 3);
// }
// DefineMacroS("month", month);
