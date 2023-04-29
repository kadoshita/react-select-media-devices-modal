import React, { useEffect } from 'react';
import s from './style.module.css';
import { useGetDevices } from './hooks/getDevices';

interface SelectMediaDevicesModalProps {
    open: boolean;
    onDeviceSelected: (device: MediaDeviceInfo) => void;
}

const SelectMediaDevicesModal = ({ open, onDeviceSelected }: SelectMediaDevicesModalProps) => {
    const [devices, getDevices] = useGetDevices();
    console.table(devices);

    const handleClick = () => {
        getDevices();
    };

    useEffect(() => {
        if (devices === undefined) return;

        onDeviceSelected(devices[0]);
    }, [devices]);

    return open ? (
        <div className={s.background}>
            <div className={s.modal}>
                <button onClick={handleClick}>Get Devices</button>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default SelectMediaDevicesModal;
