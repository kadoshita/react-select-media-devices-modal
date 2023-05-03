import React from 'react';
import DeviceItem from '../deviceItem';
import s from './style.module.css';

interface DeviceListProps {
    devices: MediaDeviceInfo[];
    label: string;
    onChange: (deviceId: string) => void;
}

const DeviceList = ({ devices, label, onChange }: DeviceListProps) => {
    if (devices === undefined) return <></>;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    const selectId = `device-select-${label.toLowerCase().replace(/\s/g, '-')}`;

    return (
        <div className={s.deviceList}>
            <label htmlFor={selectId}>{label}</label>
            <select className={s.select} id={selectId} onChange={handleChange}>
                {devices.map((d, i) => (
                    <DeviceItem value={d.deviceId} name={d.label} key={i}></DeviceItem>
                ))}
            </select>
        </div>
    );
};

export default DeviceList;
