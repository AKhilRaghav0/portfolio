// GitHub Fetcher
import { portfolioData } from "../data/portfolio.js";

export let githubProjects = [];

export async function fetchGithubData() {
    try {
        const res = await fetch('https://api.github.com/users/AkhilRaghav0/repos');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data)) {
            githubProjects = data.map(repo => ({
                title: repo.name,
                desc: repo.description || "No description provided.",
                category: "Open Source",
                link: repo.html_url
            }));
        }
    } catch (e) {
        console.warn("GitHub fetch failed, falling back to local data.", e);
        // Fallback to local portfolio projects
        githubProjects = portfolioData.projects;
    }
}
