import { afterAll, beforeAll, describe, test } from 'vitest';
import { PreviewServer, preview } from 'vite';
import { Browser, Page, chromium } from 'playwright';
import { expect } from '@playwright/test';

describe('react-select-media-devices-modal', async () => {
    let server: PreviewServer;
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        server = await preview({ preview: { port: 3000 }, root: 'example' });
        browser = await chromium.launch({
            headless: process.env.CI === 'true',
            args: ['--use-fake-ui-for-media-stream'],
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
        await new Promise<void>((resolve, reject) => {
            server.httpServer.close((err) => (err ? reject(err) : resolve()));
        });
    });

    test('should open modal and select devices', async () => {
        await page.goto('http://localhost:3000');
        const selectDeviceButton = page.getByText('Select Device');
        await expect(selectDeviceButton).toBeVisible();

        await selectDeviceButton.click();

        await expect(page.getByText('Audio input device')).toBeVisible();

        await new Promise((r) => setTimeout(r, 3000));

        await page.screenshot({ path: 'screenshot.png', fullPage: true });

        // const selectMediaDevicesModal = await page.$('[class*=modal');
    }, 60_000);
});
