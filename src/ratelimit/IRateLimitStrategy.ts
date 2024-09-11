// Rate Limiting Strategy Interface
interface IRateLimitStrategy {
    acquireToken(): Promise<void>;
}