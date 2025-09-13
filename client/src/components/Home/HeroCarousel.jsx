import React, { useState, useEffect } from 'react';
import styles from './HeroCarousel.module.css';
import glassStyles from '../../styles/glassmorphism.module.css';

const HeroCarousel = ({ heroData, onImageClick }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Hero section auto-slide
  useEffect(() => {
    if (!heroData || heroData.length === 0) return; // guard against empty data

    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroData.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [heroData]);

  const handleHeroDotClick = (index) => {
    setCurrentHeroIndex(index);
  };

  return (
    <div className={styles.heroSection} id="hero-section">
      {heroData.map((item, index) => (
        <div 
          key={index}
          className={`${styles.heroSlide} ${index === currentHeroIndex ? styles.active : ''}`}
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <div className={styles.heroContent}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <button 
              className={`${styles.btn} ${glassStyles.gradientButton}`} 
              onClick={() => onImageClick && onImageClick(item.image, item.title, item.description || '', item.showId || item.id)}
            >
              Review Now
            </button>
          </div>
        </div>
      ))}
      
      <div className={styles.heroNav}>
        {heroData.map((_, index) => (
          <div 
            key={index}
            className={`${styles.heroNavDot} ${index === currentHeroIndex ? styles.active : ''}`}
            onClick={() => handleHeroDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;