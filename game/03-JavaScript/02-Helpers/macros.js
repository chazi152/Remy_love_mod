/**
 * Jimmy: To be used in Twee files to print an error, where the error container mimics SugarCube's own error handler.
 * 		   Leaving the second argument out will grab a snippet of the code before it, up to 128 characters.
 * 		   Will not trigger the widget handler's error capturing system as it uses a different class (.dol-error instead of .error).
 */
// eslint-disable-next-line no-unused-vars
const ErrorSystem = ((Scripting, Errors) => {
	/**
	 * Retrieve a snippet of the code surrounding the widget's parent, or ancestors. Good for figuring out where an error occurred.
	 *
	 * @param {number} depth A depth of zero indicates to return the callee of `<<error>>`. One would retrieve the parent of that callee. And so on.
	 * @returns {string} The source text of the target, or the source of the last ancestor in the stack.
	 */
	function getTargetSource(depth = 0) {
		/* Always assumed because of the parent of the `<<error>>` macro is where it was called. */
		let callee = this.parent !== null ? this.parent : this;
		for (let index = 0; index < depth; index++) {
			callee = callee.parent !== null ? callee.parent : callee;
		}
		const parser = callee.parser;
		const source = parser.source.slice(0, parser.matchStart).slice(-128);
		return source;
	}

	Macro.add("error", {
		skipArgs: true,
		handler() {
			const exp = this.args.full;
			const result = Scripting.evalJavaScript(exp[0] === "{" ? `(${exp})` : exp);
			let { message, source, depth, exportable, logged } = Object.assign(
				{
					message: "Message not set",
					source: null,
					depth: 0,
					exportable: true,
					logged: true,
				},
				result
			);
			if (source === null) source = getTargetSource.call(this, depth);
			throwError(this.output, message, source, exportable, logged);
		},
	});

	Macro.add("errorp", {
		handler() {
			if (this.args.length < 1) return this.error(`Missing <<errorP>> arguments. ${this.args}`);
			const message = this.args[0];
			const source = this.args[1] || this.parser.source.slice(0, this.parser.matchStart).slice(-128);
			const isExportable = this.args[2] || true;
			const isLogged = this.args[3] || true;
			throwError(this.output, message, source, isExportable, isLogged);
		},
	});

	Macro.add("log", {
		handler() {
			console.log(...this.args);
		},
	});

	/**
	 * DEPRECATED: Time should no longer be able to desynchronise, so this check is unnecessary.
	 *
	 * Jimmy: checkTimeSystem macro to print a message if time desynchronises.
	 *  	   Potential to place time correction code here instead of in backComp.
	 */
	Macro.add("checkTimeSystem", {
		handler() {
			if (V.time !== undefined && V.hour !== undefined && V.minute !== undefined) {
				if (V.time !== V.hour * 60 + V.minute) {
					const message = `$time: ${V.time} desynchronised from $hour: ${V.hour} and $minute: ${V.minute}. Total: ${V.hour * 60 + V.minute}.`;
					const source = `Caught in Passage ${this.args[0]}. ${V.passage}, <<checkTimeSystem>>.`;
					throwError(this.output, message, source);
				}
			} else {
				console.debug(`One of the time variables is not accessible yet: ${V.passage}: ${DOL.Stack}.`);
			}
		},
	});

	/**
	 * Jimmy: defer Macro, to be used to defer execution of the provided contents until after the passage has been processed.
	 * 		   For example, let's say you create <div id="myDiv"></div> in a widget. And you want to use $('#myDiv') in that
	 * 		   same widget, to manipulate your HTML elements... You cannot, as these HTML elements do not actually exist yet.
	 *
	 * 		   This is where <<defer>> comes in, it will hold off on executing $('#myDiv'), if you specify, so that when it does
	 * 		   execute, you can rest assured that your HTML elements are loaded into the document, rather than being in their
	 * 		   fragment.
	 */
	Macro.add("defer", {
		tags: null,
		handler() {
			const handler = this.createShadowWrapper(function () {
				const passage = document.querySelector("#passages .passage");
				if (passage != null) {
					passage.append(Wikifier.wikifyEval(this.payload[0].contents));
				}
			});
			$(document).one(":passageend", function () {
				handler.apply(this, arguments);
			});
		},
	});

	return Object.seal({
		getTargetSource,
	});
})(Scripting, Errors);

// eslint-disable-next-line no-var
var General = ((Macro, SexTypes) => {
	/**
	 * Expand at a later date to include a differentiation between a random grouping, and the currently loaded NPC group.
	 *
	 * @param {number} override
	 */
	function getFluidsFromGroup(override) {
		const sperm = either("semen", "sperm", "cum");
		const id = override || getSexesFromRandomGroup();
		switch (id) {
			case SexTypes.ALL_DICKGIRLS:
				return `${sperm} and milk`;
			case SexTypes.ALL_MALES:
			case SexTypes.ALL_DICKS:
				return sperm;
			case SexTypes.ALL_CUNTBOYS:
			case SexTypes.ALL_VAGINAS:
				return "lewd fluids";
			case SexTypes.ALL_FEMALES:
				return "lewd fluids and milk";
			default:
				return `${sperm}, lewd fluids and milk`;
		}
	}

	function getGooTypes(override) {
		const id = override || getSexesFromRandomGroup();
		switch (id) {
			case SexTypes.ALL_MALES:
			case SexTypes.ALL_DICKS:
				return ["cum"];
			case SexTypes.ALL_CUNTBOYS:
			case SexTypes.ALL_VAGINAS:
			case SexTypes.ALL_FEMALES:
				return ["goo"];
			default:
				return ["both"];
		}
	}

	Macro.add("getfluidsfromgroup", {
		handler() {
			this.output.append(getFluidsFromGroup(...this.args));
		},
	});

	Macro.add("drenchfromgroup", {
		handler() {
			const type = getGooTypes(...this.args)[0];
			Wikifier.wikifyEval(`<<drench ${type} 3 "outside">>`);
		},
	});

	/* Unused for now. */
	Macro.add("fertilisefromgroup", {
		handler() {
			const type = getGooTypes(...this.args)[0];
			if (type === "cum" || type === "both") {
				Wikifier.wikifyEval("<<fertiliseParasites>><<fertiliseParasites 'vagina'>>");
			}
		},
	});

	Macro.add("capitalise2", {
		tags: null,
		handler() {
			if (this.payload[0]) {
				const contents = this.payload[0].contents;
				if (contents) {
					const text = Wikifier.wikifyEval(contents).textContent;
					this.output.append(text.toUpperFirst());
				}
			}
		},
	});

	function linkOverride(map) {
		$(document).one(":passageoverride", function (_, passage) {
			for (const key in map) {
				if (Object.hasOwn(map, key)) {
					const element = map[key];
					if (passage.name === key) {
						passage.name = element;
						return;
					}
				}
			}
		});
	}

	Macro.add("reroute", {
		skipArgs: true,
		handler() {
			const exp = this.args.full;
			const map = Scripting.evalJavaScript(exp[0] === "{" ? `(${exp})` : exp);
			if (typeof map !== "object") {
				throwError(this.output, "Incorrect argument used in <<reroute>>", { exp, map }, false);
				return this.output;
			}
			linkOverride(map);
		},
	});

	return Object.seal({
		getFluidsFromGroup,
		linkOverride,
	});
})(Macro, SexTypes);
window.General = General;
