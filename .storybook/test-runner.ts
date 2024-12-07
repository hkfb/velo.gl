import { toMatchImageSnapshot } from "jest-image-snapshot";

import { getStoryContext, type TestRunnerConfig } from "@storybook/test-runner";

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

const screenshotTest = async (page, context) => {
    let previousScreenshot: Buffer = Buffer.from("");

    let stable = false;

    const pollInterval = 16000;

    while (!stable) {
        const currentScreenshot = await page.screenshot();
        if (currentScreenshot.equals(previousScreenshot)) {
            stable = true;
        } else {
            previousScreenshot = currentScreenshot;
        }

        if (!stable) {
            await page.waitForTimeout(pollInterval);
        }
    }

    // @ts-expect-error TS2551
    expect(previousScreenshot).toMatchImageSnapshot({
        customSnapshotsDir,
        customSnapshotIdentifier: context.id,
    });
};

const config: TestRunnerConfig = {
    setup() {
        jest.retryTimes(3);

        expect.extend({ toMatchImageSnapshot });
    },

    async postVisit(page, context) {
        const storyContext = await getStoryContext(page, context);

        if (storyContext.tags.includes("no-test")) {
            return;
        }

        if (!storyContext.tags.includes("no-visual-test")) {
            await screenshotTest(page, context);
        }
    },
};

export default config;
