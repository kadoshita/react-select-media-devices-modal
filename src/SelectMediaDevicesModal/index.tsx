import React, { useEffect, useState } from 'react';
import { useGetDevices } from '../hooks/useGetDevices';
import DeviceList from '../components/deviceList';
import Button from '../components/button';

interface SelectMediaDevicesModalProps {
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
    style?: {
        background?: React.CSSProperties;
        modal?: React.CSSProperties;
        deviceLists?: React.CSSProperties;
        audioInputDeviceList?: Parameters<typeof DeviceList>[0]['style'];
        audioOutputDeviceList?: Parameters<typeof DeviceList>[0]['style'];
        videoInputDeviceList?: Parameters<typeof DeviceList>[0]['style'];
        buttons?: React.CSSProperties;
        cancelButton?: React.CSSProperties;
        confirmButton?: React.CSSProperties;
    };
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
    style: styleProps,
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

    const defaultStyle: Required<SelectMediaDevicesModalProps['style']> = {
        background: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modal: {
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            minWidth: '270px',
        },
        deviceLists: { display: 'grid' },
        audioInputDeviceList: {},
        audioOutputDeviceList: {},
        videoInputDeviceList: {},
        buttons: {
            paddingTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
        },
        cancelButton: {},
        confirmButton: {
            marginLeft: '4px',
        },
    };

    const [style, setStyle] = useState<Required<SelectMediaDevicesModalProps['style']>>({
        background: styleProps ? { ...defaultStyle.background, ...styleProps.background } : defaultStyle.background,
        modal: styleProps ? { ...defaultStyle.modal, ...styleProps.modal } : defaultStyle.modal,
        deviceLists: styleProps ? { ...defaultStyle.deviceLists, ...styleProps.deviceLists } : defaultStyle.deviceLists,
        audioInputDeviceList: styleProps
            ? { ...defaultStyle.audioInputDeviceList, ...styleProps.audioInputDeviceList }
            : {},
        audioOutputDeviceList: styleProps
            ? { ...defaultStyle.audioOutputDeviceList, ...styleProps.audioOutputDeviceList }
            : {},
        videoInputDeviceList: styleProps
            ? { ...defaultStyle.videoInputDeviceList, ...styleProps.videoInputDeviceList }
            : {},
        buttons: styleProps ? { ...defaultStyle.buttons, ...styleProps.buttons } : defaultStyle.buttons,
        cancelButton: styleProps
            ? { ...defaultStyle.cancelButton, ...styleProps.cancelButton }
            : defaultStyle.cancelButton,
        confirmButton: styleProps
            ? { ...defaultStyle.confirmButton, ...styleProps.confirmButton }
            : defaultStyle.confirmButton,
    });

    useEffect(() => {
        setStyle({
            background: styleProps ? { ...defaultStyle.background, ...styleProps.background } : defaultStyle.background,
            modal: styleProps ? { ...defaultStyle.modal, ...styleProps.modal } : defaultStyle.modal,
            deviceLists: styleProps
                ? { ...defaultStyle.deviceLists, ...styleProps.deviceLists }
                : defaultStyle.deviceLists,
            audioInputDeviceList: styleProps
                ? { ...defaultStyle.audioInputDeviceList, ...styleProps.audioInputDeviceList }
                : {},
            audioOutputDeviceList: styleProps
                ? { ...defaultStyle.audioOutputDeviceList, ...styleProps.audioOutputDeviceList }
                : {},
            videoInputDeviceList: styleProps
                ? { ...defaultStyle.videoInputDeviceList, ...styleProps.videoInputDeviceList }
                : {},
            buttons: styleProps ? { ...defaultStyle.buttons, ...styleProps.buttons } : defaultStyle.buttons,
            cancelButton: styleProps
                ? { ...defaultStyle.cancelButton, ...styleProps.cancelButton }
                : defaultStyle.cancelButton,
            confirmButton: styleProps
                ? { ...defaultStyle.confirmButton, ...styleProps.confirmButton }
                : defaultStyle.confirmButton,
        });
    }, [styleProps]);

    useEffect(() => {
        if (open) {
            navigator.mediaDevices.addEventListener('devicechange', getDevices);
            getDevices();
        } else {
            navigator.mediaDevices.removeEventListener('devicechange', getDevices);
        }
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
        <div style={style.background} {...(allowOutsideClick ? { onClick: handleOutsideClick } : {})}>
            <div
                style={style.modal}
                {...(allowOutsideClick
                    ? {
                          onClick: (e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation(),
                      }
                    : {})}
            >
                <div style={style.deviceLists}>
                    {isSelectAudioInput && (
                        <DeviceList
                            style={style?.audioInputDeviceList}
                            label={audioInputDeviceLabel}
                            devices={audioInputDevices}
                            selectedDevice={audioInputDevice}
                            onChange={handleChangeAudioInputDevice}
                        ></DeviceList>
                    )}
                    {isSelectAudioOutput && (
                        <DeviceList
                            style={style?.audioOutputDeviceList}
                            label={audioOutputDeviceLabel}
                            devices={audioOutputDevices}
                            selectedDevice={audioOutputDevice}
                            onChange={handleChangeAudioOutputDevice}
                        ></DeviceList>
                    )}
                    {isSelectVideoInput && (
                        <DeviceList
                            style={style?.videoInputDeviceList}
                            label={videoInputDeviceLabel}
                            devices={videoInputDevices}
                            selectedDevice={videoInputDevice}
                            onChange={handleChangeVideoInputDevice}
                        ></DeviceList>
                    )}
                </div>
                <div style={style.buttons}>
                    <Button style={style.cancelButton} onClick={handleCancelClick}>
                        {cancelButtonText}
                    </Button>
                    <Button style={style.confirmButton} onClick={handleConfirmClick}>
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
