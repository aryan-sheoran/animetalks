import React, { useState, useEffect } from 'react';
import Button from './Button';
import styles from './CombinedReview.module.css';
import apiClient from '../../utils/api';

const CombinedReview = ({
  reviewTitle,
  setReviewTitle,
  reviewText,
  setReviewText,
  onSubmit,
  onClear,
  showId,
  showTitle,
  seasons = [],
  userRatings = [],
  onRatingUpdate,
}) => {
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [seasonRatings, setSeasonRatings] = useState({});
  const [seasonReviews, setSeasonReviews] = useState({});

  useEffect(() => {
    const ratingsMap = {};
    const reviewsMap = {};
    
    userRatings.forEach(rating => {
      ratingsMap[rating.seasonNumber] = rating.rating;
      reviewsMap[rating.seasonNumber] = rating.review || '';
    });
    
    setSeasonRatings(ratingsMap);
    setSeasonReviews(reviewsMap);
  }, [userRatings]);

  const handleStarClick = (seasonNumber, rating) => {
    setSeasonRatings(prev => ({
      ...prev,
      [seasonNumber]: rating
    }));
  };

  const handleReviewChange = (seasonNumber, review) => {
    setSeasonReviews(prev => ({
      ...prev,
      [seasonNumber]: review
    }));
  };

  const handleSubmitRating = async (seasonNumber, seasonTitle) => {
    const rating = seasonRatings[seasonNumber];
    const review = seasonReviews[seasonNumber] || '';

    if (!rating || rating < 1) {
      alert('Please select a rating before submitting.');
      return;
    }

    try {
      const response = await apiClient.post('/ratings/season', {
        showId,
        seasonNumber,
        seasonTitle,
        rating,
        review
      });

      onRatingUpdate?.(response.data);
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error.response?.data?.message || error.message || 'Failed to submit rating');
      alert('Failed to submit rating. Please try again.');
    }
  };

  const seasonsToShow = seasons.length > 0 ? seasons : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className={styles.reviewForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Review Title</label>
        <input
          type="text"
          className={styles.formControl}
          placeholder="Give your review a catchy title"
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Your Review</label>
        <textarea
          className={`${styles.formControl} ${styles.reviewTextarea}`}
          placeholder="What did you like or dislike about this anime? Share your thoughts..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>

      <div className={styles.seasonRating}>
        <h3 className={styles.sectionTitle}>Rate Seasons</h3>
        <div className={styles.seasonsList}>
          {seasonsToShow.map((season) => (
            <div key={season.seasonNumber} className={styles.seasonCard}>
              <div className={styles.seasonHeader}>
                <div className={styles.seasonInfo}>
                  <h4 className={styles.seasonTitle}>
                    Season {season.seasonNumber}: {season.title}
                  </h4>
                  {season.episodes > 0 && (
                    <span className={styles.episodeCount}>
                      {season.episodes} Episodes
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.expandButton}
                  onClick={() => setExpandedSeason(expandedSeason === season.seasonNumber ? null : season.seasonNumber)}
                >
                  <i className={`fas fa-chevron-down ${expandedSeason === season.seasonNumber ? styles.expanded : ''}`}></i>
                </button>
              </div>

              {expandedSeason === season.seasonNumber && (
                <div className={styles.seasonBody}>
                  <div className={styles.starRating}>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <i
                          key={star}
                          className={`fas fa-star ${seasonRatings[season.seasonNumber] >= star ? styles.rated : ''}`}
                          onClick={() => handleStarClick(season.seasonNumber, star)}
                        ></i>
                      ))}
                    </div>
                    <div className={styles.ratingValue}>
                      {seasonRatings[season.seasonNumber] ? `${seasonRatings[season.seasonNumber]}/5` : 'Rate'}
                    </div>
                  </div>
                  <textarea
                    className={styles.seasonReviewInput}
                    placeholder={`Tell us what you think about Season ${season.seasonNumber}...`}
                    value={seasonReviews[season.seasonNumber] || ''}
                    onChange={(e) => handleReviewChange(season.seasonNumber, e.target.value)}
                  />
                  <div className={styles.seasonActions}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSubmitRating(season.seasonNumber, season.title)}
                    >
                      Submit Season Rating
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reviewActions}>
        <Button
          type="submit"
          variant="primary"
          icon="fas fa-check"
        >
          Submit Review
        </Button>
        <Button
          type="button"
          variant="outline"
          icon="fas fa-redo"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </form>
  );
};

export default CombinedReview;
