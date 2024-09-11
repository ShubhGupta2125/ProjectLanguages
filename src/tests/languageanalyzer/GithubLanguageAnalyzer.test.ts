// Define mock data types for Project and ProjectLanguages
import {GitHubLanguageAnalyzer} from "../../languageanalyzer/GithubLanguageAnalyzer";

// Define some mock project data
const mockProjects: Project[] = [
    { id: 1, name: 'Project1', url: 'https://api.github.com/repos/user/Project1' },
    { id: 2, name: 'Project2', url: 'https://api.github.com/repos/user/Project2' }
];

const mockProjectLanguages: ProjectLanguages[] = [
    {
        JavaScript: 1000,  // 1000 bytes of JavaScript code
        TypeScript: 500    // 500 bytes of TypeScript code
    },
    {
        Python: 800,       // 800 bytes of Python code
        JavaScript: 200    // 200 bytes of JavaScript code
    }
];

describe('GitHubLanguageAnalyzer', () => {
    let analyzer: GitHubLanguageAnalyzer;

    beforeEach(() => {
        analyzer = new GitHubLanguageAnalyzer();
    });

    it('should correctly aggregate and calculate language percentages', async () => {
        const result = await analyzer.analyzeLanguages(mockProjects, mockProjectLanguages);

        // Validate the result (percentages calculated and sorted)
        expect(result).toEqual([
            { language: 'JavaScript', percentage: 48 },
            { language: 'Python', percentage: 32 },
            { language: 'TypeScript', percentage: 20 }
        ]);
    });

    it('should return an empty array when no projectLanguages are provided', async () => {
        const result = await analyzer.analyzeLanguages(mockProjects, []);

        expect(result).toEqual([]);
    });

    it('should handle projects with no languages and still calculate percentages', async () => {

        const mockProjectLanguagesWithEmpty: ProjectLanguages[] = [
            {},
            {
                Python: 500,
                JavaScript: 500
            }
        ];

        const result = await analyzer.analyzeLanguages(mockProjects, mockProjectLanguagesWithEmpty);

        // Validate the result
        expect(result).toEqual([
            { language: 'Python', percentage: 50 },
            { language: 'JavaScript', percentage: 50 }
        ]);
    });

    it('should correctly calculate percentages with equal language usage', async () => {

        const mockEqualLanguages: ProjectLanguages[] = [{
            Python: 500,
            JavaScript: 500
        }];

        const result = await analyzer.analyzeLanguages(mockProjects, mockEqualLanguages);

        // Validate the result
        expect(result).toEqual([
            { language: 'Python', percentage: 50 },
            { language: 'JavaScript', percentage: 50 }
        ]);
    });

    it('should handle projects with large numbers of languages and aggregate correctly', async () => {
        const mockLanguage1: ProjectLanguages = {
            JavaScript: 5000,
            TypeScript: 3000
        };
        const mockLanguage2: ProjectLanguages = {
            Python: 4000,
            JavaScript: 2000
        };
        const mockLargeProjectLanguages:ProjectLanguages[] = [
            mockLanguage1,
            mockLanguage2
        ];

        const result = await analyzer.analyzeLanguages(mockProjects, mockLargeProjectLanguages);

        // Validate the result
        expect(result).toEqual([
            { language: 'JavaScript', percentage: 50 },
            { language: 'Python', percentage: 28.57 },
            { language: 'TypeScript', percentage: 21.43 }
        ]);
    });
});