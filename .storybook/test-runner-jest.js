const { getJestConfig } = require("@storybook/test-runner");

// The default Jest configuration comes from @storybook/test-runner
const testRunnerConfig = getJestConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
    ...testRunnerConfig,
    testTimeout: 120000,
    maxWorkers: 4
    //maxWorkers: process.env.CI ? 4 : 8,
};
