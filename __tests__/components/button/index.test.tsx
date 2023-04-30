import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../../src/SelectMediaDevicesModal/components/button';
import { vi } from 'vitest';

describe('button', () => {
    it('should render button', () => {
        render(<Button onClick={vi.fn()}>test</Button>);

        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('should clickable button', async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>test</Button>);

        await userEvent.click(screen.getByText('test'));

        expect(handleClick).toBeCalledTimes(1);
    });
});
