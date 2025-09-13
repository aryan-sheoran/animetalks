import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Review.module.css';
import Header from '../../components/Review/Header';
import AnimeInfo from '../../components/Review/AnimeInfo';
import ReviewForm from '../../components/Review/ReviewForm';

import Sidebar from '../../components/common/sidebar/Sidebar';
import apiClient from '../../utils/api';

const Review = () => {
  const [rating, setRating] = useState(4);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [bestMoment, setBestMoment] = useState('');
  const [worstMoment, setWorstMoment] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState('');
  const [showData, setShowData] = useState({
    id: null,
    title: '',
    image: '',
    info: '',
    seasons: []
  });
  const [userSeasonRatings, setUserSeasonRatings] = useState([]);
  const [existingReviews, setExistingReviews] = useState([]);
  const [episodeReviews, setEpisodeReviews] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const showIdParam = urlParams.get('showId');

    if (showIdParam) {
      loadShowData(showIdParam);
      loadUserSeasonRatings(showIdParam);
      loadExistingReviews(showIdParam);
    } else {
      const imageParam = urlParams.get('image');
      const titleParam = urlParams.get('title');
      setShowData(prev => ({
        ...prev,
        id: null,
        title: titleParam ? decodeURIComponent(titleParam) : 'Select a show to review',
        image: imageParam ? `/assets/card-images/${decodeURIComponent(imageParam)}` : '',
        info: '',
        seasons: []
      }));
    }
  }, [location.search]);

  const loadShowData = async (showId) => {
    try {
      const response = await apiClient.get(`/shows/${showId}`);
      setShowData({
        id: response.data._id,
        title: response.data.title,
        image: response.data.coverImageUrl || response.data.cardImage, // Use cover image, fallback to card image
        info: response.data.description, // Corrected from response.data.type
        seasons: response.data.seasons || [],
      });
    } catch {
      console.error('Failed to load show data, falling back to URL params');
      const urlParams = new URLSearchParams(location.search);
      const imageParam = urlParams.get('image');
      const titleParam = urlParams.get('title');
      setShowData(prev => ({
        ...prev,
        id: showId,
        title: titleParam ? decodeURIComponent(titleParam) : 'Unknown Show',
        image: imageParam ? `/assets/card-images/${decodeURIComponent(imageParam)}` : '/assets/card-images/default.jpeg',
        seasons: [
          {
            seasonNumber: 1,
            title: 'Season 1',
            episodes: 12,
            status: 'Finished'
          },
          {
            seasonNumber: 2,
            title: 'Season 2',
            episodes: 12,
            status: 'Finished'
          }
        ],
      }));
    }
  };

  const loadUserSeasonRatings = async (showId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await apiClient.get(`/ratings/show/${showId}?userId=${getUserId()}`);
      setUserSeasonRatings(response.data);
    } catch (error) {
      console.error('Error loading user season ratings:', error);
    }
  };

  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const loadExistingReviews = async (showId) => {
    try {
      const response = await apiClient.get(`/reviews/anime/${showId}`);
      setExistingReviews(response.data);
    } catch (error) {
      console.error('Error loading existing reviews:', error);
    }
  };

  const loadEpisodeReviews = async (showId, seasonNumber, episodeNumber) => {
    try {
      const response = await apiClient.get(`/reviews/anime/${showId}/season/${seasonNumber}/episode/${episodeNumber}`);
      setEpisodeReviews(response.data);
    } catch (error) {
      console.error('Error loading episode reviews:', error);
    }
  };

  // Load episode reviews when season/episode selection changes
  useEffect(() => {
    if (showData.id && selectedSeason && selectedEpisode) {
      loadEpisodeReviews(showData.id, selectedSeason, selectedEpisode);
    }
  }, [showData.id, selectedSeason, selectedEpisode]);

  const handleSeasonRatingUpdate = (updatedRating) => {
    setUserSeasonRatings(prev => {
      const existingIndex = prev.findIndex(
        r => r.seasonNumber === updatedRating.seasonNumber
      );
      
      if (existingIndex !== -1) {
        // Update existing rating
        const updated = [...prev];
        updated[existingIndex] = updatedRating;
        return updated;
      } else {
        // Add new rating
        return [...prev, updatedRating];
      }
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewTitle || !reviewText) {
      alert('Please provide a title and content for your review.');
      return;
    }

    const reviewData = {
      animeId: showData.id,
      animeTitle: showData.title,
      animeImage: showData.image,
      rating,
      title: reviewTitle,
      content: reviewText,
      bestMoment: bestMoment || '',
      worstMoment: worstMoment || '',
      seasonNumber: selectedSeason || null,
      episodeNumber: selectedEpisode || null,
    };

    try {
      await apiClient.post('/reviews', reviewData);
      alert('Review submitted successfully!');
      handleClearReview();
      // Refresh reviews after successful submission
      if (showData.id) {
        loadExistingReviews(showData.id);
        if (selectedSeason && selectedEpisode) {
          loadEpisodeReviews(showData.id, selectedSeason, selectedEpisode);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(`Failed to submit review: ${error.response?.data?.message || error.message || 'An error occurred'}`);
    }
  };

  const handleClearReview = () => {
    setRating(0);
    setReviewTitle('');
    setReviewText('');
    setBestMoment('');
    setWorstMoment('');
    setSelectedSeason('');
    setSelectedEpisode('');
  };

  return (
    // 2. Use a root container similar to other pages
    <div className={styles.reviewRoot}>
      {/* Glass Background Elements */}
      <div className={`${styles.glassOrb} ${styles.orb1}`}></div>
      <div className={`${styles.glassOrb} ${styles.orb2}`}></div>
      <div className={`${styles.glassOrb} ${styles.orb3}`}></div>

      {/* 3. Use the Sidebar component */}
      <Sidebar />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.reviewHeader}>
          <Header />
        </div>

        {/* Two Column Layout */}
        <div className={styles.reviewColumns}>
          {/* Column 1: Anime Information */}
          <div className={styles.leftColumn}>
            <AnimeInfo 
              animeData={showData}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
              selectedEpisode={selectedEpisode}
              setSelectedEpisode={setSelectedEpisode}
            />
          </div>

          {/* Column 2: Review Form */}
          <div className={styles.rightColumn}>
            <ReviewForm
              rating={rating}
              setRating={setRating}
              reviewTitle={reviewTitle}
              setReviewTitle={setReviewTitle}
              reviewText={reviewText}
              setReviewText={setReviewText}
              bestMoment={bestMoment}
              setBestMoment={setBestMoment}
              worstMoment={worstMoment}
              setWorstMoment={setWorstMoment}
              onSubmit={handleSubmitReview}
              onClear={handleClearReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;