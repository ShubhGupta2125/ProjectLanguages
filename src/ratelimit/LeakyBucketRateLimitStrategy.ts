export class LeakyBucketRateLimitStrategy implements IRateLimitStrategy {
    private tokens: number;
    private capacity: number;
    private leakRate: number; // tokens per second
    private lastLeakTime: number;

    constructor(capacity: number, leakRate: number) {
        this.capacity = capacity;    // Maximum number of tokens the bucket can hold
        this.leakRate = leakRate;    // Tokens (requests) leaked per second
        this.tokens = 0;             // Start with an empty bucket
        this.lastLeakTime = Date.now();
    }

    // Helper method to leak tokens
    private leak() {
        const now = Date.now();
        const elapsed = (now - this.lastLeakTime) / 1000; // Elapsed time in seconds
        const tokensToLeak = Math.floor(elapsed * this.leakRate); // Tokens to leak

        // Decrease tokens but don't let the bucket go below zero
        this.tokens = Math.max(0, this.tokens - tokensToLeak);
        this.lastLeakTime = now;
    }

    // Add a token to the bucket
    private addToken() {
        if (this.tokens < this.capacity) {
            this.tokens++;
        }
    }

    // Acquire a token (wait if needed)
    public async acquireToken(): Promise<void> {
        this.leak();

        if (this.tokens < this.capacity) {
            this.addToken(); // Add a token to the bucket
            return;          // Success, token acquired
        }

        // Wait for tokens to leak before retrying
        const waitTime = 1000 / this.leakRate; // Time to wait for the bucket to leak
        console.log(`Leaky bucket full. Waiting ${waitTime} ms for token to be available...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        return this.acquireToken(); // Retry after waiting
    }
}