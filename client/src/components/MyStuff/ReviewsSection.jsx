import React from 'react';
import styles from './ReviewsSection.module.css';

const ReviewsSection = ({ reviews }) => {
  // Default reviews data if none provided
  const defaultReviews = [
    { title: 'Demon Slayer: Kimetsu no Yaiba', rating: 4.0 },
    { title: 'Attack on Titan', rating: 4.5 },
    { title: 'My Hero Academia', rating: 3.8 }
  ];

  const reviewsData = reviews && reviews.length > 0 ? reviews : [];
  const totalReviews = reviewsData.length;
  const averageRating = totalReviews > 0 
    ? (reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  return (
    <div className={`${styles.reviewsInfo} ${styles.glassCard}`}>
      <h3>Reviews ({totalReviews})</h3>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>📊</div>
        <div className={styles.statDetails}>
          <div className={styles.statNumber}>{totalReviews}</div>
          <div className={styles.statLabel}>Total Reviews</div>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>⭐</div>
        <div className={styles.statDetails}>
          <div className={styles.statNumber}>{averageRating}</div>
          <div className={styles.statLabel}>Average Rating</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;