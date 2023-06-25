import { useState } from 'react';
import {
    SelectMediaDevicesPreviewModal,
    SelectMediaDevicesModal,
    SelectMediaDevicesRecordingModal,
} from 'react-select-media-devices-modal';

function App() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalWithPreviewOpen, setModalWithPreviewOpen] = useState(false);
    const [modalWithRecordingOpen, setModalWithRecordingOpen] = useState(false);
    const [devices, setDevices] = useState();

    const handleDeviceSelected = (devices) => {
        setModalOpen(false);
        setModalWithPreviewOpen(false);
        setModalWithRecordingOpen(false);
        setDevices(devices);
    };

    const handleDeviceSelectCanceled = () => {
        setModalOpen(false);
        setModalWithPreviewOpen(false);
        setModalWithRecordingOpen(false);
    };

    return (
        <>
            <div>
                <button onClick={() => setModalOpen((current) => !current)}>Select Device</button>
                <button onClick={() => setModalWithPreviewOpen((current) => !current)}>
                    Select Device with Preview
                </button>
                <button onClick={() => setModalWithRecordingOpen((current) => !current)}>
                    Select Device with Recording
                </button>
            </div>

            <pre>{JSON.stringify(devices, null, 2)}</pre>
            <SelectMediaDevicesModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={modalOpen}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={true}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesModal>
            <SelectMediaDevicesPreviewModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={modalWithPreviewOpen}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={true}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesPreviewModal>
            <SelectMediaDevicesRecordingModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={modalWithRecordingOpen}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                recordingButtonText="Recording"
                allowOutsideClick={true}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesRecordingModal>
        </>
    );
}

export default App;
