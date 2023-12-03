import React, { useEffect, useMemo, useRef, useState } from 'react';
import s from './style.module.css';
import { useGetDevices } from '../hooks/useGetDevices';
import DeviceList from '../components/deviceList';
import Button from '../components/button';
import { useGetMediaStream } from '../hooks/useGetMediaStream';

interface SelectMediaDevicesPreviewModalProps {
    isSelectAudioInput?: boolean;
    isSelectAudioOutput?: boolean;
    isSelectVideoInput?: boolean;
    open: boolean;
    audioInputDeviceLabel?: string;
    audioOutputDeviceLabel?: string;
    videoInputDeviceLabel?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    allowOutsideClick?: boolean;
    onDeviceSelected: (devices: {
        audioInput?: MediaDeviceInfo;
        audioOutput?: MediaDeviceInfo;
        videoInput?: MediaDeviceInfo;
    }) => void;

    onDeviceSelectCanceled: () => void;
}

const SelectMediaDevicesPreviewModal = ({
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
}: SelectMediaDevicesPreviewModalProps) => {
    const [devices, getDevices] = useGetDevices();
    const [audioInputDevice, setAudioInputDevice] = useState<MediaDeviceInfo>();
    const [audioOutputDevice, setAudioOutputDevice] = useState<MediaDeviceInfo>();
    const [videoInputDevice, setVideoInputDevice] = useState<MediaDeviceInfo>();

    const [videoStream, getVideoStream] = useGetMediaStream();
    const videoPreviewRef = useRef<HTMLVideoElement>();

    const audioInputDevices = useMemo(() => devices.filter((d) => d.kind === 'audioinput'), [devices]);
    const audioOutputDevices = useMemo(() => devices.filter((d) => d.kind === 'audiooutput'), [devices]);
    const videoInputDevices = useMemo(() => devices.filter((d) => d.kind === 'videoinput'), [devices]);

    useEffect(() => {
        if (open) {
            navigator.mediaDevices.addEventListener('devicechange', getDevices);
            getDevices();
        } else {
            navigator.mediaDevices.removeEventListener('devicechange', getDevices);
        }
    }, [open]);

    useEffect(() => {
        if (videoInputDevices.length < 1) return;

        const [device] = videoInputDevices;
        getVideoStream(device);
    }, [videoInputDevices]);

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
        const device = videoInputDevices.find((d) => d.deviceId === deviceId);
        setVideoInputDevice(device);
        getVideoStream(device);
    };

    useEffect(() => {
        const { current } = videoPreviewRef;

        if (current === undefined) return;

        if (current.srcObject !== null) {
            if (current.srcObject instanceof MediaStream) {
                current.srcObject.getTracks().forEach((t) => t.stop());
                current.pause();
            }
        }

        current.srcObject = videoStream;
        current.play();
    }, [videoStream]);

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
                <div className={s.deviceSelectContainer}>
                    <div className={s.preview}>
                        <video className={s.previewVideo} ref={videoPreviewRef} autoPlay muted playsInline></video>
                    </div>
                    <div className={s.deviceLists}>
                        {isSelectAudioInput && (
                            <DeviceList
                                label={audioInputDeviceLabel}
                                devices={audioInputDevices}
                                selectedDevice={audioInputDevice}
                                onChange={handleChangeAudioInputDevice}
                            ></DeviceList>
                        )}
                        {isSelectAudioOutput && (
                            <DeviceList
                                label={audioOutputDeviceLabel}
                                devices={audioOutputDevices}
                                selectedDevice={audioOutputDevice}
                                onChange={handleChangeAudioOutputDevice}
                            ></DeviceList>
                        )}
                        {isSelectVideoInput && (
                            <DeviceList
                                label={videoInputDeviceLabel}
                                devices={videoInputDevices}
                                selectedDevice={videoInputDevice}
                                onChange={handleChangeVideoInputDevice}
                            ></DeviceList>
                        )}
                    </div>
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

export default SelectMediaDevicesPreviewModal;
