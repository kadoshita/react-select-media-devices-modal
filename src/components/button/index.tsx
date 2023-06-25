import React, { ReactNode } from 'react';
import s from './style.module.css';

interface ButtonProps {
    className?: string;
    children: ReactNode;
    disabled?: boolean;
    onClick: () => void;
}

const Button = ({ className, children, disabled, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} disabled={disabled} className={[s.button, className].filter(Boolean).join(' ')}>
            {children}
        </button>
    );
};

export default Button;
