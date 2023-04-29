import React, { ReactNode } from 'react';
interface ButtonProps {
    className: string;
    children: ReactNode;
    onClick: () => void;
}

const Button = ({ className, children, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} className={[className].filter(Boolean).join(' ')}>
            {children}
        </button>
    );
};

export default Button;
