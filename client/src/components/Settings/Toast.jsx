import React, { useEffect } from 'react';
import styles from '../../pages/setting/setting.module.css';

const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${visible ? styles.show : ''}`}>
        <div className={styles.toastContent}>
          <i className="fas fa-check-circle"></i>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Toast;