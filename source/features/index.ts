import { defaults } from "../api";
import CommitDiffsFeature from "./commit-diffs";
import FileBrowserFeature from "./file-browser";

export default (settings: ApiSettings): Array<Feature> => {
	const mergedSettings = {
		...settings,
		...defaults,
	};

	return Array.from(
		[FileBrowserFeature, CommitDiffsFeature].map(
			(Feature) => new Feature(mergedSettings)
		)
	);
};