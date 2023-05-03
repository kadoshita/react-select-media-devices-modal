import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DeviceItem from '../../../src/components/deviceItem';

describe('deviceItem', () => {
    it('should render deviceItem', () => {
        render(<DeviceItem value="test value" name="test"></DeviceItem>);

        const element = screen.getByText<HTMLOptionElement>('test');
        expect(element).toBeInTheDocument();
        expect(element.value).toBe('test value');
    });
});
