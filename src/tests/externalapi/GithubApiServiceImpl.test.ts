import axios from 'axios';
import { GitHubApiServiceImpl } from '../../externalapi/GitHubApiServiceImpl';
import { TokenBucketRateLimitStrategy } from '../../ratelimit/TokenBucketRateLimitStrategy';

axios.get = jest.fn();

describe('GitHubApiServiceImpl', () => {
    let service: GitHubApiServiceImpl;
    let mockedRateLimitStrategy: TokenBucketRateLimitStrategy;

    beforeEach(() => {
        mockedRateLimitStrategy = {
            acquireToken: jest.fn().mockResolvedValue(true),  // Mock token acquisition
        } as unknown as TokenBucketRateLimitStrategy;

        service = new GitHubApiServiceImpl('mocked_token', mockedRateLimitStrategy);
    });

    afterEach(() => {
        jest.clearAllMocks();  // Clear mocks between tests
    });

    describe('getUserProjects', () => {
        it('should return a list of repositories for a valid username', async () => {
            const mockedProjects = [
                { id: 1, name: 'project1' },
                { id: 2, name: 'project2' }
            ];

            // Mock axios response
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedProjects });

            const projects = await service.getUserProjects('mocked_user');

            expect(projects).toEqual(mockedProjects);
            expect(mockedRateLimitStrategy.acquireToken).toHaveBeenCalled();  // Ensure rate limiting was checked
        });

        it('should return an empty array when an error occurs', async () => {
            (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));

            const projects = await service.getUserProjects('mocked_user');

            expect(projects).toEqual([]);
            expect(axios.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProjectLanguages', () => {
        it('should return the languages used in a project', async () => {
            const mockedLanguages = { JavaScript: 5000, TypeScript: 2000 };

            // Mock axios response
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedLanguages });

            const languages = await service.getProjectLanguages('https://api.github.com/repos/mocked_user/project1');

            expect(languages).toEqual(mockedLanguages);
            expect(mockedRateLimitStrategy.acquireToken).toHaveBeenCalled();
        });

        it('should return an empty object when an error occurs', async () => {
            (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));

            const languages = await service.getProjectLanguages('https://api.github.com/repos/mocked_user/project1');

            expect(languages).toEqual({});
            expect(axios.get).toHaveBeenCalledTimes(1);
        });
    });
});