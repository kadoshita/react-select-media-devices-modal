import React, { useEffect, useState } from 'react';
import s from './style.module.css';
import { useGetDevices } from './hooks/useGetDevices';
import DeviceList from './components/deviceList';
import Button from './components/button';

interface SelectMediaDevicesModalProps {
    isSelectAudioInput: boolean;
    isSelectAudioOutput: boolean;
    isSelectVideoInput: boolean;
    open: boolean;
    audioInputDeviceLabel: string;
    audioOutputDeviceLabel: string;
    videoInputDeviceLabel: string;
    confirmButtonText: string;
    cancelButtonText: string;
    allowOutsideClick: boolean;
    onDeviceSelected: (devices: {
        audioInput?: MediaDeviceInfo;
        audioOutput?: MediaDeviceInfo;
        videoInput?: MediaDeviceInfo;
    }) => void;

    onDeviceSelectCanceled: () => void;
}

const SelectMediaDevicesModal = ({
    isSelectAudioInput = true,
    isSelectAudioOutput = true,
    isSelectVideoInput = true,
    open,
    audioInputDeviceLabel = 'audio input device',
    audioOutputDeviceLabel = 'audio output device',
    videoInputDeviceLabel = 'video input device',
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    allowOutsideClick = true,
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
        if (!open) return;

        getDevices();
    }, [open]);

    const handleConfirmClick = () => {
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

    const handleOutsideClick = () => {
        onDeviceSelectCanceled();
    };

    return open ? (
        <div className={s.background} {...(allowOutsideClick ? { onClick: handleOutsideClick } : {})}>
            <div
                className={s.modal}
                {...(allowOutsideClick
                    ? {
                          onClick: (e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation(),
                      }
                    : {})}
            >
                <div className={s.deviceLists}>
                    {isSelectAudioInput && (
                        <DeviceList
                            label={audioInputDeviceLabel}
                            devices={audioInputDevices}
                            onChange={handleChangeAudioInputDevice}
                        ></DeviceList>
                    )}
                    {isSelectAudioOutput && (
                        <DeviceList
                            label={audioOutputDeviceLabel}
                            devices={audioOutputDevices}
                            onChange={handleChangeAudioOutputDevice}
                        ></DeviceList>
                    )}
                    {isSelectVideoInput && (
                        <DeviceList
                            label={videoInputDeviceLabel}
                            devices={videoInputDevices}
                            onChange={handleChangeVideoInputDevice}
                        ></DeviceList>
                    )}
                </div>
                <div className={s.buttons}>
                    <Button className={s.cancelButton} onClick={handleCancelClick}>
                        {cancelButtonText}
                    </Button>
                    <Button className={s.confirmButton} onClick={handleConfirmClick}>
                        {confirmButtonText}
                    </Button>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default SelectMediaDevicesModal;
