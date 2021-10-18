export const defaults: ApiSettings = {
	enterprise: false,
	filesPreview: true,
	hideRegExp: `
		^\\.
		^license
		^cname$
		^version$
		^(patents|authors|contributors|acknowledgments|backers)(\\.|$)
		^(issue|pull_request)_template\\.md$
		^(appveyor|circle|codecov)\\.yml$
		^(yarn|Gemfile|Cargo|composer)\\.lock$
		^package-lock\\.json$
		^npm-shrinkwrap\\.json$
		\\.sublime-project$
		^(tsconfig|typings|tslint|tsfmt)\\.json$
		^coffeelint\\.json$
		^(karma|protractor|sauce).*\\.js$
		^testem(\\.[\\w-]+)?\\.(json|js)$
		^yuidoc\\.json$
		^stylelint-config\\.json$
		^humans\\.txt$
		^readme\\.md$
	`
		.replace(/\n\t+/g, "\n")
		.trim(),
};

export const storage: ApiStorage = {
	async get(): Promise<ApiSettings> {
		return new Promise((resolve) => {
			chrome.storage.sync.get(defaults, (options) => {
				resolve(options as ApiSettings);
			});
		});
	},
	set(object: ApiSettings): void {
		chrome.storage.sync.set(object);
	},
};
