# react-select-media-devices-modal

[![npm version](https://badge.fury.io/js/react-select-media-devices-modal.svg)](https://badge.fury.io/js/react-select-media-devices-modal)
[![Test](https://github.com/kadoshita/react-select-media-devices-modal/actions/workflows/test.yaml/badge.svg?branch=master)](https://github.com/kadoshita/react-select-media-devices-modal/actions/workflows/test.yaml)
[![E2E Test](https://github.com/kadoshita/react-select-media-devices-modal/actions/workflows/e2e-test.yaml/badge.svg)](https://github.com/kadoshita/react-select-media-devices-modal/actions/workflows/e2e-test.yaml)
[![Release](https://github.com/kadoshita/react-select-media-devices-modal/actions/workflows/release.yaml/badge.svg)](https://github.com/kadoshita/react-select-media-devices-modal/actions/workflows/release.yaml)
[![Deploy to GitHub Pages](https://github.com/kadoshita/react-select-media-devices-modal/actions/workflows/deploy.yaml/badge.svg?branch=master)](https://github.com/kadoshita/react-select-media-devices-modal/actions/workflows/deploy.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React component library for select media devices.

## Features

- Select audio input, audio output, and video input device.
- Show preview media stream get from selected device.

## Demo

[https://kadoshita.github.io/react-select-media-devices-modal/example/](https://kadoshita.github.io/react-select-media-devices-modal/example/)

## Installation

```shell
npm install --save react-select-media-devices-modal
```

## Usage

### SelectMediaDevicesModal

```jsx
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
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={false}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesModal>
        </div>
    );
}

export default App;
```

### SelectMediaDevicesPreviewModal

```jsx
import { useState } from 'react';
import { SelectMediaDevicesPreviewModal } from 'react-select-media-devices-modal';

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
            <SelectMediaDevicesPreviewModal
                isSelectAudioInput
                isSelectAudioOutput
                isSelectVideoInput
                open={modalOpen}
                audioInputDeviceLabel="Audio input device"
                audioOutputDeviceLabel="Audio output device"
                videoInputDeviceLabel="Video input device"
                confirmButtonText="Confirm"
                cancelButtonText="Cancel"
                allowOutsideClick={false}
                onDeviceSelected={handleDeviceSelected}
                onDeviceSelectCanceled={handleDeviceSelectCanceled}
            ></SelectMediaDevicesPreviewModal>
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
| confirmButtonText | `string` | `'Confirm'` | Label for the confirm button. |
| cancelButtonText | `string` | `'Cancel'` | Label for the cancel button. |
| allowOutsideClick | `boolean` | `true` | Flag that cancel selection when clicking outside of the modal. |
| onDeviceSelected | `function` | `(devices: { audioInput?: MediaDeviceInfo; audioOutput?: MediaDeviceInfo; videoInput?: MediaDeviceInfo; }) => void` | Handler function called when devices are selected. |
| onDeviceSelectCanceled | `function` | `() => void` | Handler function called when selection canceled. |

### `SelectMediaDevicesPreviewModalProps`

| Name | Type | Default | Description |
| :--- | :--- | :------ | :---------- |
| isSelectAudioInput | `boolean` | `true` | Flag that select an audio input device or not. |
| isSelectAudioOutput | `boolean` | `true` | Flag that select an audio output device or not. |
| isSelectVideoInput | `boolean` | `true` | Flag that select a video input device or not. |
| open | `boolean` | `false` | Flag that open the modal or not. |
| audioInputDeviceLabel | `string` | `'audio input device'` | Label for list of audio input devices. |
| audioOutputDeviceLabel | `string` | `'audio output device'` | Label for list of audio output devices. |
| videoInputDeviceLabel | `string` | `'video input device'` | Label for list of video input devices. |
| confirmButtonText | `string` | `'Confirm'` | Label for the confirm button. |
| cancelButtonText | `string` | `'Cancel'` | Label for the cancel button. |
| allowOutsideClick | `boolean` | `true` | Flag that cancel selection when clicking outside of the modal. |
| onDeviceSelected | `function` | `(devices: { audioInput?: MediaDeviceInfo; audioOutput?: MediaDeviceInfo; videoInput?: MediaDeviceInfo; }) => void` | Handler function called when devices are selected. |
| onDeviceSelectCanceled | `function` | `() => void` | Handler function called when selection canceled. |

## LICENSE

[MIT](https://github.com/kadoshita/react-select-media-devices-modal/blob/master/LICENSE)

## Author

[Yoshiki Kadoshita](https://github.com/kadoshita)
