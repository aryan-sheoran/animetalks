/* filepath: /home/luffy/anime-talks/anitalks-project/client/src/components/Manga/CountdownTimer.jsx */
import React, { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [targetDate]);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className={styles.countdown}>
      <div className={styles.countdownItem}>
        <span className={styles.countdownNumber}>{formatNumber(timeLeft.days)}</span>
        <span className={styles.countdownLabel}>Days</span>
      </div>
      <div className={styles.countdownItem}>
        <span className={styles.countdownNumber}>{formatNumber(timeLeft.hours)}</span>
        <span className={styles.countdownLabel}>Hours</span>
      </div>
      <div className={styles.countdownItem}>
        <span className={styles.countdownNumber}>{formatNumber(timeLeft.minutes)}</span>
        <span className={styles.countdownLabel}>Minutes</span>
      </div>
      <div className={styles.countdownItem}>
        <span className={styles.countdownNumber}>{formatNumber(timeLeft.seconds)}</span>
        <span className={styles.countdownLabel}>Seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;