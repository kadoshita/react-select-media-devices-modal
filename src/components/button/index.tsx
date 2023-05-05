import React, { ReactNode } from 'react';
import s from './style.module.css';

interface ButtonProps {
    className?: string;
    children: ReactNode;
    onClick: () => void;
}

const Button = ({ className, children, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} className={[s.button, className].filter(Boolean).join(' ')}>
            {children}
        </button>
    );
};

export default Button;
