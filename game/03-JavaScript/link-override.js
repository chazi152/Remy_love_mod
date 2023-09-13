/*	allow forced redirection on link click
 *	when `V.nextPassage` is set, all links to other passages will lead to the one specified by it
 *	code within the links will not be executed
 *	the varible is unset before the next passage is rendered */
Macro.delete(["button", "link"]);
Macro.add(["button", "link"], {
	isAsync: true,
	tags: null,

	handler() {
		if (this.args.length === 0) {
			return this.error(`no ${this.name === "button" ? "button" : "link"} text specified`);
		}

		const $link = jQuery(document.createElement(this.name === "button" ? "button" : "a"));
		let passage;

		if (typeof this.args[0] === "object") {
			if (this.args[0].isImage) {
				// Argument was in wiki image syntax.
				const $image = jQuery(document.createElement("img")).attr("src", this.args[0].source).appendTo($link);

				if (Object.hasOwn(this.args[0], "passage")) {
					$image.attr("data-passage", this.args[0].passage);
				}

				if (Object.hasOwn(this.args[0], "title")) {
					$image.attr("title", this.args[0].title);
				}

				if (Object.hasOwn(this.args[0], "align")) {
					$image.attr("align", this.args[0].align);
				}

				passage = this.args[0].link;
			} else {
				// Argument was in wiki link syntax.
				$link.append(document.createTextNode(this.args[0].text));
				passage = this.args[0].link;
			}
		} else {
			// Argument was simply the link text.
			$link.wikiWithOptions({ profile: "core" }, this.args[0]);
			passage = this.args.length > 1 ? this.args[1] : undefined;
		}

		if (passage != null) {
			// lazy equality for null
			$link.attr("data-passage", passage);

			if (Story.has(passage)) {
				$link.addClass("link-internal");
				T.link = true;

				if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
					$link.addClass("link-visited");
				}
			} else {
				$link.addClass("link-broken");
			}
		} else {
			$link.addClass("link-internal");
		}

		$link
			.addClass(`macro-${this.name}`)
			.ariaClick(
				{
					namespace: ".macros",
					one: passage != null, // lazy equality for null
				},
				this.createShadowWrapper(
					this.payload[0].contents !== ""
						? /* don't execute linked code unless they don't lead to another passage (menus, etc) */
						  () => {
								if (!(passage && V.nextPassage)) {
									window.ironmanFlag = true;
									Wikifier.wikifyEval(this.payload[0].contents.trim());
									delete window.ironmanFlag;
								}
						  }
						: null,
					passage != null // lazy equality for null
						? () => {
								// check V.nextPassage and redirect all links to it if present
								if (V.nextPassage) {
									V.nextPassageIntended = passage;
									passage = V.nextPassage;
									delete V.nextPassage;
								}
								// save sidebar scrolling position
								const target = document.querySelector("#storyCaptionDiv");
								window.scrollUIBar = target ? target.scrollTop : null;
								// if passage hasn't changed (i.e. during combat), store scrolling position
								window.scrollMain = document.scrollingElement.scrollTop;
								// finally, play the passage
								Engine.play(passage);
						  }
						: null
				)
			)
			.appendTo(this.output);
	},
});

/* required change is within Wikifier class, but since redefining it entirely would not be feasible,
 * we have to redirect `Wikifier.createInternalLink` to a local modified version
 * ideally, this should be handled within sugarcube itself */
Wikifier.Parser.delete("link");
Wikifier.Parser.add({
	name: "link",
	profiles: ["core"],
	match: "\\[\\[[^[]",

	handler(w) {
		const markup = Wikifier.helpers.parseSquareBracketedMarkup(w);

		if (Object.hasOwn(markup, "error")) {
			w.outputText(w.output, w.matchStart, w.nextMatch);
			return;
		}

		w.nextMatch = markup.pos;

		// text=(text), forceInternal=(~), link=link, setter=(setter)
		const link = Wikifier.helpers.evalPassageId(markup.link);
		const text = Object.hasOwn(markup, "text") ? Wikifier.helpers.evalText(markup.text) : link;
		const setFn = Object.hasOwn(markup, "setter") ? Wikifier.helpers.createShadowSetterCallback(Scripting.parse(markup.setter)) : null;

		// Debug view setup.
		const output = (Config.debug ? new DebugView(w.output, "link-markup", "[[link]]", w.source.slice(w.matchStart, w.nextMatch)) : w).output;

		if (markup.forceInternal || !Wikifier.isExternalLink(link)) {
			/* Wikifier.createInternalLink(output, link, text, setFn); */
			/* replace with a local version */
			createInternalLink(output, link, text, setFn);
		} else {
			Wikifier.createExternalLink(output, link, text);
		}
	},
});

function createInternalLink(destination, passage, text, callback) {
	const $link = jQuery(document.createElement("a"));

	if (passage != null) {
		// lazy equality for null
		$link.attr("data-passage", passage);

		if (Story.has(passage)) {
			$link.addClass("link-internal");

			if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
				$link.addClass("link-visited");
			}
		} else {
			$link.addClass("link-broken");
		}

		$link.ariaClick({ one: true }, () => {
			if (typeof callback === "function") {
				callback();
			}
			// check V.nextPassage and redirect all links to it if present
			if (V.nextPassage) {
				V.nextPassageIntended = passage;
				passage = V.nextPassage;
				delete V.nextPassage;
			}
			// save sidebar scrolling position
			window.scrollUIBar = document.querySelector("#storyCaptionDiv").scrollTop;
			// if passage hasn't changed (i.e. during combat), store scrolling position
			window.scrollMain = V.passage === V.passagePrev ? document.scrollingElement.scrollTop : 0;
			Engine.play(passage);
		});
	}

	if (text) {
		$link.append(document.createTextNode(text));
	}

	if (destination) {
		$link.appendTo(destination);
	}

	// For legacy-compatibility we must return the DOM node.
	return $link[0];
}
