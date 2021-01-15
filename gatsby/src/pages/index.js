import * as React from 'react';
import { graphql, Link } from 'gatsby';

// styles
const pageStyles = {
	color: '#232129',
	padding: '96px',
	fontFamily: '-apple-system, Roboto, sans-serif, serif',
};
const headingStyles = {
	marginTop: 0,
	marginBottom: 64,
	maxWidth: 320,
};

// markup
const IndexPage = ({
	data: {
		allMarkdownRemark: { edges },
	},
}) => {
	const sortedPosts = edges
		.map((e) => e.node)
		.sort((a, b) => a.fields.createdMs - b.fields.createdMs);
	const postLinks = sortedPosts.map((n) => (
		<li key={n.id}>
			<Link to={n.fields.slug}>{n.frontmatter.title}</Link>
		</li>
	));

	return (
		<main style={pageStyles}>
			<title>Home Page</title>
			<h1 style={headingStyles}>Home Page</h1>
			<ul>{postLinks}</ul>
		</main>
	);
};

export const postQuery = graphql`
	query {
		allMarkdownRemark {
			edges {
				node {
					id
					frontmatter {
						title
					}
					fields {
						slug
						createdMs
						modifiedMs
					}
				}
			}
		}
	}
`;

export default IndexPage;
