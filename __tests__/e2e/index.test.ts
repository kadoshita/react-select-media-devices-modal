import { afterAll, beforeAll, describe, test } from 'vitest';
import { PreviewServer, preview } from 'vite';
import { Browser, Page, chromium } from 'playwright';
import { expect } from '@playwright/test';

describe('react-select-media-devices-modal', async () => {
    let server: PreviewServer;
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        server = await preview({ root: 'example' });
        browser = await chromium.launch({
            headless: process.env.CI === 'true',
            args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
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
        server.printUrls();

        await page.goto(server.resolvedUrls.local[0]);

        await page.screenshot({ path: 'open-page.png', fullPage: true });

        const selectDeviceButton = page.getByText('Select Device');
        await expect(selectDeviceButton).toBeVisible();

        await selectDeviceButton.click();

        await expect(page.getByText('Audio input device')).toBeVisible();

        await page.screenshot({ path: 'open-modal.png', fullPage: true });

        await page.getByText('Confirm').click();

        await expect(page.getByText('Fake Default Audio Input')).toBeVisible();
        await expect(page.getByText('Fake Default Audio Output')).toBeVisible();
        await expect(page.getByText('fake_device_0')).toBeVisible();

        await page.screenshot({ path: 'completed.png', fullPage: true });
    }, 60_000);
});
