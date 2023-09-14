// Time in milliseconds, float with microsecond precision if available.
const millitime =
	typeof performance === "object" && typeof performance.now === "function"
		? function () {
				return performance.now();
		  }
		: function () {
				return new Date().getTime();
		  };
DOL.Perflog.millitime = millitime;

/**
 * Widget performance records for one passage.
 * Key = widget name, value = {
 *  name: widget name,
 * 	n: number of widget calls,
 *  total: Sum of execution times including internal widget calls, milliseconds
 *  own: Sum of execution times excluding internal widget calls, milliseconds
 * }.
 */
let wpRec = {}; // Widget performance records
const wpSelf = { name: "__perflog_logWidgetEnd", n: 0, total: 0, own: 0 };
wpRec[wpSelf.name] = wpSelf;
/**
 * Global widget performance records.
 */
DOL.Perflog.globalRec = {};
DOL.Perflog.lastRec = {};
DOL.Perflog.enabled = true;
DOL.Perflog.self = true; // Record own performance
/**
 * Performance stack entry = { t0: widget start time, i: internal widget duration }.
 */
const wpStack = []; // Widget performance stack
DOL.Perflog.nPassages = 0;
$(document).on(":passageend", function () {
	if (!DOL.Perflog.enabled) return;
	try {
		if (DOL.Perflog.self) DOL.Perflog.logWidgetStart("__perflog_passageEnd");
		DOL.Perflog.nPassages++;
		for (const name in wpRec) {
			const rec = wpRec[name];
			const grec = DOL.Perflog.globalRec[name];
			if (!grec) {
				DOL.Perflog.globalRec[name] = rec;
			} else {
				grec.n += rec.n;
				grec.total += rec.total;
				grec.own += rec.own;
			}
		}
		DOL.Perflog.lastRec = wpRec;
		wpRec = {};
	} finally {
		if (DOL.Perflog.self) DOL.Perflog.logWidgetEnd("__perflog_passageEnd");
	}
});
DOL.Perflog.logWidgetStart = function (widgetName) {
	if (!DOL.Perflog.enabled) return;
	wpStack.push({
		name: widgetName,
		t0: millitime(),
		i: 0,
	});
};

/**
 * Record that widget `widgetName` executed in `totaltime` ms,
 * including `internaltime` internal widget calls.
 *
 * @param {string} widgetName
 * @param {number} totaltime
 * @param {number} internaltime
 */
DOL.Perflog.logWidgetTime = function (widgetName, totaltime, internaltime) {
	if (typeof internaltime !== "number") internaltime = 0;
	const prevPerflog = wpStack[wpStack.length - 1];
	if (prevPerflog) {
		prevPerflog.i += totaltime;
	}
	let perfrec = wpRec[widgetName];
	if (!perfrec)
		perfrec = wpRec[widgetName] = {
			name: widgetName,
			n: 0,
			total: 0,
			own: 0,
		};
	perfrec.n++;
	perfrec.total += totaltime;
	perfrec.own += totaltime - internaltime;
};
DOL.Perflog.logWidgetEnd = function (widgetName) {
	if (!DOL.Perflog.enabled) return;
	const time = millitime();
	const perflog = wpStack[wpStack.length - 1];
	if (!perflog || perflog.name !== widgetName) {
		Errors.report("Inconsistent widget performance stack", wpStack);
		return;
	}
	wpStack.pop();
	DOL.Perflog.logWidgetTime(widgetName, time - perflog.t0, perflog.i);
	if (DOL.Perflog.self) {
		const selfDt = millitime() - time;
		wpSelf.n++;
		wpSelf.own += selfDt;
		wpSelf.total += selfDt;
	}
};

/**
 * Returns a "nice" string representation of a number without too much decimal digits.
 *
 * @param {number} x
 */
function niceround(x) {
	if (Math.floor(x) === x) return x; // Integers
	if (x > -1 && x < 1) {
		// Small number, round to 0.001 instead
		return Math.round(x * 1000) / 1000;
	}
	return Math.round(x * 10) / 10;
}
/**
 * Return performance report. Can be viewed by DevTools table() function.
 *
 * Returns array of objects:
 *  `name`: Widget name
 *  `n`: Times widget called
 *  `total`: Sum of widget execution time, including inner widgets, ms
 *  `own`: Sum of widget execution time, excluding inner widgets, ms
 *  `totalp1`: Average widget execution time, including inner widgets, ms
 *  `ownp1`: Average widget execution time, excluding inner widgets, ms
 *  `npp`: Average time widget called per passage
 *  `totalpp`: Average total time per passage
 *  `ownpp`: Average own time per passage
 *
 * @param {object} options
 * @param {string} [options.sort='total'] Property to sort entries by
 * @param {number} [options.limit=20] Max number of entries to report, 0 to no limit
 * @param {boolean} [options.global=true] Report widgets from all recorded history or from last passage only.
 * @param {boolean} [options.round=true] Round to 0.1 precision
 * @param {string} [options.filter=null] A regular expression pattern that will be used to filter widgets
 */
DOL.Perflog.report = function (options) {
	options = Object.assign(
		{
			sort: "own",
			limit: 20,
			global: true,
			round: true,
			filter: null,
		},
		options
	);
	const numfn = options.round ? niceround : x => x;
	let entries;
	if (options.global) {
		const np = DOL.Perflog.nPassages;
		// Add 'per passage' metrics
		entries = Object.values(DOL.Perflog.globalRec).map(e => ({
			name: e.name,
			n: e.n,
			total: numfn(e.total),
			own: numfn(e.own),
			npp: numfn(e.n / np),
			totalpp: numfn(e.total / np),
			ownpp: numfn(e.own / np),
			totalp1: numfn(e.total / e.n),
			ownp1: numfn(e.own / e.n),
		}));
	} else {
		entries = Object.values(DOL.Perflog.lastRec).map(e => ({
			name: e.name,
			n: e.n,
			total: numfn(e.total),
			own: numfn(e.own),
			totalp1: numfn(e.total / e.n),
			ownp1: numfn(e.own / e.n),
		}));
	}
	if (options.filter) {
		const matcher = new RegExp(options.filter);
		entries = entries.filter(x => typeof x.name === "string" && matcher.test(x.name));
	}
	let comparator;
	const sort = options.sort;
	switch (sort) {
		case "own":
		case "total":
		case "n":
		case "npp":
		case "ownpp":
		case "totalpp":
		case "totalp1":
		case "ownp1":
			comparator = (a, b) => b[sort] - a[sort];
			break;
		case "name":
		default:
			comparator = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? +1 : 0);
	}
	entries.sort(comparator);
	if (options.limit > 0 && entries.length > options.limit) entries.splice(options.limit);
	return entries;
};
