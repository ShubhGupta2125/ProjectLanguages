import {Command} from 'commander';
import {ServiceProviderFactory} from "./serviceprovider/ServiceProviderFactory";
import {GitServiceProviderEnum} from "./serviceprovider/GitServiceProviderEnum";

const program = new Command();

program
    .version("1.0.0")
    .description('A CLI to get the most used languages from a GitHub user')
    .option('-u, --username <username>', 'GitHub username')
    .option('-t, --token <token>', 'GitHub token (optional)')
    .action(async (options) => {
        let { username, token } = options;

        if (!username) {
            console.error('Username is required');
            process.exit(1);
        }

        // Use token from environment variable if not provided
        if (!token) {
            token = process.env.GIT_PROVIDER_TOKEN;
        }

        if (!token) {
            console.error("No token found. Provide one using --token or add it to the GIT_PROVIDER_TOKEN environment variable.");
            process.exit(1);
        }

        try {
            // Create the service provider and fetch the most used languages
            const serviceProvider = ServiceProviderFactory.createServiceProvider(GitServiceProviderEnum.GITHUB, token);
            const languages = await serviceProvider.getMostUsedLanguages(username);
            console.log('Most used languages:', languages);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    });

program.parse(process.argv);