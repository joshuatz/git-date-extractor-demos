// @ts-check
const { createFilePath } = require('gatsby-source-filesystem');
const path = require('path');
const gdeStamps = require('./timestamps.json');

const posixSlash = (input = '') => {
	return input.split(path.sep).join(path.posix.sep);
};

/**
 * @param {import("gatsby").CreateNodeArgs} onCreateNodeArgs
 */
exports.onCreateNode = ({ node, getNode, actions }) => {
	/** @type {import('gatsby').Node & import('fs').Stats & {absolutePath: string}} */
	const fileNode = getNode(node.parent);

	if (node.internal.type === `MarkdownRemark` && fileNode) {
		// Taking care of slug generation
		// - This is unrelated to GDE - you can do this however you please
		// - I'm taking a shortcut - using directory structure instead of manual slugs in front matter, by using the helper function createFilePath - very nifty :)
		const slug = createFilePath({ node, getNode, basePath: '' });
		actions.createNodeField({
			node,
			name: `slug`,
			value: `/posts${slug}`,
		});

		/**
		 * These initial values are from the filesystem, and are most likely incorrect (which is why I built my tool). We will override these, but initialize to them as fallback values
		 * - Alternatively, you could initialize to null or `""`, and check for valid values in page creation
		 */
		let stamps = {
			createdMs: fileNode.birthtimeMs,
			modifiedMs: fileNode.mtimeMs,
		};

		// Lookup *actual* Git-based creation and modified stamps
		// These values should be locally cached in a JSON file, instead of looking up each time, for each file.
		// My tool uses (by default) POSIX style slashes
		const filePathRelativeToRoot = posixSlash(
			fileNode.absolutePath
		).replace(`${posixSlash(__dirname)}/`, '');

		const stampEntry = gdeStamps[filePathRelativeToRoot];

		if (stampEntry && stampEntry.created) {
			stamps = {
				createdMs: stampEntry.created * 1000,
				modifiedMs: stampEntry.modified * 1000,
			};
		}

		for (const key in stamps) {
			actions.createNodeField({
				node,
				name: key,
				value: stamps[key],
			});
		}
	}
};

/**
 *
 * @param {import('gatsby').CreatePagesArgs} param0
 */
exports.createPages = async ({ graphql, actions }) => {
	const result = await graphql(`
		query {
			allMarkdownRemark {
				edges {
					node {
						id
						fields {
							modifiedMs
							createdMs
							slug
						}
					}
				}
			}
		}
	`);
	const allMdRemarkNodes = result.data.allMarkdownRemark.edges.map(
		(e) => e.node
	);
	allMdRemarkNodes.forEach(async (node) => {
		const { slug } = node.fields;
		actions.createPage({
			path: slug,
			component: path.resolve(`./src/templates/markdown.js`),
			context: {
				id: node.id,
				slug,
			},
		});
	});
};
