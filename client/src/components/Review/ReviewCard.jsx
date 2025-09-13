import React from 'react';
import styles from './ReviewCard.module.css';

const ReviewCard = ({ 
  rating, 
  setRating, 
  animeData, 
  selectedSeason, 
  setSelectedSeason, 
  selectedEpisode, 
  setSelectedEpisode 
}) => {
  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const title = animeData?.title || 'Unknown Anime';
  const image = animeData?.image;
  const info = animeData?.info || '';

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value);
    setSelectedEpisode(''); // Reset episode on season change
  };

  const currentSeason = animeData?.seasons?.find(s => s.seasonNumber == selectedSeason);
  const episodeCount = currentSeason?.episodes || 0;

  return (
    <div className={styles.reviewCard}>
      <div className={styles.animePoster}>
        <img 
          src={image}
          alt={`${title} Poster`}
        />
        <div className={styles.glassOverlay}></div>
      </div>

      <h1 className={styles.animeTitle}>{title}</h1>
      <div className={styles.animeInfo}>{info}</div>

      <div className={styles.selectionControls}>
        <div className={styles.selectWrapper}>
          <label htmlFor="season-select">Season</label>
          <select 
            id="season-select"
            className={styles.selectDropdown}
            value={selectedSeason} 
            onChange={handleSeasonChange}
          >
            <option value="" disabled>Select</option>
            {animeData?.seasons?.map(season => (
              <option key={season.seasonNumber} value={season.seasonNumber}>
                {season.seasonNumber}: {season.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <label htmlFor="episode-select">Episode</label>
          <select 
            id="episode-select"
            className={styles.selectDropdown}
            value={selectedEpisode} 
            onChange={(e) => setSelectedEpisode(e.target.value)}
            disabled={!selectedSeason}
          >
            <option value="" disabled>Select</option>
            {episodeCount > 0 &&
              [...Array(episodeCount).keys()].map(e => (
                <option key={e + 1} value={e + 1}>
                  {e + 1}
                </option>
              ))
            }
          </select>
        </div>
      </div>

      <div className={`${styles.ratingSection} ${styles.glassCard}`}>
        <div className={styles.ratingQuestion}>How would you rate this episode?</div>
        <div className={styles.stars}>
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`${styles.star} ${index < rating ? styles.active : ''}`}
              onClick={() => handleStarClick(index)}
            >
              <i className="fas fa-star"></i>
            </div>
          ))}
        </div>
        <div className={styles.ratingValue}>{rating.toFixed(1)}</div>
      </div>
    </div>
  );
};

export default ReviewCard;