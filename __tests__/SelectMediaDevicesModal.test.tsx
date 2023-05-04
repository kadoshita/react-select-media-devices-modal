import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectMediaDevicesModal from '../src/SelectMediaDevicesModal';
import { useGetDevices } from '../src/hooks/useGetDevices';

vi.mock('../src/hooks/useGetDevices');

describe('SelectMediaDevicesModal', () => {
    const useGetDevicesMock = useGetDevices as jest.Mock<[MediaDeviceInfo[], () => void]>;
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
        useGetDevicesMock.mockImplementation(() => {
            return [fakeDevices, vi.fn()];
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should render SelectMediaDevicesModal', async () => {
        const handleDeviceSelected = vi.fn();
        const handleDeviceSelectCanceled = vi.fn();
        const { rerender } = render(
            <SelectMediaDevicesModal
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
            ></SelectMediaDevicesModal>
        );

        await waitFor(() => expect(screen.queryAllByText('Audio input device')).toEqual([]));
        await waitFor(() => expect(screen.queryAllByText('Audio output device')).toEqual([]));
        await waitFor(() => expect(screen.queryAllByText('Video input device')).toEqual([]));

        rerender(
            <SelectMediaDevicesModal
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
            ></SelectMediaDevicesModal>
        );

        expect(screen.getByText('Audio input device')).toBeInTheDocument();
        expect(screen.getByText('Audio output device')).toBeInTheDocument();
        expect(screen.getByText('Video input device')).toBeInTheDocument();
    });

    it('should be called onDeviceSelected when confirm button is clicked', async () => {
        const handleDeviceSelected = vi.fn();
        const handleDeviceSelectCanceled = vi.fn();
        render(
            <SelectMediaDevicesModal
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
            ></SelectMediaDevicesModal>
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
            <SelectMediaDevicesModal
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
            ></SelectMediaDevicesModal>
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
            <SelectMediaDevicesModal
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
            ></SelectMediaDevicesModal>
        );

        expect(screen.getByText('Audio input device')).toBeInTheDocument();
        expect(screen.getByText('Audio output device')).toBeInTheDocument();
        expect(screen.getByText('Video input device')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Cancel'));

        expect(handleDeviceSelectCanceled).toBeCalledTimes(1);
    });
});
