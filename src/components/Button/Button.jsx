import React from 'react';
import styles from './Button.module.css';

const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  onClick,
  children,
  className = '',
  ...props
}) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;