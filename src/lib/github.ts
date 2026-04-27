export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  visibility: string;
  default_branch: string;
  fork: boolean;
  archived: boolean;
  license: { spdx_id: string; name: string } | null;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  twitter_username: string | null;
}

export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
  content?: string;
  encoding?: string;
}

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json();
}

export async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  );
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json();
}

export async function getGitHubReposByTopic(username: string, topic: string): Promise<GitHubRepo[]> {
  const repos = await getGitHubRepos(username);
  return repos.filter(repo =>
    repo.topics.includes(topic) && !repo.fork && !repo.archived
  );
}

export async function getGitHubReadme(username: string, repo: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
        },
      }
    );
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

export async function searchGitHubRepos(username: string, query: string): Promise<GitHubRepo[]> {
  const repos = await getGitHubRepos(username);
  const lowerQuery = query.toLowerCase();
  return repos.filter(repo =>
    repo.name.toLowerCase().includes(lowerQuery) ||
    (repo.description && repo.description.toLowerCase().includes(lowerQuery)) ||
    repo.topics.some(t => t.toLowerCase().includes(lowerQuery))
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Rust: '#DEA584',
  Go: '#00ADD8',
  Java: '#B07219',
  'C++': '#F34B7D',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41B883',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Shell: '#89E051',
  Dockerfile: '#384D54',
};

export function getLanguageColor(language: string | null): string {
  if (!language) return '#8b949e';
  return LANGUAGE_COLORS[language] || '#8b949e';
}
