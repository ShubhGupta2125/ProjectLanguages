interface IGitServiceProvider {
    getMostUsedLanguages(username: string): Promise<{ percentage: number; language: string }[]>;
}