import { Mock, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetMediaStream } from '../../src/hooks/useGetMediaStream';
import { act } from 'react-dom/test-utils';

describe('useGetMediaStream', () => {
    const fakeAudioInputDeviceInfo: MediaDeviceInfo = {
        deviceId: 'audio-input-device-id',
        groupId: '',
        label: 'fake device',
        kind: 'audioinput',
        toJSON: vi.fn(),
    };
    const fakeVideoInputDeviceInfo: MediaDeviceInfo = {
        deviceId: 'video-input-device-id',
        groupId: '',
        label: 'fake device',
        kind: 'videoinput',
        toJSON: vi.fn(),
    };
    let getUserMediaMock: Mock<any, Object>;

    beforeEach(() => {
        getUserMediaMock = vi.fn<any, Object>().mockResolvedValue({});
        vi.stubGlobal('navigator', {
            mediaDevices: {
                getUserMedia: getUserMediaMock,
            },
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should get audio input media stream', async () => {
        const { result } = renderHook(() => useGetMediaStream());
        act(() => result.current[1](fakeAudioInputDeviceInfo));
        await waitFor(() => expect(result.current[0]).not.toBeFalsy());
        expect(getUserMediaMock).toBeCalledWith({
            video: false,
            audio: { deviceId: fakeAudioInputDeviceInfo.deviceId },
        });
    });

    it('should get video input media stream', async () => {
        const { result } = renderHook(() => useGetMediaStream());
        act(() => result.current[1](fakeVideoInputDeviceInfo));
        await waitFor(() => expect(result.current[0]).not.toBeFalsy());
        expect(getUserMediaMock).toBeCalledWith({
            audio: false,
            video: { deviceId: fakeVideoInputDeviceInfo.deviceId },
        });
    });
});
