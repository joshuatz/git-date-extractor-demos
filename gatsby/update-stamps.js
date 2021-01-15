/**
 * @file This file could be replaced with a single-line shell command, but that is a little unwieldy due to file paths and the number of options
 */

// @ts-check
const gitDateExtractor = require('git-date-extractor');
let filenames = process.argv.slice(2);

// Normally, you would not have to do this - this is only because I'm using a multi-project setup, with a single git root, so filenames passed via `git diff` are prefixed with the root dir, which I want to remove
filenames = filenames.map((f) => f.replace(/^gatsby\//, ''));

const updater = async () => {
	if (filenames.length) {
		const res = await gitDateExtractor.getStamps({
			debug: true,
			files: filenames,
			onlyIn: ['src/posts'],
			outputToFile: true,
			outputFileName: 'timestamps.json',
			gitCommitHook: 'pre',
		});
	}
};

updater().then(() => {
	process.exit(0);
});
