const INDEX_URL =
	'https://raw.githubusercontent.com/pandacover/portfolio-projects-index/main/README.md';

const MAX_SUMMARY_LENGTH = 220;

export interface Project {
	name: string;
	url: string;
	summary: string | null;
}

function summarizeReadme(readme: string): string {
	// Remove code blocks (content between ```)
	let text = readme.replace(/```[\s\S]*?```/g, '');
	// Remove inline code
	text = text.replace(/`[^`]+`/g, '');
	// Remove headings
	text = text.replace(/^#{1,6}\s+.+$/gm, '');
	// Remove links but keep text: [text](url) -> text
	text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
	// Collapse whitespace and newlines
	text = text.replace(/\s+/g, ' ').trim();
	// Take first sentence(s) up to max length
	const truncated = text.length > MAX_SUMMARY_LENGTH
		? text.slice(0, MAX_SUMMARY_LENGTH).replace(/\s+\S*$/, '') + '…'
		: text;
	return truncated || '';
}

function toRawUrl(githubUrl: string): string {
	// https://github.com/owner/repo/blob/main/README.md -> https://raw.githubusercontent.com/owner/repo/main/README.md
	const match = githubUrl.match(/github\.com\/([^/]+\/[^/]+)\/blob\/([^/]+)\/(.+)/);
	if (!match) return githubUrl;
	const [, repo, branch, path] = match;
	return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
}

function extractNameFromUrl(url: string): string {
	// https://github.com/pandacover/local-rag/blob/main/README.md -> local-rag
	const match = url.match(/github\.com\/[^/]+\/([^/]+)\//);
	return match ? match[1] : url;
}

export async function getProjects(): Promise<Project[]> {
	const res = await fetch(INDEX_URL);
	if (!res.ok) return [];

	const text = await res.text();
	const urls = text
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.startsWith('https://github.com'));

	const projects: Project[] = [];

	for (const url of urls) {
		const rawUrl = toRawUrl(url);
		const readmeRes = await fetch(rawUrl);
		let readme: string | null = null;

		if (readmeRes.ok) {
			readme = await readmeRes.text();
		}

		projects.push({
			name: extractNameFromUrl(url),
			url: url.replace(/\/blob\/main\/README\.md$/, ''),
			summary: readme ? summarizeReadme(readme) : null,
		});
	}

	return projects;
}
