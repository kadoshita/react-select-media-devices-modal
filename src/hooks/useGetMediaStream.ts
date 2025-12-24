import { useEffect, useState } from 'react';

export const useGetMediaStream = (): [MediaStream | undefined, (device: MediaDeviceInfo) => void, () => void] => {
    const [mediaStream, setMediaStream] = useState<MediaStream>();

    useEffect(() => {
        return () => {
            if (mediaStream === undefined) return;
            mediaStream.getTracks().forEach((t) => t.stop());
        };
    }, []);

    const getMediaStream = (device: MediaDeviceInfo) => {
        if (device.kind === 'audiooutput') return;

        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia(
                device.kind === 'audioinput'
                    ? { video: false, audio: { deviceId: device.deviceId } }
                    : { video: { deviceId: device.deviceId }, audio: false }
            );
            setMediaStream(stream);
        })();
    };

    const stopMediaStream = () => {
        if (mediaStream === undefined) return;
        mediaStream.getTracks().forEach((t) => t.stop());
        setMediaStream(undefined);
    };

    return [mediaStream, getMediaStream, stopMediaStream];
};
