export class TokenBucketRateLimitStrategy implements IRateLimitStrategy {
    private tokens: number;
    private readonly capacity: number;
    private readonly refillRate: number; // tokens per second
    private lastRefillTime: number;

    constructor(capacity: number, refillRate: number) {
        this.capacity = capacity;     // Maximum tokens allowed
        this.refillRate = refillRate; // Tokens added per second (~1.39 tokens/second)
        this.tokens = capacity;       // Start with a full bucket
        this.lastRefillTime = Date.now();
    }

    // Helper method to refill the bucket
    private refill() {
        const now = Date.now();
        const elapsed = (now - this.lastRefillTime) / 1000; // elapsed time in seconds
        const tokensToAdd = Math.floor(elapsed * this.refillRate); // Tokens to add

        // Add tokens up to the bucket's capacity
        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        this.lastRefillTime = now;
    }

    // Acquire a token (wait if needed)
    public async acquireToken(): Promise<void> {
        while (true) {
            this.refill();

            if (this.tokens > 0) {
                this.tokens--;
                return; // Success, token acquired
            }

            // Calculate how long we need to wait for the next token to be available
            const waitTime = 1000 / this.refillRate; // Time to wait for 1 token (in ms)
            console.log(`Rate limit hit. Waiting ${waitTime} ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}