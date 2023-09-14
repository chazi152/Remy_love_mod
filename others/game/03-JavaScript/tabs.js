const Tab = class {
	constructor(element, selectedClass) {
		this.element = element;
		this.selectedClass = selectedClass;
		this.activeTab = -1;
		this.setupTabs();
	}

	setupTabs() {
		$(() => {
			this.tabs = $("#" + this.element).find("button");
		});
	}

	setActive(index = 0) {
		$(() => {
			if (index === -1) return;
			this.activeTab = index;
			this.toggle(this.tabs.eq(index));
		});
	}

	toggle(target = $(window.event.currentTarget)) {
		this.reset();
		this.activeTab = this.tabs.index(target);
		target.addClass(this.selectedClass);
	}

	reset() {
		this.activeTab = -1;
		this.tabs.removeClass(this.selectedClass);
	}
};
window.Tab = Tab;
