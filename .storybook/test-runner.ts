import { toMatchImageSnapshot } from "jest-image-snapshot";
import { type Page } from "playwright";

import {
    getStoryContext,
    TestContext,
    type TestRunnerConfig,
} from "@storybook/test-runner";

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

const getBrowserName = (page: Page) => {
    return page.context().browser().browserType().name();
}

const screenshotTest = async (page: Page, context: TestContext) => {
    let previousScreenshot: Buffer = Buffer.from("");

    let stable = false;

    const pollInterval = 20000;

    const browserName = getBrowserName(page);

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
        customSnapshotIdentifier: `${browserName}_${context.id}`,
    });
};

const config: TestRunnerConfig = {
    setup() {
        jest.retryTimes(3);

        expect.extend({ toMatchImageSnapshot });
    },

    async preVisit(page, story) {
        page.setViewportSize({width: 800, height: 600});
    },

    async postVisit(page, context) {
        const storyContext = await getStoryContext(page, context);

        if (storyContext.tags.includes("no-test")) {
            return;
        }

        const browserName = getBrowserName(page);

        if (
            browserName === "webkit"
            && storyContext.tags.includes("no-test-webkit")) {
            return;
        }

        if (!storyContext.tags.includes("no-visual-test")) {
            await screenshotTest(page, context);
        }
    },
};

export default config;
