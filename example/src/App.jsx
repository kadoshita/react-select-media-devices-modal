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
                audioInputDeviceLabel="音声入力デバイス"
                audioOutputDeviceLabel="音声出力デバイス"
                videoInputDeviceLabel="映像入力デバイス"
                OkButtonText="決定"
                CancelButtonText="キャンセル"
                allowOutsideClick={false}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesModal>
        </>
    );
}

export default App;
