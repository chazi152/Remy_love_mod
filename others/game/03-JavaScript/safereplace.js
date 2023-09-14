/* Adds a safety-net replace macro-pair to fix problems with <<replace>> */
Macro.add("safereplace", {
	tags: null,
	handler() {
		if (this.args.length === 0) {
			return this.error("no selector specified");
		}
		const target = document.querySelector(this.args[0]);
		if (target === null) return;
		Wikifier.wikifyEval(`<<replace ${this.args[0]}>>${this.payload[0].contents}<</replace>>`);
	},
});
