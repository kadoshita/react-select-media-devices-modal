import React from 'react';
import DeviceItem from '../deviceItem';

interface DeviceListProps {
    devices: MediaDeviceInfo[];
    label: string;
    selectedDevice?: MediaDeviceInfo;
    style?: {
        deviceList?: React.CSSProperties;
        label?: React.CSSProperties;
        select?: React.CSSProperties;
        deviceItems?: React.CSSProperties;
    };
    onChange: (deviceId: string) => void;
}

const DeviceList = ({ devices, label, selectedDevice, style: styleProps, onChange }: DeviceListProps) => {
    if (devices === undefined) return <></>;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    const selectId = `device-select-${label.toLowerCase().replace(/\s/g, '-')}`;

    const defaultStyle: Required<DeviceListProps['style']> = {
        deviceList: {
            paddingTop: '8px',
        },
        label: {},
        select: {
            marginTop: '4px',
            borderRadius: '4px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
            width: '100%',
        },
        deviceItems: {},
    };

    const style: Required<DeviceListProps['style']> = {
        deviceList: styleProps ? { ...defaultStyle.deviceList, ...styleProps.deviceList } : defaultStyle.deviceList,
        label: styleProps ? { ...defaultStyle.label, ...styleProps.label } : defaultStyle.label,
        select: styleProps ? { ...defaultStyle.select, ...styleProps.select } : defaultStyle.select,
        deviceItems: styleProps ? { ...defaultStyle.deviceItems, ...styleProps.deviceItems } : defaultStyle.deviceItems,
    };

    return (
        <div style={style.deviceList}>
            <label style={style.label} htmlFor={selectId}>
                {label}
            </label>
            <select style={style.select} id={selectId} onChange={handleChange} defaultValue={selectedDevice?.deviceId}>
                {devices.map((d, i) => (
                    <DeviceItem style={style.deviceItems} value={d.deviceId} name={d.label} key={i}></DeviceItem>
                ))}
            </select>
        </div>
    );
};

export default DeviceList;
