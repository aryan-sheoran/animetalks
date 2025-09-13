/* filepath: /home/luffy/anime-talks/anitalks-project/client/src/components/Manga/FeatureCard.jsx */
import React, { useEffect, useState } from 'react';
import styles from './FeatureCard.module.css';

const FeatureCard = ({ icon, title, description, index }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, index * 200);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`${styles.feature} ${isAnimated ? styles.animated : ''}`}>
      <i className={icon}></i>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;