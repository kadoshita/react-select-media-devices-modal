import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DeviceList from '../../../src/components/deviceList';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('deviceList', () => {
    it('should render deviceList', () => {
        render(
            <DeviceList
                devices={[
                    {
                        deviceId: '',
                        kind: 'audioinput',
                        label: 'fake device',
                        groupId: '',
                        toJSON: vi.fn(),
                    },
                ]}
                label="test"
                onChange={vi.fn()}
            ></DeviceList>
        );

        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('fake device')).toBeInTheDocument();
    });

    it('should fire handler function when select an item', async () => {
        const handleSelect = vi.fn();

        render(
            <DeviceList
                devices={[
                    {
                        deviceId: 'fake device1 id',
                        kind: 'audioinput',
                        label: 'fake device1',
                        groupId: '',
                        toJSON: vi.fn(),
                    },
                    {
                        deviceId: 'fake device2 id',
                        kind: 'audioinput',
                        label: 'fake device2',
                        groupId: '',
                        toJSON: vi.fn(),
                    },
                    {
                        deviceId: 'fake device3 id',
                        kind: 'audioinput',
                        label: 'fake device3',
                        groupId: '',
                        toJSON: vi.fn(),
                    },
                ]}
                label="test"
                onChange={handleSelect}
            ></DeviceList>
        );

        await userEvent.selectOptions(screen.getByLabelText('test'), 'fake device2 id');

        expect(handleSelect).toBeCalledWith('fake device2 id');

        await userEvent.selectOptions(screen.getByLabelText('test'), 'fake device3 id');

        expect(handleSelect).toBeCalledWith('fake device3 id');
    });
});
