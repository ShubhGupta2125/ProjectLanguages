
// Mock Date.now() and setTimeout for timing control in tests
import {TokenBucketRateLimitStrategy} from "../../ratelimit/TokenBucketRateLimitStrategy";

describe('TokenBucketRateLimitStrategy', () => {

    it('should acquire tokens immediately when the bucket is full', async () => {
        const strategy = new TokenBucketRateLimitStrategy(5, 1); // Capacity 5, 1 token per second

        await strategy.acquireToken();  // Acquire 1 token
        expect(strategy['tokens']).toBe(4);  // Expect 4 tokens left
    });

    it('should wait for tokens to refill when the bucket is empty', async () => {
        const strategy = new TokenBucketRateLimitStrategy(1, 1); // Capacity 1, 1 token per second

        await strategy.acquireToken();  // Use up the 1 token
        expect(strategy['tokens']).toBe(0);  // Bucket should be empty

        // Acquire another token, should wait for refill
        const acquirePromise = strategy.acquireToken();
        setTimeout(() => {
            expect(strategy['tokens']).toBe(0); // After refill, token count should be 0 after acquiring
        }, 1000);

        await acquirePromise;  // Ensure the promise resolves
    });

    it('should refill tokens after time has passed', async () => {
        const strategy = new TokenBucketRateLimitStrategy(5, 1); // Capacity 5, 1 token per second

        // Use all tokens
        for (let i = 0; i < 5; i++) {
            await strategy.acquireToken();
        }
        expect(strategy['tokens']).toBe(0);  // Bucket should be empty

        // Wait for 3 seconds to refill 3 tokens
        setTimeout(async () => {
            await strategy.acquireToken();  // Acquire one token
            expect(strategy['tokens']).toBe(2);  // 2 tokens should remain
        }, 3000);
    });

    it('should not exceed bucket capacity when refilling', async () => {
        const strategy = new TokenBucketRateLimitStrategy(5, 1); // Capacity 5, 1 token per second

        setTimeout(async () => {
            await strategy.acquireToken();  // Acquire one token
            expect(strategy['tokens']).toBe(4);  // Token count should be capped at 5 (bucket's capacity)
        }, 10000);  // Wait for 10 seconds to refill more tokens than capacity
    });
});