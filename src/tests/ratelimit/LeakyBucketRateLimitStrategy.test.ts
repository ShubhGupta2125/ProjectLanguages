import {LeakyBucketRateLimitStrategy} from "../../ratelimit/LeakyBucketRateLimitStrategy";

describe('LeakyBucketRateLimitStrategy', () => {

    it('should add tokens when bucket is not full', async () => {
        const strategy = new LeakyBucketRateLimitStrategy(5, 1); // Capacity 5, 1 token per second

        await strategy.acquireToken();  // Add 1 token
        expect(strategy['tokens']).toBe(1);  // Expect 1 token in the bucket
    });

    it('should not exceed the bucket capacity', async () => {
        const strategy = new LeakyBucketRateLimitStrategy(3, 1); // Capacity 3, 1 token per second

        // Add tokens up to the capacity
        for (let i = 0; i < 5; i++) {
            await strategy.acquireToken();
        }

        expect(strategy['tokens']).toBe(3);  // Bucket should be full (3 tokens, not more)
    });

    it('should leak tokens over time', async () => {
        const strategy = new LeakyBucketRateLimitStrategy(5, 1); // Capacity 5, 1 token per second

        // Add tokens
        await strategy.acquireToken();
        await strategy.acquireToken();
        expect(strategy['tokens']).toBe(2);  // Bucket should have 2 tokens

        // Simulate time passing (leak tokens)
        setTimeout(() => {
            strategy['leak']();  // Call the leak method to simulate time passing
            expect(strategy['tokens']).toBe(1);  // 1 token should leak out
        }, 1000);  // Leak 1 token after 1 second
    });

    it('should acquire a token immediately if bucket is not full', async () => {
        const strategy = new LeakyBucketRateLimitStrategy(3, 1); // Capacity 3, 1 token per second

        await strategy.acquireToken();  // Acquire a token
        expect(strategy['tokens']).toBe(1);  // 1 token should be added to the bucket
    });

    it('should wait for tokens to leak when the bucket is full', async () => {
        const strategy = new LeakyBucketRateLimitStrategy(2, 1); // Capacity 2, 1 token per second

        // Fill the bucket
        await strategy.acquireToken();
        await strategy.acquireToken();
        expect(strategy['tokens']).toBe(2);  // Bucket should be full

        // Try to acquire a token, which should wait until a token leaks
        const acquirePromise = strategy.acquireToken();
        setTimeout(async () => {
            strategy['leak']();  // Simulate token leaking
            await acquirePromise;  // Wait for the token to be acquired
            expect(strategy['tokens']).toBe(2);  // Bucket should still be at capacity
        }, 1000);  // Wait 1 second to leak 1 token
    });
});
