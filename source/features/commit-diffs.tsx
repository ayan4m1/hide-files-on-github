import select from "select-dom";

type FileStats = {
	fileName: string;
	added: number;
	removed: number;
};

type LineCountStats = {
	totalAdded: number;
	totalRemoved: number;
};

const parseLineCount = (elem: HTMLElement): number =>
	parseInt(elem.innerText.trim().replace(/[+−,]/g, ""), 10);
const parseStats = (elem: HTMLElement): FileStats | null => {
	const fileName = select(".description", elem)?.innerText?.trim?.();
	const statElem = select("div.select-menu-item-text > .diffstat", elem);

	if (!fileName || !statElem) {
		return null;
	}

	const [added, removed] = [
		select(".color-text-success", statElem),
		select(".color-text-danger", statElem),
	];

	if (!added || !removed) {
		return null;
	}

	const result: FileStats = {
		fileName,
		added: parseLineCount(added),
		removed: parseLineCount(removed),
	};

	return result;
};
const truthy = (item: any) => Boolean(item);

export default class CommitDiffsFeature implements Feature {
	hideRegExp: RegExp;

	constructor(settings: ApiSettings) {
		console.log("Initializing Commit Diffs...");
		this.hideRegExp = new RegExp(settings.hideRegExp.replace(/\n+/g, "|"), "i");
		this.update = this.update.bind(this);
	}

	get selector() {
		return "details.toc-select.diffbar-item > details-menu include-fragment";
	}

	update(): void {
		// this is the "Jump to" dropdown container
		const detailsElem = select("details.toc-select.diffbar-item");

		if (!detailsElem) {
			return;
		}

		// trigger mouseover on the <details> element, which will trigger server fetch for dropdown results
		detailsElem.dispatchEvent(new MouseEvent("mouseover"));

		// get the root of the dropdown menu
		const menu = select("details.toc-select.diffbar-item > details-menu");

		if (!menu) {
			return;
		}

		// get each item in the dropdown menu
		const items = select.all(
			'div.select-menu-list > [data-filterable-for="files-changed-filter-field"] > a.select-menu-item',
			menu
		);

		if (!items?.length) {
			return;
		}

		const initialState: LineCountStats = {
			totalAdded: 0,
			totalRemoved: 0,
		};
		const { totalAdded, totalRemoved } = items
			.map(parseStats)
			.filter((stats: FileStats | null): boolean => {
				return Boolean(stats) && this.hideRegExp.test(stats!.fileName);
			})
			.filter(truthy)
			.reduce<LineCountStats>(
				(result: LineCountStats, stats: FileStats | null) => {
					const newResult: LineCountStats = {
						totalAdded: result.totalAdded + (stats?.added ?? 0),
						totalRemoved: result.totalRemoved + (stats?.removed ?? 0),
					};

					return newResult;
				},
				initialState
			);

		const statElem = select("#diffstat");
		const [addElem, removeElem, tooltip] = [
			select(".color-text-success", statElem),
			select(".color-text-danger", statElem),
			select(".tooltipped", statElem),
		];
		
		if (!addElem || !removeElem || !tooltip) {
			return;
		}

		const newAdded = parseLineCount(addElem) - totalAdded;

		addElem.innerText = ` +${newAdded.toLocaleString()} `;
		const newRemoved = parseLineCount(removeElem) - totalRemoved;

		removeElem.innerText = ` −${newRemoved.toLocaleString()} `;
		const totalChanged = newAdded + newRemoved;

		tooltip.setAttribute(
			"aria-label",
			`${totalChanged.toLocaleString()} lines changed`
		);
	}
}
