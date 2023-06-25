import React, { useEffect, useMemo, useRef, useState } from 'react';
import s from './style.module.css';
import { useGetDevices } from '../hooks/useGetDevices';
import DeviceList from '../components/deviceList';
import Button from '../components/button';
import { useGetMediaStream } from '../hooks/useGetMediaStream';

interface SelectMediaDevicesRecordingModalProps {
    isSelectAudioInput: boolean;
    isSelectAudioOutput: boolean;
    isSelectVideoInput: boolean;
    open: boolean;
    audioInputDeviceLabel: string;
    audioOutputDeviceLabel: string;
    videoInputDeviceLabel: string;
    confirmButtonText: string;
    cancelButtonText: string;
    recordingButtonText: string;
    allowOutsideClick: boolean;
    onDeviceSelected: (devices: {
        audioInput?: MediaDeviceInfo;
        audioOutput?: MediaDeviceInfo;
        videoInput?: MediaDeviceInfo;
    }) => void;

    onDeviceSelectCanceled: () => void;
}

const SelectMediaDevicesRecordingModal = ({
    isSelectAudioInput = true,
    isSelectAudioOutput = true,
    isSelectVideoInput = true,
    open,
    audioInputDeviceLabel = 'audio input device',
    audioOutputDeviceLabel = 'audio output device',
    videoInputDeviceLabel = 'video input device',
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    recordingButtonText = 'Recording',
    allowOutsideClick = true,
    onDeviceSelected,
    onDeviceSelectCanceled,
}: SelectMediaDevicesRecordingModalProps) => {
    const [devices, getDevices] = useGetDevices();
    const [audioInputDevice, setAudioInputDevice] = useState<MediaDeviceInfo>();
    const [audioOutputDevice, setAudioOutputDevice] = useState<MediaDeviceInfo>();
    const [videoInputDevice, setVideoInputDevice] = useState<MediaDeviceInfo>();

    const [videoStream, getVideoStream] = useGetMediaStream();
    const videoPreviewRef = useRef<HTMLVideoElement>();
    const audioPreviewRef = useRef<
        HTMLAudioElement & {
            setSinkId(deviceId: string): Promise<void>;
        }
    >();
    const [recorder, setRecorder] = useState<MediaRecorder>();
    const [isRecordingButtonDisabled, setIsRecordingButtonDisabled] = useState(false);

    const audioInputDevices = useMemo(() => devices.filter((d) => d.kind === 'audioinput'), [devices]);
    const audioOutputDevices = useMemo(() => devices.filter((d) => d.kind === 'audiooutput'), [devices]);
    const videoInputDevices = useMemo(() => devices.filter((d) => d.kind === 'videoinput'), [devices]);

    useEffect(() => {
        if (!open) return;

        getDevices();
    }, [open]);

    useEffect(() => {
        if (videoInputDevices.length < 1) return;

        const [device] = videoInputDevices;
        getVideoStream(device);
    }, [videoInputDevices]);

    const beforeCloseModal = () => {
        if (!recorder || !audioPreviewRef) return;

        if (recorder.state === 'recording') {
            recorder.removeEventListener('dataavailable', () => {});
            recorder.removeEventListener('stop', () => {});
            recorder.stop();
            recorder.stream.getTracks().forEach((t) => t.stop());
        }
        audioPreviewRef.current.src = '';
        audioPreviewRef.current.pause();
    };

    const handleConfirmClick = () => {
        beforeCloseModal();
        onDeviceSelected({
            audioInput: audioInputDevice !== undefined ? audioInputDevice : audioInputDevices[0],
            audioOutput: audioOutputDevice !== undefined ? audioOutputDevice : audioOutputDevices[0],
            videoInput: videoInputDevice !== undefined ? videoInputDevice : videoInputDevices[0],
        });
    };

    const handleCancelClick = () => {
        beforeCloseModal();
        onDeviceSelectCanceled();
    };

    const handleChangeAudioInputDevice = (deviceId: string) => {
        setAudioInputDevice(audioInputDevices.find((d) => d.deviceId === deviceId));
    };

    const handleChangeAudioOutputDevice = async (deviceId: string) => {
        setAudioOutputDevice(audioOutputDevices.find((d) => d.deviceId === deviceId));
        await audioPreviewRef.current.setSinkId(deviceId);
    };

    const handleChangeVideoInputDevice = (deviceId: string) => {
        const device = videoInputDevices.find((d) => d.deviceId === deviceId);
        setVideoInputDevice(device);
        getVideoStream(device);
    };

    const handleRecordingClick = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:
                audioInputDevice && audioInputDevice.deviceId !== ''
                    ? {
                          deviceId: audioInputDevice.deviceId,
                      }
                    : true,
            video: false,
        });
        let chunks: BlobPart[] = [];
        const _recorder = new MediaRecorder(stream);
        _recorder.addEventListener('dataavailable', (e) => {
            chunks.push(e.data);
        });
        _recorder.addEventListener('stop', async (e) => {
            setIsRecordingButtonDisabled(false);
            if (!audioPreviewRef.current) return;

            const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
            chunks = [];
            const url = URL.createObjectURL(blob);
            audioPreviewRef.current.src = url;
            if (audioOutputDevice && audioOutputDevice.deviceId !== '') {
                await audioPreviewRef.current.setSinkId(audioOutputDevice.deviceId);
            }
        });
        _recorder.start();
        setRecorder(_recorder);
        setIsRecordingButtonDisabled(true);
        setTimeout(() => {
            _recorder.stop();
            stream.getTracks().forEach((t) => t.stop());
        }, 5000);
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
        beforeCloseModal();
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
                        <audio
                            className={s.previewAudio}
                            ref={audioPreviewRef}
                            autoPlay
                            playsInline
                            controls
                        ></audio>
                    </div>
                    <div className={s.deviceLists}>
                        {isSelectAudioInput && (
                            <>
                                <DeviceList
                                    label={audioInputDeviceLabel}
                                    devices={audioInputDevices}
                                    onChange={handleChangeAudioInputDevice}
                                ></DeviceList>
                                <div className={s.buttons}>
                                    <Button
                                        className={s.recordingButton}
                                        onClick={handleRecordingClick}
                                        disabled={isRecordingButtonDisabled}
                                    >
                                        {recordingButtonText}
                                    </Button>
                                </div>
                            </>
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

export default SelectMediaDevicesRecordingModal;
