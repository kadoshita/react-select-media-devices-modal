import { useState } from 'react';
import { SelectMediaDevicesModal } from 'react-select-media-devices-modal';

function App() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleDeviceSelected = (devices) => {
        setModalOpen(false);
        console.log(devices);
    };

    const handleDeviceSelectCanceled = () => {
        setModalOpen(false);
    };

    return (
        <>
            <button onClick={() => setModalOpen((current) => !current)}>Select Device</button>
            <SelectMediaDevicesModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={modalOpen}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                ConfirmButtonText="Confirm"
                CancelButtonText="Cancel"
                allowOutsideClick={false}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesModal>
        </>
    );
}

export default App;
