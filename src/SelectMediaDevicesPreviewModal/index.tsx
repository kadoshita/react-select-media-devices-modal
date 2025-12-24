import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    style?: {
        background?: React.CSSProperties;
        modal?: React.CSSProperties;
        deviceSelectContainer?: React.CSSProperties;
        preview?: React.CSSProperties;
        previewVideo?: React.CSSProperties;
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
    style: styleProps,
    onDeviceSelected,
    onDeviceSelectCanceled,
}: SelectMediaDevicesPreviewModalProps) => {
    const [devices, getDevices] = useGetDevices();
    const [audioInputDevice, setAudioInputDevice] = useState<MediaDeviceInfo>();
    const [audioOutputDevice, setAudioOutputDevice] = useState<MediaDeviceInfo>();
    const [videoInputDevice, setVideoInputDevice] = useState<MediaDeviceInfo>();

    const [videoStream, getVideoStream, stopVideoStream] = useGetMediaStream();
    const videoPreviewRef = useRef<HTMLVideoElement>(null);

    const audioInputDevices = useMemo(() => devices.filter((d) => d.kind === 'audioinput'), [devices]);
    const audioOutputDevices = useMemo(() => devices.filter((d) => d.kind === 'audiooutput'), [devices]);
    const videoInputDevices = useMemo(() => devices.filter((d) => d.kind === 'videoinput'), [devices]);

    const mediaQuery = matchMedia('(max-width: 640px)');

    const defaultStyle: Required<SelectMediaDevicesPreviewModalProps['style']> = {
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
        },
        deviceSelectContainer: mediaQuery.matches
            ? {
                  display: 'grid',
                  gridTemplateColumns: '100%',
              }
            : {
                  display: 'grid',
                  gridTemplateColumns: '50% 50%',
              },
        preview: {
            minWidth: '270px',
            minHeight: '180px',
            maxWidth: '270px',
            maxHeight: '180px',
            marginRight: '4px',
        },
        previewVideo: {
            width: '270px',
            height: '180px',
        },
        deviceLists: {
            display: 'grid',
            minWidth: '270px',
            marginLeft: '8px',
        },
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

    const [style, setStyle] = useState<Required<SelectMediaDevicesPreviewModalProps['style']>>({
        background: styleProps ? { ...defaultStyle.background, ...styleProps.background } : defaultStyle.background,
        modal: styleProps ? { ...defaultStyle.modal, ...styleProps.modal } : defaultStyle.modal,
        deviceSelectContainer: styleProps
            ? { ...defaultStyle.deviceSelectContainer, ...styleProps.deviceSelectContainer }
            : defaultStyle.deviceSelectContainer,
        preview: styleProps ? { ...defaultStyle.preview, ...styleProps.preview } : defaultStyle.preview,
        previewVideo: styleProps
            ? { ...defaultStyle.previewVideo, ...styleProps.previewVideo }
            : defaultStyle.previewVideo,
        deviceLists: styleProps ? { ...defaultStyle.deviceLists, ...styleProps.deviceLists } : defaultStyle.deviceLists,
        audioInputDeviceList: styleProps
            ? { ...defaultStyle.audioInputDeviceList, ...styleProps.audioInputDeviceList }
            : defaultStyle.audioInputDeviceList,
        audioOutputDeviceList: styleProps
            ? { ...defaultStyle.audioOutputDeviceList, ...styleProps.audioOutputDeviceList }
            : defaultStyle.audioOutputDeviceList,
        videoInputDeviceList: styleProps
            ? { ...defaultStyle.videoInputDeviceList, ...styleProps.videoInputDeviceList }
            : defaultStyle.videoInputDeviceList,
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
            deviceSelectContainer: styleProps
                ? { ...defaultStyle.deviceSelectContainer, ...styleProps.deviceSelectContainer }
                : defaultStyle.deviceSelectContainer,
            preview: styleProps ? { ...defaultStyle.preview, ...styleProps.preview } : defaultStyle.preview,
            previewVideo: styleProps
                ? { ...defaultStyle.previewVideo, ...styleProps.previewVideo }
                : defaultStyle.previewVideo,
            deviceLists: styleProps
                ? { ...defaultStyle.deviceLists, ...styleProps.deviceLists }
                : defaultStyle.deviceLists,
            audioInputDeviceList: styleProps
                ? { ...defaultStyle.audioInputDeviceList, ...styleProps.audioInputDeviceList }
                : defaultStyle.audioInputDeviceList,
            audioOutputDeviceList: styleProps
                ? { ...defaultStyle.audioOutputDeviceList, ...styleProps.audioOutputDeviceList }
                : defaultStyle.audioOutputDeviceList,
            videoInputDeviceList: styleProps
                ? { ...defaultStyle.videoInputDeviceList, ...styleProps.videoInputDeviceList }
                : defaultStyle.videoInputDeviceList,
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
        const handleChange = () => {
            if (mediaQuery.matches) {
                setStyle({
                    ...style,
                    deviceSelectContainer: {
                        display: 'grid',
                        gridTemplateColumns: '100%',
                    },
                });
            } else {
                setStyle({
                    ...style,
                    deviceSelectContainer: {
                        display: 'grid',
                        gridTemplateColumns: '50% 50%',
                    },
                });
            }
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

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

        const device = videoInputDevices.find((d) => d.deviceId === videoInputDevice?.deviceId) ?? videoInputDevices[0];
        getVideoStream(device);
    }, [videoInputDevices]);

    const handleConfirmClick = () => {
        stopVideoStream();
        onDeviceSelected({
            audioInput: audioInputDevice !== undefined ? audioInputDevice : audioInputDevices[0],
            audioOutput: audioOutputDevice !== undefined ? audioOutputDevice : audioOutputDevices[0],
            videoInput: videoInputDevice !== undefined ? videoInputDevice : videoInputDevices[0],
        });
    };

    const handleCancelClick = () => {
        stopVideoStream();
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

        if (!current) return;

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
        stopVideoStream();
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
                <div style={style.deviceSelectContainer}>
                    <div style={style.preview}>
                        <video style={style.previewVideo} ref={videoPreviewRef} autoPlay muted playsInline></video>
                    </div>
                    <div style={style.deviceLists}>
                        {isSelectAudioInput && (
                            <DeviceList
                                style={style.audioInputDeviceList}
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

export default SelectMediaDevicesPreviewModal;
