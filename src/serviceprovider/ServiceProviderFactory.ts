import {GitHubService} from "./github/GithubService";
import {GitServiceProviderEnum} from "./GitServiceProviderEnum";

export class ServiceProviderFactory {
    static createServiceProvider(type: GitServiceProviderEnum, token: string): IGitServiceProvider {
        switch (type) {
            case GitServiceProviderEnum.GITHUB:
                return new GitHubService(token);
            default:
                throw new Error("This provider is not supported yet. Stay tuned ;)");
        }
    }
}