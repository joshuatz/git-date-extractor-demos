import * as React from 'react';
import Layout from '../components/layout';

export const MarkdownPage = ({ data }) => {
	const mdNode = data.markdownRemark;
	const { fields, html, frontmatter } = mdNode;
	return (
		<Layout>
			<div>
				<h1>{frontmatter.title}</h1>
				{/* Raw Markdown Content */}
				<div dangerouslySetInnerHTML={{ __html: html }} />

				{/* Here is the injected metadata */}
				<div className="row">
					<div className="col-xs-12 col-sm-6 field">
						<div className="key">File Created:</div>
						<div className="val">
							{new Date(fields.createdMs).toLocaleString()}
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 field">
						<div className="key">Last Modified:</div>
						<div className="val">
							{new Date(fields.modifiedMs).toLocaleString()}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const query = graphql`
	query($slug: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }) {
			html
			frontmatter {
				title
			}
			fields {
				modifiedMs
				createdMs
				slug
			}
		}
	}
`;

export default MarkdownPage;
