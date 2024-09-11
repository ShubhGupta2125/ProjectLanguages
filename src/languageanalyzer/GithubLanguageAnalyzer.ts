export class GitHubLanguageAnalyzer implements ILanguageAnalyzer {

    // Analyze languages across all projects
    async analyzeLanguages(projects: Project[], projectLanguages: ProjectLanguages[]): Promise<{ percentage: number; language: string }[]> {
        const languageStats: { [language: string]: number } = {};

        //Fetch all languages for all the projects
        for (const projectLanguage of projectLanguages) {
            for (const [language, bytes] of Object.entries(projectLanguage)) {
                languageStats[language] = (languageStats[language] || 0) + bytes;
            }
        }

        const entries = Object.entries(languageStats);

// Calculate the total usage
        const totalUsage = entries.reduce((sum, [, usage]) => sum + usage, 0);

// Calculate the percentage and sort by usage in descending order
        const sortedLanguages = entries
            .map(([language, usage]) => ({
                language,
                percentage: parseFloat(((usage / totalUsage) * 100).toFixed(2)),
            }))
            .sort((a, b) => b.percentage - a.percentage);

// Get the top languages (top 10 in this case)
        return sortedLanguages.slice(0, 5)
    }
}