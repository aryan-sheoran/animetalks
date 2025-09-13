import React from 'react';
import styles from './FeaturedAnime.module.css';
import glassStyles from '../../styles/glassmorphism.module.css';

const FeaturedAnime = ({ featuredAnimes, onImageClick }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Featured Anime</h2>
      </div>
      <div className={styles.featuredAnimeGrid}>
        {featuredAnimes.map((anime, index) => {
          const id = anime.showId || anime.id || '';
          const hasValidId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

          return (
            <div 
              key={index} 
              className={styles.featuredAnimeCard} 
              style={{ backgroundImage: `url('${anime.image}')` }}
            >
              <div className={styles.featuredAnimeContent}>
                <h3>{anime.title}</h3>
                <p>{anime.description}</p>
                <button 
                  className={`${styles.btn} ${glassStyles.gradientButton}`} 
                  onClick={() => {
                    if (onImageClick) {
                      // Always pass description as third arg; pass showId as fourth when valid
                      if (hasValidId) onImageClick(anime.image, anime.title, anime.description || '', id);
                      else onImageClick(anime.image, anime.title, anime.description || '');
                    }
                  }}
                >
                  Review Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedAnime;