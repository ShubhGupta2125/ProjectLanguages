interface IGitHubApiService {
    getUserProjects(username: string): Promise<Project[]>;  // Return a list of typed Repo objects
    getProjectLanguages(repoUrl: string): Promise<ProjectLanguages>;  // Return typed languages with usage
}