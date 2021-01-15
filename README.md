# Git-Date-Extractor: Demos
> Sample projects that use [the Git-Date-Extractor tool](https://github.com/joshuatz/git-date-extractor) (GDE) for different use-cases

## Build-Time Extraction vs Local Extraction Cache
Before getting into the demo(s):

A design decision to make when using this tool is at what point is it supposed to run, and where are the results being stored? 

### Build-Time Extraction
Some developers might desire to only use this tool at "build-time", extracting the timestamps and temporarily storing them in the build environment to be used as part of the compilation process. On one hand, this means no relying on git hooks and local dev environments for git date extraction.

However, on the other hand there is a strong tendency for that approach to be extremely problematic, as many build environments (such as *Vercel*) ***do not checkout a full git history*** - they use ***shallow*** clones. This (understandably) defeats the purpose of my tool, and I've written up a more thorough explanation [in issue #7](https://github.com/joshuatz/git-date-extractor/issues/7#issuecomment-682298968).

### Local Extraction Caching
Since, as I've discussed above, extracting git history in a separate environment can be problematic, especially if it is on a build server, I prefer the alternative approach of extracting the values locally. My preferred setup is to do this automatically, as a `pre-commit` git hook, and cache all the timestamps as a `JSON` file that gets checked into git.

In fact, GDE [has a special argument](https://github.com/joshuatz/git-date-extractor/tree/main#automating-the-check-in-of-the-timestamp-file-into-version-control-git-add) to make this even more seamless; if you call it with `gitCommitHook` set to `pre` and/or `outputFileGitAdd` to `true`, it will automatically `git add` the timestamp file and stage it.

There are an almost endless number of ways to configure this, but if you want a fast extraction time that only checks files that have been changed as part of each commit, you would need to use something like:

```bash
#!/bin/bash
git diff --cached --name-only --diff-filter=ACMRTUXB -z | xargs -0 git-date-extractor {...}
# ... = all the rest of the GDE arguments you want to use
```

> For the most up-to-date command, [see the official README](https://github.com/joshuatz/git-date-extractor/tree/main#automating-the-check-in-of-the-timestamp-file-into-version-control-git-add)

## Demos
Right now, the only demo I've built out is for Gatsby, but it could easily be extended to other static site generators, documentation systems, etc.

### Gatsby Demo
> Source code: [`/gatsby` directory](./gatsby)

Here are the crucial pieces of the Gatsby demo:

- **GDE**: Git-Date-Extractor is a *dev* dependency. Alternative, it could be installed globally, but this would not be advised for a shared repo
- **Git Hook**: Husky pre-commit git hook that updates `timestamps.json` with git-based file timestamps, whenever Markdown files are created or updated
	- See [my package.json file](./gatsby/package.json)
- **Modified [`gatsby-node` file](./gatsby/gatsby-node.js)**:
	- This is the main entry-point for modifying nodes, creating pages, and injecting data within the Gatsby eco-system
		- TLDR: [see Docs: Tutorial Part #7](https://www.gatsbyjs.com/docs/tutorial/part-seven/)
	- My basic setup is: Iterate over all markdown nodes, grab the file path, check my `timestamps.json` for cached date values, and then inject the date values as *node fields*, which will be later retrievable via GraphQL and injected into the generated static pages
		- All that logic is [done directly in `gatsby-node.js`](./gatsby/gatsby-node.js)
- **GraphQL Integration**: Once the values have been injected via gatsby-node, I can retrieve them inside page templates and display the values
	- In my demo, I pass around the timestamps as `ms` (int), and then render with a simple: `new Date(timestampMs).toLocaleString()`
	- See [page template: `markdown.js`](./gatsby/src/templates/markdown.js)

And here is how to test this setup for yourself:

1. Clone the repo, `cd gatsby`, `npm`
2. Add a new Markdown file to `/posts`
3. Stage the new markdown file, and then try to `git commit`
	- You should see the git commit hook automatically update `timestamps.json`
	- After the change has been committed and the timestamps file updated, future builds of the site will include the post with the extracted timestamps

> Warning: some of my setup for the demo is more complicated than it normally is, because of how I have nested gatsby in a sub-directory. Normally, you run GDE in the "root" of your git directory, which would also be where your `package.json` file is, not in a subdirectory.