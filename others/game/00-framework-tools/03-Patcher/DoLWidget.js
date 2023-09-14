/* eslint-disable jsdoc/require-description-complete-sentence */
/**
 * Provides a magic variable `$_` that creates a custom scope for the current
 * widget invocation
 *
 * NOTE: we basically steal sugarcube code as code reuse is more difficult
 * than it's worth in this instance. Be advised that updating sugarcube
 * may break this
 */
const VIRTUAL_CURRENT = "_";
const vStack = [];
const vContext = [];
const d = JSON.stringify.bind(JSON);
const devOptions = {
	trace: false,
	invocationId: false,
};
$(document).one(":storyready", function () {
	State.variables.devOptions = devOptions;
});
// We declare some global debug utils that other code is free to use
// Note that enabling trace will display all widget calls
// Note that clog is currently non-configured and will always be invoked
// TODO: add more granular debug log levels if needed
function clog() {
	console.log(`${State.passage}:${d(vContext)}`, ...arguments);
}

function trace() {
	if (devOptions.trace) {
		clog(...arguments);
	}
}

function allMagical() {
	return Object.keys(State.variables).filter(key => key.startsWith(VIRTUAL_CURRENT) && key !== VIRTUAL_CURRENT);
}

// eslint-disable-next-line no-unused-vars
const uniqueInvocation = 0;

Macro.delete("widget");
Macro.add("widget", {
	tags: null,

	handler() {
		if (this.args.length === 0) {
			return this.error("no widget name specified");
		}

		const widgetName = this.args[0];
		const isNonVoid = this.args.length > 1 && this.args[1] === "container";

		if (Macro.has(widgetName)) {
			if (!Macro.get(widgetName).isWidget) {
				return this.error(`cannot clobber existing macro "${widgetName}"`);
			}

			// Delete the existing widget.
			Macro.delete(widgetName);

			// Throw an error to alert devs if they've redefined an existing widget (they should definitely not fail to see this while testing.)
			return this.error(`The "${widgetName}" widget is being defined twice`);
		}

		try {
			const widgetDef = {
				isWidget: true,
				handler: (function (widgetCode) {
					return function () {
						// Custom code
						DOL.Stack.push(widgetName);
						DOL.Perflog.logWidgetStart(widgetName);
						const newFrame = {};
						State.variables[VIRTUAL_CURRENT] = newFrame;
						vStack.push(newFrame);
						/**
						 * place the previous invocation's magical objects on the stack
						 * It's an error if the prior frame doesn't exist
						 *  note: that would mean the $_var was defined in the body,
						 *  as we clean our local magic variables
						 */
						const priorFrame = vStack[vStack.length - 2];
						const magicals = allMagical();
						if (magicals.length > 0) {
							trace(`saving ${d(magicals)} to ${d(priorFrame)}`);
						}
						if (priorFrame !== undefined) {
							magicals.forEach(key => {
								priorFrame[key] = State.variables[key];
								delete State.variables[key];
							});
						} else if (magicals.length > 0) {
							console.warn(`Found variables: ${JSON.stringify(magicals)} declared in :: ${State.passage}`);
						}
						// End custom code

						const shadowStore = {};

						// Cache the existing value of the `_args` variable, if necessary.
						if (Object.hasOwn(State.temporary, "args")) {
							shadowStore._args = State.temporary.args;
						}

						// Set up the widget `_args` variable and add a shadow.
						State.temporary.args = [...this.args];
						State.temporary.args.raw = this.args.raw;
						State.temporary.args.full = this.args.full;
						this.addShadow("_args");

						if (isNonVoid) {
							// Cache the existing value of the `_contents` variable, if necessary.
							if (Object.hasOwn(State.temporary, "contents")) {
								shadowStore._contents = State.temporary.contents;
							}

							// Set up the widget `_contents` variable and add a shadow.
							State.temporary.contents = this.payload[0].contents;
							this.addShadow("_contents");
						}

						/* legacy */
						// Cache the existing value of the `$args` variable, if necessary.
						if (Object.hasOwn(State.variables, "args")) {
							shadowStore.$args = State.variables.args;
						}

						// Set up the widget `$args` variable and add a shadow.
						State.variables.args = State.temporary.args;
						this.addShadow("$args");
						/* /legacy */

						try {
							// Set up the error trapping variables.
							const errList = [];

							// Wikify the widget's code.
							const resFrag = Wikifier.wikifyEval(widgetCode.replace(/^\n+|\n+$/g, "").replace(/\n+/g, " "));

							// Carry over the output, unless there were errors.
							Array.from(resFrag.querySelectorAll(".error")).forEach(errEl => {
								errList.push(errEl.textContent);
							});

							if (errList.length === 0) {
								this.output.appendChild(resFrag);
							} else {
								console.error(`Error rendering widget ${widgetName}`, errList);
								return this.error(`error${errList.length > 1 ? "s" : ""} within widget code (${errList.join("; ")})`);
							}
						} catch (ex) {
							return this.error(`cannot execute widget: ${ex.message}`);
						} finally {
							// Custom code
							DOL.Stack.pop();
							vStack.pop();
							vContext.pop();
							State.variables[VIRTUAL_CURRENT] = priorFrame;
							const magicals = allMagical();
							if (magicals.length > 0) {
								trace(`cleaning up ${d(magicals)}`);
								magicals.forEach(key => {
									// don't pollute the global namespace
									delete State.variables[key];
								});
							}
							if (priorFrame !== undefined && Object.keys(priorFrame).length > 0) {
								trace(`restoring ${d(priorFrame)}`);
								// restore prior frame
								Object.assign(State.variables, priorFrame);
							}
							DOL.Perflog.logWidgetEnd(widgetName);
							// End custom code

							// Revert the `_args` variable shadowing.
							if (Object.hasOwn(shadowStore, "_args")) {
								State.temporary.args = shadowStore._args;
							} else {
								delete State.temporary.args;
							}

							if (isNonVoid) {
								// Revert the `_contents` variable shadowing.
								if (Object.hasOwn(shadowStore, "_contents")) {
									State.temporary.contents = shadowStore._contents;
								} else {
									delete State.temporary.contents;
								}
							}

							/* legacy */
							// Revert the `$args` variable shadowing.
							if (Object.hasOwn(shadowStore, "$args")) {
								State.variables.args = shadowStore.$args;
							} else {
								delete State.variables.args;
							}
							/* /legacy */
						}
					};
				})(this.payload[0].contents),
			};

			if (isNonVoid) {
				widgetDef.tags = [];
			}

			Macro.add(widgetName, widgetDef);

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden: true });
			}
		} catch (ex) {
			return this.error(`cannot create widget macro "${widgetName}": ${ex.message}`);
		}
	},
});
