export default {
	"*.{js,cjs}": filenames => `eslint --cache --fix "${filenames.join('" "')}"`,
	"*.css": "stylelint --fix",
	// Format other files with Prettier
	"!(*.{js,cjs,css})": "prettier --ignore-unknown --write",
};
