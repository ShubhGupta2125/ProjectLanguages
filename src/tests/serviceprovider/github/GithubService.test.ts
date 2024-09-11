import {GitHubService} from "../../../serviceprovider/github/GithubService";
import {GitHubApiServiceImpl} from "../../../externalapi/GitHubApiServiceImpl";
import {GitHubLanguageAnalyzer} from "../../../languageanalyzer/GithubLanguageAnalyzer";

jest.mock("../../../externalapi/GitHubApiServiceImpl");
jest.mock("../../../languageanalyzer/GithubLanguageAnalyzer");

describe("GitHubService", () => {
    let gitHubService: GitHubService;
    let mockApiService: jest.Mocked<GitHubApiServiceImpl>;
    let mockLanguageAnalyzer: jest.Mocked<GitHubLanguageAnalyzer>;

    const token = "mockToken";
    const username = "mockUsername";

    beforeEach(() => {
        // Create instances of mocked classes
        mockApiService = new GitHubApiServiceImpl(token, {} as any) as jest.Mocked<GitHubApiServiceImpl>;
        mockLanguageAnalyzer = new GitHubLanguageAnalyzer() as jest.Mocked<GitHubLanguageAnalyzer>;

        // Mock methods using jest.fn()
        mockApiService.getUserProjects = jest.fn();
        mockApiService.getProjectLanguages = jest.fn();
        mockLanguageAnalyzer.analyzeLanguages = jest.fn();

        gitHubService = new GitHubService(token);
        // Inject mocks into the GitHubService instance
        (gitHubService as any).apiService = mockApiService;
        (gitHubService as any).languageAnalyzer = mockLanguageAnalyzer;
    });

    it("should return the most used languages for a user", async () => {
        const mockProjects: Project[] = [
            { id: 1, url: "mockUrl1", name: 'mock1'},
            { id: 2, url: "mockUrl2", name: 'mock2' },
        ];

        const mockLanguages1: ProjectLanguages = { JavaScript: 500, TypeScript: 300 };
        const mockLanguages2: ProjectLanguages = { JavaScript: 400, Python: 200 };

        const mockAnalysisResult = [
            { language: "JavaScript", percentage: 60 },
            { language: "TypeScript", percentage: 25 },
            { language: "Python", percentage: 15 },
        ];

        mockApiService.getUserProjects.mockResolvedValue(mockProjects);
        mockApiService.getProjectLanguages
            .mockResolvedValueOnce(mockLanguages1)
            .mockResolvedValueOnce(mockLanguages2);
        mockLanguageAnalyzer.analyzeLanguages.mockResolvedValue(mockAnalysisResult);

        const result = await gitHubService.getMostUsedLanguages(username);

        expect(mockApiService.getUserProjects).toHaveBeenCalledWith(username);
        expect(mockApiService.getProjectLanguages).toHaveBeenCalledTimes(2);
        expect(mockApiService.getProjectLanguages).toHaveBeenCalledWith("mockUrl1");
        expect(mockApiService.getProjectLanguages).toHaveBeenCalledWith("mockUrl2");
        expect(mockLanguageAnalyzer.analyzeLanguages).toHaveBeenCalledWith(mockProjects, [mockLanguages1, mockLanguages2]);
        expect(result).toEqual(mockAnalysisResult);
    });

    it("should throw an error when getUserProjects fails", async () => {
        const mockError = new Error("API failure");
        mockApiService.getUserProjects.mockRejectedValue(mockError);

        await expect(gitHubService.getMostUsedLanguages(username)).rejects.toThrow("API failure");

        expect(mockApiService.getUserProjects).toHaveBeenCalledWith(username);
        expect(mockApiService.getProjectLanguages).not.toHaveBeenCalled();
        expect(mockLanguageAnalyzer.analyzeLanguages).not.toHaveBeenCalled();
    });

    it("should throw an error when getProjectLanguages fails", async () => {
        const mockProjects: Project[] = [
            { id: 1, url: "mockUrl1", name: 'mock1'},
        ];

        const mockError = new Error("API failure on getProjectLanguages");
        mockApiService.getUserProjects.mockResolvedValue(mockProjects);
        mockApiService.getProjectLanguages.mockRejectedValue(mockError);

        await expect(gitHubService.getMostUsedLanguages(username)).rejects.toThrow("API failure on getProjectLanguages");

        expect(mockApiService.getUserProjects).toHaveBeenCalledWith(username);
        expect(mockApiService.getProjectLanguages).toHaveBeenCalledTimes(1);
        expect(mockLanguageAnalyzer.analyzeLanguages).not.toHaveBeenCalled();
    });
});
