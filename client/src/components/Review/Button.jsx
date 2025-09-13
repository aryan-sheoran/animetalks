import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  icon, 
  onClick, 
  type = 'button',
  ...props 
}) => {
  const buttonClass = variant === 'primary' ? styles.btnPrimary : styles.btnOutline;

  return (
    <button
      type={type}
      className={`${styles.btn} ${buttonClass}`}
      onClick={onClick}
      {...props}
    >
      {icon && <i className={`${icon} ${styles.icon}`}></i>}
      {children}
    </button>
  );
};

export default Button;