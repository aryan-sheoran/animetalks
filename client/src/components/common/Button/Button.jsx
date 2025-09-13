import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon, 
  onClick, 
  type = 'button',
  ...props 
}) => {
  const buttonClass = `${styles.btn} ${styles[variant]} ${styles[size]}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      {...props}
    >
      {icon && <i className={`${icon} ${styles.icon}`}></i>}
      {children}
    </button>
  );
};

export default Button;
