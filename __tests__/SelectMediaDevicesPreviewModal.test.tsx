import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGetDevices } from '../src/hooks/useGetDevices';
import { SelectMediaDevicesPreviewModal } from '../src';
import { useGetMediaStream } from '../src/hooks/useGetMediaStream';
import { SpyInstance } from 'vitest';

vi.mock('../src/hooks/useGetDevices');
vi.mock('../src/hooks/useGetMediaStream');

describe('SelectMediaDevicesPreviewModal', () => {
    let videoElementPlayMock: SpyInstance<any[], Promise<void>>;
    const useGetDevicesMock = useGetDevices as jest.Mock<[MediaDeviceInfo[], () => void]>;
    const useGetMediaStreamMock = useGetMediaStream as jest.Mock<[MediaStream, (device: MediaDeviceInfo) => void]>;
    const fakeDevices: MediaDeviceInfo[] = [
        {
            deviceId: 'fake device1 id',
            kind: 'audioinput',
            label: 'fake device1',
            groupId: '',
            toJSON: vi.fn(),
        },
        {
            deviceId: 'fake device2 id',
            kind: 'audiooutput',
            label: 'fake device2',
            groupId: '',
            toJSON: vi.fn(),
        },
        {
            deviceId: 'fake device3 id',
            kind: 'videoinput',
            label: 'fake device3',
            groupId: '',
            toJSON: vi.fn(),
        },
    ];

    beforeEach(() => {
        videoElementPlayMock = vi.spyOn(window.HTMLVideoElement.prototype, 'play').mockResolvedValue();

        // vitestのglobalsオプションをtrueにすると、window.MediaStreamがundefinedになるため、globalでMediaStreamのstubを登録している
        vi.stubGlobal('MediaStream', class MediaStream {});

        useGetDevicesMock.mockImplementation(() => {
            return [fakeDevices, vi.fn()];
        });

        useGetMediaStreamMock.mockImplementation(() => {
            return [new MediaStream(), vi.fn()];
        });
    });

    afterEach(() => {
        videoElementPlayMock.mockRestore();
        useGetDevicesMock.mockRestore();
        useGetMediaStreamMock.mockRestore();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('should render SelectMediaDevicesPreviewModal', async () => {
        const handleDeviceSelected = vi.fn();
        const handleDeviceSelectCanceled = vi.fn();
        const { rerender } = render(
            <SelectMediaDevicesPreviewModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={false}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={false}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesPreviewModal>
        );

        await waitFor(() => expect(screen.queryAllByText('Audio input device')).toEqual([]));
        await waitFor(() => expect(screen.queryAllByText('Audio output device')).toEqual([]));
        await waitFor(() => expect(screen.queryAllByText('Video input device')).toEqual([]));

        rerender(
            <SelectMediaDevicesPreviewModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={true}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={false}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesPreviewModal>
        );

        expect(screen.getByText('Audio input device')).toBeInTheDocument();
        expect(screen.getByText('Audio output device')).toBeInTheDocument();
        expect(screen.getByText('Video input device')).toBeInTheDocument();
    });

    it.each([
        'isSelectAudioInput',
        'isSelectAudioOutput',
        'isSelectVideoInput',
        'audioInputDeviceLabel',
        'audioOutputDeviceLabel',
        'videoInputDeviceLabel',
        'confirmButtonText',
        'cancelButtonText',
        'allowOutsideClick',
    ])('should render SelectMediaDevicesPreviewModal when %s is undefined', async (key) => {
        const handleDeviceSelected = vi.fn();
        const handleDeviceSelectCanceled = vi.fn();
        const props = {
            isSelectAudioInput: true,
            isSelectAudioOutput: true,
            isSelectVideoInput: true,
            open: false,
            audioInputDeviceLabel: 'audio input device',
            audioOutputDeviceLabel: 'audio output device',
            videoInputDeviceLabel: 'video input device',
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            onDeviceSelected: handleDeviceSelected,
            onDeviceSelectCanceled: handleDeviceSelectCanceled,
        };
        props[key] = undefined;
        const { rerender } = render(<SelectMediaDevicesPreviewModal {...props}></SelectMediaDevicesPreviewModal>);

        await waitFor(() => expect(screen.queryAllByText('audio input device')).toEqual([]));
        await waitFor(() => expect(screen.queryAllByText('audio output device')).toEqual([]));
        await waitFor(() => expect(screen.queryAllByText('video input device')).toEqual([]));

        props.open = true;
        rerender(<SelectMediaDevicesPreviewModal {...props}></SelectMediaDevicesPreviewModal>);

        expect(screen.getByText('audio input device')).toBeInTheDocument();
        expect(screen.getByText('audio output device')).toBeInTheDocument();
        expect(screen.getByText('video input device')).toBeInTheDocument();
    });

    it('should be called onDeviceSelected when confirm button is clicked', async () => {
        const handleDeviceSelected = vi.fn();
        const handleDeviceSelectCanceled = vi.fn();
        render(
            <SelectMediaDevicesPreviewModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={true}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={true}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesPreviewModal>
        );

        expect(screen.getByText('Audio input device')).toBeInTheDocument();
        expect(screen.getByText('Audio output device')).toBeInTheDocument();
        expect(screen.getByText('Video input device')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Confirm'));

        expect(handleDeviceSelected).toBeCalledWith({
            audioInput: {
                deviceId: 'fake device1 id',
                kind: 'audioinput',
                label: 'fake device1',
                groupId: '',
                toJSON: expect.any(Function),
            },
            audioOutput: {
                deviceId: 'fake device2 id',
                kind: 'audiooutput',
                label: 'fake device2',
                groupId: '',
                toJSON: expect.any(Function),
            },
            videoInput: {
                deviceId: 'fake device3 id',
                kind: 'videoinput',
                label: 'fake device3',
                groupId: '',
                toJSON: expect.any(Function),
            },
        });
    });

    it('should be called onDeviceSelectCanceled when outside of modal is clicked', async () => {
        const handleDeviceSelected = vi.fn();
        const handleDeviceSelectCanceled = vi.fn();
        const { container } = render(
            <SelectMediaDevicesPreviewModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={true}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={true}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesPreviewModal>
        );

        expect(screen.getByText('Audio input device')).toBeInTheDocument();
        expect(screen.getByText('Audio output device')).toBeInTheDocument();
        expect(screen.getByText('Video input device')).toBeInTheDocument();

        await userEvent.click(container.querySelector('[class*=background]'));

        expect(handleDeviceSelectCanceled).toBeCalledTimes(1);
    });

    it('should be called onDeviceSelectCanceled when cancel button is clicked', async () => {
        const handleDeviceSelected = vi.fn();
        const handleDeviceSelectCanceled = vi.fn();
        render(
            <SelectMediaDevicesPreviewModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={true}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={true}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesPreviewModal>
        );

        expect(screen.getByText('Audio input device')).toBeInTheDocument();
        expect(screen.getByText('Audio output device')).toBeInTheDocument();
        expect(screen.getByText('Video input device')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Cancel'));

        expect(handleDeviceSelectCanceled).toBeCalledTimes(1);
    });
});
