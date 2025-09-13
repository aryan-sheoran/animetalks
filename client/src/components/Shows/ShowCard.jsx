/* filepath: /home/luffy/anime-talks/anitalks-project/client/src/components/Shows/ShowCard.jsx */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ShowCard.module.css';

const ShowCard = ({ show, index, onImageClick, isAdded, onAddToMyShows }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = () => {
    if (onImageClick) {
        onImageClick();
    } else {
        const showId = show._id || show.id || show.showId || '';
        navigate(`/review?showId=${showId}`);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (onAddToMyShows) {
        onAddToMyShows();
    }
  };

  // Show average rating as a single star + numeric value out of 10
  const avgRating = Number.isFinite(Number(show?.rating)) ? Number(show.rating) : null;
  const ratingOutOf10 = avgRating !== null ? (avgRating * 2).toFixed(1) : null;

  return (
    <div className={`${styles.cardWrapper} ${isAnimated ? styles.animated : ''}`}>
      <div 
        className={styles.showCard}
        onClick={handleClick}
      >
                <img src={show.image} alt={show.title} />
        <div className={styles.showInfo}>
          <div className={styles.showTitle}>{show.title}</div>

          <div className={styles.showRating}>
            <i className={`fas fa-star ${styles.singleStar}`} aria-hidden></i>
            <span className={styles.ratingValue}>{ratingOutOf10 ? `${ratingOutOf10}/10` : '—'}</span>
          </div>
        </div>
      </div>
      <button onClick={handleAddClick} disabled={isAdded} className={styles.addBtn}>
        {isAdded ? 'Added' : 'ADD to my shows'}
      </button>
    </div>
  );
};

export default ShowCard;