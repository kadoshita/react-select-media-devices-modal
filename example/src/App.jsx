import { useState } from 'react';
import { SelectMediaDevicesModal } from 'react-select-media-devices-modal';

function App() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleDeviceSelected = (device) => {
        setModalOpen(false);
        console.log(device);
    };

    return (
        <>
            <button onClick={() => setModalOpen((current) => !current)}>Select Device</button>
            <SelectMediaDevicesModal open={modalOpen} onDeviceSelected={handleDeviceSelected}></SelectMediaDevicesModal>
        </>
    );
}

export default App;
