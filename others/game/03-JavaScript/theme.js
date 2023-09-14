// eslint-disable-next-line no-var, no-unused-vars
var ThemeManager = (() => {
	/** @typedef {"dark" | "light" | "system-default"} ColorPreference */

	const STORAGE_KEY = "dolTheme";

	/** @type {MediaQueryList} */
	let isDarkPreferredQuery;

	/**
	 *  @returns {ColorPreference}
	 */
	function getPreference() {
		return localStorage.getItem(STORAGE_KEY) || "system-default";
	}

	/**
	 * @param {ColorPreference} preference
	 */
	function setPreference(preference) {
		localStorage.setItem(STORAGE_KEY, preference);
		reflectPreference(preference);
	}

	/**
	 * Applies theme by setting `html` element data attribute.
	 *
	 * @param {"dark" | "light"} theme
	 */
	function setTheme(theme) {
		document.firstElementChild.setAttribute("data-theme", theme);
	}

	function onThemeChange({ matches: isDark }) {
		setTheme(isDark ? "dark" : "light");
	}

	/**
	 * Applies color preference as theme.
	 *
	 * @param {ColorPreference} preference
	 */
	function reflectPreference(preference) {
		let theme;

		if (preference === "system-default") {
			if (isDarkPreferredQuery) {
				isDarkPreferredQuery.removeEventListener("change", onThemeChange);
			}

			isDarkPreferredQuery = window.matchMedia("(prefers-color-scheme: dark)");

			theme = isDarkPreferredQuery.matches ? "dark" : "light";
			// Watch for color preference changes
			if (typeof isDarkPreferredQuery.addEventListener === "function") {
				isDarkPreferredQuery.addEventListener("change", onThemeChange);
			} else {
				/* For Safari 13 and below. */
				isDarkPreferredQuery.addListener(onThemeChange);
			}
		} else {
			theme = preference;
		}

		setTheme(theme);
	}

	// Set early so no page flashes
	reflectPreference(getPreference());

	window.Theme = {
		initControl() {
			$(document).ready(() => {
				$(`input[name=theme][value="${getPreference()}"]`).prop("checked", true);

				$("input[name=theme]").on("change", event => {
					setPreference(event.currentTarget.value);
				});
			});
		},
	};
})();
