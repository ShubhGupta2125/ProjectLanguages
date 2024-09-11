import axios from 'axios'
import {TokenBucketRateLimitStrategy} from "../ratelimit/TokenBucketRateLimitStrategy";

export class GitHubApiServiceImpl implements IGitHubApiService {
    private readonly token?: string;
    private rateLimitStrategy: IRateLimitStrategy;

    constructor(token?: string, rateLimitStrategy?: IRateLimitStrategy) {
        if (!rateLimitStrategy) {
            // 5000 tokens with ~1.39 tokens/second
            this.rateLimitStrategy = new TokenBucketRateLimitStrategy(5000, 5000 / 3600);
        } else {
            this.rateLimitStrategy = rateLimitStrategy;
        }
        this.token = token;
    }

    // Fetch all projects for a user
    public async getUserProjects(username: string): Promise<Project[]> {
        await this.rateLimitStrategy.acquireToken(); // Wait if rate limit is hit

        try {
            const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
                headers: this.token ? { Authorization: `token ${this.token}` } : {},
                params: { per_page: 100 },
            });

            return response.data as Project[];
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error(`Error fetching projects (status: ${error.response?.status}):`, error.message);
            } else {
                console.error('Unknown error fetching projects:', error);
            }
            return [];  // Return an empty array on error
        }
    }

    // Fetch languages used in a specific project
    public async getProjectLanguages(projectUrl: string): Promise<ProjectLanguages> {
        await this.rateLimitStrategy.acquireToken(); // Wait if rate limit is hit

        try {
            const response = await axios.get(`${projectUrl}/languages`, {
                headers: this.token ? { Authorization: `token ${this.token}` } : {},
            });
            return response.data as ProjectLanguages;
        } catch (error: any) {
            console.error('Error fetching languages for project:', error);
            return {};  // Return an empty object on error
        }
    }
}