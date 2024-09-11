module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],  // For test file matching
    moduleFileExtensions: ['ts', 'js'],  // Handle both .ts and .js files
};