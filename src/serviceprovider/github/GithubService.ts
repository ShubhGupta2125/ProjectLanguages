import { GitHubLanguageAnalyzer } from "../../languageanalyzer/GithubLanguageAnalyzer";
import { GitHubApiServiceImpl } from "../../externalapi/GitHubApiServiceImpl";
import { TokenBucketRateLimitStrategy } from "../../ratelimit/TokenBucketRateLimitStrategy";

export class GitHubService implements IGitServiceProvider {
    private readonly apiService: IGitHubApiService;
    private languageAnalyzer: ILanguageAnalyzer;

    constructor(token: string) {
        // 5000 tokens with ~1.39 tokens/second refill
        const strategy: IRateLimitStrategy = new TokenBucketRateLimitStrategy(5000, 5000 / 3600);
        this.apiService = new GitHubApiServiceImpl(token, strategy);
        this.languageAnalyzer = new GitHubLanguageAnalyzer();
    }

    // Get the most used languages for a GitHub user
    async getMostUsedLanguages(username: string): Promise<{ percentage: number; language: string }[]> {
        try {
            const projects = await this.apiService.getUserProjects(username);

            const languagePromises = projects.map(project =>
                this.apiService.getProjectLanguages(project.url)
            );

            // Wait for all language data to be fetched
            const languageResults = await Promise.all(languagePromises);

            return await this.languageAnalyzer.analyzeLanguages(projects, languageResults);
        } catch (error) {
            console.error(`Error fetching data for user ${username}:`, error);
            throw error;
        }
    }
}