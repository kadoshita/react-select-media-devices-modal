import { useState } from 'react';
import { SelectMediaDevicesModal } from 'react-select-media-devices-modal';

function App() {
    const [modalOpen, setModalOpen] = useState(false);
    const [devices, setDevices] = useState();

    const handleDeviceSelected = (devices) => {
        setModalOpen(false);
        setDevices(devices);
    };

    const handleDeviceSelectCanceled = () => {
        setModalOpen(false);
    };

    return (
        <>
            <button onClick={() => setModalOpen((current) => !current)}>Select Device</button>
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
        </>
    );
}

export default App;
