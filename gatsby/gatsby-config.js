const path = require('path');

module.exports = {
	siteMetadata: {
		title: 'Git-Date-Extractor Gatsby Demo',
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-sitemap',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'pages',
				path: './src/pages/',
			},
			__key: 'pages',
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `posts`,
				path: `./src/posts/`,
			},
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {},
		},
	],
};
