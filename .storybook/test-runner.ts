import { toMatchImageSnapshot } from "jest-image-snapshot";
import { type Page } from "playwright";

import {
    getStoryContext,
    TestContext,
    waitForPageReady,
    type TestRunnerConfig,
} from "@storybook/test-runner";

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

const getBrowserName = (page: Page) => {
    return page.context().browser().browserType().name();
}

const getPollInterval = (page: Page) => {
    const browserName = getBrowserName(page);
    if (browserName === "webkit") {
        return 30000;
    }
    return 20000;
}

const screenshotTest = async (page: Page, context: TestContext) => {
    let previousScreenshot: Buffer = Buffer.from("");

    let stable = false;

    const pollInterval = getPollInterval(page);

    const browserName = getBrowserName(page);

    await waitForPageReady(page);

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
    logLevel: "verbose",

    setup() {
        jest.retryTimes(5);

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
