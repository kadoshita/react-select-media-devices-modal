import { renderHook, waitFor } from '@testing-library/react';
import { useGetDevices } from '../../src/hooks/useGetDevices';
import { act } from 'react-dom/test-utils';

describe('useGetDevices', () => {
    const fakeDeviceInfo: MediaDeviceInfo = {
        deviceId: 'device-id',
        groupId: '',
        label: 'fake device',
        kind: 'audioinput',
        toJSON: vi.fn(),
    };

    beforeEach(() => {
        vi.stubGlobal('navigator', {
            mediaDevices: {
                getUserMedia: vi.fn().mockResolvedValue({
                    getTracks: () => [],
                }),
                enumerateDevices: vi.fn<any, MediaDeviceInfo[]>().mockResolvedValue([fakeDeviceInfo]),
            },
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should get media devices', async () => {
        const { result } = renderHook(() => useGetDevices());
        act(() => result.current[1]());
        await waitFor(() => expect(result.current[0].length).toBe(1));
        expect(result.current[0]).toStrictEqual([fakeDeviceInfo]);
    });
});
