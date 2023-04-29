# react-select-media-devices-modal

A React component library for select media devices.

## Features

- Select audio input, audio output, and video input device.

## Installation

```shell
npm install --save react-select-media-devices-modal
```

## Usage

```tsx
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
        <div>
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
        </div>
    );
}

export default App;
```

## Props

### `SelectMediaDevicesModalProps`

| Name | Type | Default | Description |
| :--- | :--- | :------ | :---------- |
| isSelectAudioInput | `boolean` | `true` | Flag that select an audio input device or not. |
| isSelectAudioOutput | `boolean` | `true` | Flag that select an audio output device or not. |
| isSelectVideoInput | `boolean` | `true` | Flag that select a video input device or not. |
| open | `boolean` | `false` | Flag that open the modal or not. |
| audioInputDeviceLabel | `string` | `'audio input device'` | Label for list of audio input devices. |
| audioOutputDeviceLabel | `string` | `'audio output device'` | Label for list of audio output devices. |
| videoInputDeviceLabel | `string` | `'video input device'` | Label for list of video input devices. |
| ConfirmButtonText | `string` | `'Confirm'` | Label for the confirm button. |
| CancelButtonText | `string` | `'Cancel'` | Label for the cancel button. |
| allowOutsideClick | `boolean` | `true` | Flag that cancel selection when clicking outside of the modal. |
| onDeviceSelected | `function` | `(devices: { audioInput?: MediaDeviceInfo; audioOutput?: MediaDeviceInfo; videoInput?: MediaDeviceInfo; }) => void` | Handler function called when devices are selected. |
| onDeviceSelectCanceled | `function` | `() => void` | Handler function called when selection canceled. |

## LICENSE

[MIT](https://github.com/kadoshita/react-select-media-devices-modal/blob/master/LICENSE)

## Author

[Yoshiki Kadoshita](https://github.com/kadoshita)
