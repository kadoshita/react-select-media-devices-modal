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

        const selectDeviceButton = page.getByText(/^Select Device$/);
        await expect(selectDeviceButton).toBeVisible();

        await selectDeviceButton.click();

        await page.waitForFunction(
            () => window.document.getElementById('device-select-audio-input-device').childNodes.length > 0
        );

        await expect(page.getByText('Audio input device')).toBeVisible();

        await page.screenshot({ path: 'open-modal.png', fullPage: true });

        await page.getByText('Confirm').click();

        await expect(page.getByText('Fake Default Audio Input')).toBeVisible();
        await expect(page.getByText('Fake Default Audio Output')).toBeVisible();
        await expect(page.getByText('fake_device_0')).toBeVisible();

        await page.screenshot({ path: 'completed.png', fullPage: true });
    }, 60_000);

    test('should open modal and select devices with preview', async () => {
        server.printUrls();

        await page.goto(server.resolvedUrls.local[0]);

        await page.screenshot({ path: 'open-page-with-preview.png', fullPage: true });

        const selectDeviceButton = page.getByText('Select Device with Preview');
        await expect(selectDeviceButton).toBeVisible();

        await selectDeviceButton.click();

        await page.waitForFunction(
            () => window.document.getElementById('device-select-audio-input-device').childNodes.length > 0
        );

        await expect(page.getByText('Audio input device')).toBeVisible();

        await page.waitForFunction(() => window.document.querySelector<HTMLVideoElement>('video').readyState === 4);

        await page.screenshot({ path: 'open-modal-with-preview.png', fullPage: true });

        await page.getByText('Confirm').click();

        await expect(page.getByText('Fake Default Audio Input')).toBeVisible();
        await expect(page.getByText('Fake Default Audio Output')).toBeVisible();
        await expect(page.getByText('fake_device_0')).toBeVisible();

        await page.screenshot({ path: 'completed-with-preview.png', fullPage: true });
    }, 60_000);

    test('should open modal and select devices with recording', async () => {
        server.printUrls();

        await page.goto(server.resolvedUrls.local[0]);

        await page.screenshot({ path: 'open-page-with-recording.png', fullPage: true });

        const selectDeviceButton = page.getByText('Select Device with Recording');
        await expect(selectDeviceButton).toBeVisible();

        await selectDeviceButton.click();

        await page.waitForFunction(
            () => window.document.getElementById('device-select-audio-input-device').childNodes.length > 0
        );

        await expect(page.getByText('Audio input device')).toBeVisible();

        const recordingButton = page.getByText(/^Recording$/);
        await expect(recordingButton).toBeVisible();
        await expect(recordingButton).not.toBeDisabled();

        await recordingButton.click();

        await expect(recordingButton).toBeDisabled();

        await page.waitForFunction(() => window.document.querySelector<HTMLAudioElement>('audio').readyState === 4);

        await expect(recordingButton).not.toBeDisabled();

        await page.waitForFunction(() => window.document.querySelector<HTMLAudioElement>('audio').ended);

        await page.screenshot({ path: 'open-modal-with-recording.png', fullPage: true });

        await page.getByText('Confirm').click();

        await expect(page.getByText('Fake Default Audio Input')).toBeVisible();
        await expect(page.getByText('Fake Default Audio Output')).toBeVisible();
        await expect(page.getByText('fake_device_0')).toBeVisible();

        await page.screenshot({ path: 'completed-with-recording.png', fullPage: true });
    }, 60_000);
});
