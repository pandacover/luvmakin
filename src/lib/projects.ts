const GITHUB_USER = 'pandacover';

/** Pinned repos from https://github.com/pandacover — update when you change pins */
const PINNED_REPOS = [
	'zenbrain',
	'zenpreference',
	'zenrag',
	'zengrab',
	'mobile-responsive-sonner',
	'local-rag',
] as const;

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
	// Remove markdown images ![alt](url)
	text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
	// Remove bold/italic markers
	text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
	text = text.replace(/\*([^*]+)\*/g, '$1');
	// Collapse whitespace and newlines
	text = text.replace(/\s+/g, ' ').trim();
	// Take first sentence(s) up to max length
	const truncated = text.length > MAX_SUMMARY_LENGTH
		? text.slice(0, MAX_SUMMARY_LENGTH).replace(/\s+\S*$/, '') + '…'
		: text;
	return truncated || '';
}

function getReadmeUrl(repo: string): string {
	return `https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/main/README.md`;
}

function getRepoUrl(repo: string): string {
	return `https://github.com/${GITHUB_USER}/${repo}`;
}

export async function getProjects(): Promise<Project[]> {
	const projects: Project[] = [];

	for (const repo of PINNED_REPOS) {
		const readmeUrl = getReadmeUrl(repo);
		const readmeRes = await fetch(readmeUrl);
		let readme: string | null = null;

		if (readmeRes.ok) {
			readme = await readmeRes.text();
		}

		projects.push({
			name: repo,
			url: getRepoUrl(repo),
			summary: readme ? summarizeReadme(readme) : null,
		});
	}

	return projects;
}
