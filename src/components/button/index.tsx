import React, { ReactNode } from 'react';

interface ButtonProps {
    className?: string;
    children: ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
    onClick: () => void;
}

const Button = ({ children, disabled, style: styleProps, onClick }: ButtonProps) => {
    const defaultStyle = {
        borderRadius: '4px',
        height: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
        backgroundColor: 'white',
        borderWidth: '1px',
    };
    const style: ButtonProps['style'] = styleProps ? { ...defaultStyle, ...styleProps } : defaultStyle;

    return (
        <button onClick={onClick} disabled={disabled} style={style}>
            {children}
        </button>
    );
};

export default Button;
