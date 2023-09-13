/* eslint-disable no-undef, jsdoc/require-description-complete-sentence */
/**
 * Adds the macros <<condition>> and <<compute>>.
 *
 * <<condition>> is a combination of <<widget>> and <<if>>. You define it like a <<widget>>,
 * but its body is a condition like in <<if>>. Example:
 *
 * <<condition "afternoon">>
 *   Time.hour gt 14 and Time.hour lt 18
 * <</condition>>
 *
 * Later you can use your new condition like this:
 *
 * <<afternoon>>
 *   It is time for tea!
 * <</afternoon>>
 *
 * The condition tag optionally takes more parameters:
 *
 * <<afternoon and not $minute is 0>>
 *   v- those are the same -^
 * <<afternoon not $minute is 0>>
 *
 * <<afternoon not>> would invert the condition.
 *
 * The condition can also be used in other code, there the prefix "C." is needed:
 *
 * <<if C.afternoon>>more tea<</if>>
 *
 *
 * <<compute>> works nearly the same, but it doesn't create a macro, only the
 * "C." value. It can also be used for non-condition definitions, e.g.:
 *
 * <<compute "time">>
 *   (Time.hour / 24 * 10) + ":" + ($minute / 60 * 100)
 * <</time>>
 *
 * For hardcore recolutionists it is <<= C.time >> o'decimal'clock.
 *
 */

Macro.add(["condition", "compute"], {
	tags: null,
	handler() {
		if (this.args.length === 0) {
			return this.error("no condition name specified");
		}
		if (this.args.length > 1) {
			return this.error("too many parameters specified");
		}

		const widgetName = this.args[0];

		if (Object.hasOwn(CU, widgetName)) {
			return this.error(`cannot clobber existing definition "${widgetName}"`);
		}

		Object.defineProperty(CU, widgetName, {
			get: () => {
				return Scripting.evalTwineScript(this.payload[0].contents.trim());
			},
		});
		if (this.payload[0].name === "condition") {
			if (Macro.has(widgetName)) {
				return this.error(`cannot clobber existing macro "${widgetName}"`);
			}

			Macro.add(widgetName, {
				isWidget: true,
				skipArgs: true,
				tags: null,
				condend: /[|&!<=>]\s*$/,
				condstart: /^\s*(\|\||&&)(.+)$/i,
				handler: (function (widgetName) {
					return function () {
						try {
							let result;
							if (this.args.full.length > 0) {
								let prefix = this.args.full;
								const match = this.self.condstart.exec(prefix);
								if (match) {
									prefix = match[2] + match[1];
								} else if (!this.self.condend.test(prefix)) {
									prefix += "&&";
								}
								result = Scripting.evalJavaScript(prefix + "CU." + widgetName);
							} else {
								result = CU[widgetName];
							}
							if (result) {
								this.output = Wikifier.wikifyEval(this.payload[0].contents);
							}
						} catch (ex) {
							return this.error(`bad conditional expression in <<condition "${widgetName}">>: ${typeof ex === "object" ? ex.message : ex}`);
						}
					};
				})(widgetName),
			});
		}
	},
});
