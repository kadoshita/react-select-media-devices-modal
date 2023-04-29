import React, { useEffect, useState } from 'react';
import s from './style.module.css';
import { useGetDevices } from './hooks/getDevices';
import DeviceList from './components/deviceList';

interface SelectMediaDevicesModalProps {
    isSelectAudioInput: boolean;
    isSelectAudioOutput: boolean;
    isSelectVideoInput: boolean;
    open: boolean;
    onDeviceSelected: (devices: {
        audioInput?: MediaDeviceInfo;
        audioOutput?: MediaDeviceInfo;
        videoInput?: MediaDeviceInfo;
    }) => void;

    onDeviceSelectCanceled: () => void;
}

const SelectMediaDevicesModal = ({
    isSelectAudioInput,
    isSelectAudioOutput,
    isSelectVideoInput,
    open,
    onDeviceSelected,
    onDeviceSelectCanceled,
}: SelectMediaDevicesModalProps) => {
    const [devices, getDevices] = useGetDevices();
    const [audioInputDevice, setAudioInputDevice] = useState<MediaDeviceInfo>();
    const [audioOutputDevice, setAudioOutputDevice] = useState<MediaDeviceInfo>();
    const [videoInputDevice, setVideoInputDevice] = useState<MediaDeviceInfo>();

    const audioInputDevices = devices.filter((d) => d.kind === 'audioinput');
    const audioOutputDevices = devices.filter((d) => d.kind === 'audiooutput');
    const videoInputDevices = devices.filter((d) => d.kind === 'videoinput');

    useEffect(() => {
        getDevices();
    }, []);

    const handleOKClick = () => {
        onDeviceSelected({
            audioInput: audioInputDevice !== undefined ? audioInputDevice : audioInputDevices[0],
            audioOutput: audioOutputDevice !== undefined ? audioOutputDevice : audioOutputDevices[0],
            videoInput: videoInputDevice !== undefined ? videoInputDevice : videoInputDevices[0],
        });
    };

    const handleCancelClick = () => {
        onDeviceSelectCanceled();
    };

    const handleChangeAudioInputDevice = (deviceId: string) => {
        setAudioInputDevice(audioInputDevices.find((d) => d.deviceId === deviceId));
    };

    const handleChangeAudioOutputDevice = (deviceId: string) => {
        setAudioOutputDevice(audioOutputDevices.find((d) => d.deviceId === deviceId));
    };

    const handleChangeVideoInputDevice = (deviceId: string) => {
        setVideoInputDevice(videoInputDevices.find((d) => d.deviceId === deviceId));
    };

    return open ? (
        <div className={s.background}>
            <div className={s.modal}>
                <div className={s.deviceLists}>
                    {isSelectAudioInput && (
                        <DeviceList
                            label="audio input device"
                            devices={audioInputDevices}
                            onChange={handleChangeAudioInputDevice}
                        ></DeviceList>
                    )}
                    {isSelectAudioOutput && (
                        <DeviceList
                            label="audio output device"
                            devices={audioOutputDevices}
                            onChange={handleChangeAudioOutputDevice}
                        ></DeviceList>
                    )}
                    {isSelectVideoInput && (
                        <DeviceList
                            label="video input device"
                            devices={videoInputDevices}
                            onChange={handleChangeVideoInputDevice}
                        ></DeviceList>
                    )}
                </div>
                <div className={s.buttons}>
                    <button onClick={handleCancelClick}>Cancel</button>
                    <button onClick={handleOKClick}>OK</button>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default SelectMediaDevicesModal;
