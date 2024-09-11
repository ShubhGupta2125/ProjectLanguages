export enum GitServiceProviderEnum {
    GITHUB,
    GITLAB,
    BITBUCKET
}

export function getProviderFromString(status: string): GitServiceProviderEnum {
    return GitServiceProviderEnum[status as keyof typeof GitServiceProviderEnum];
}