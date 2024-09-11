interface ILanguageAnalyzer {
    analyzeLanguages(projects: Project[], projectLanguages: ProjectLanguages[]): Promise<{ percentage: number; language: string }[]>;
}