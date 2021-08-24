import select from "select-dom";
import elementReady from "element-ready";

import { storage } from "./api";
import configureFeatures from "./features";

const bind = (selector: string, update: MutationCallback): void => {
	const ajaxFiles = select(selector);

	if (!ajaxFiles) {
		return;
	}

	const observer = new MutationObserver(update);
	observer.observe(ajaxFiles.parentNode!, {
		childList: true,
	});
};

export async function init(): Promise<void> {
	// initialize features
	const features: Array<Feature> = configureFeatures(await storage.get());

  // wait for files to exist on page
	await elementReady('[aria-labelledby="files"]');

  // bind and update each feature
	for (const { update, selector } of features) {
    bind(selector, update);
		update();

		// handle partial page refresh
		document.addEventListener("pjax:end", update);
		document.addEventListener("pjax.end", () => bind(selector, update));
	}
}

init();
