import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../../src/components/button';

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
