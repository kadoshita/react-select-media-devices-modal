import { useEffect, useState } from 'react';

export const useGetDevices = (): [MediaDeviceInfo[], () => void] => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    const getDevices = () => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            setDevices(deviceList);
            stream.getTracks().forEach((t) => t.stop());
        })();
    };

    return [devices, getDevices];
};
