/* filepath: /home/luffy/anime-talks/anitalks-project/client/src/pages/Shows/Shows.jsx */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/sidebar/Sidebar';
import ShowCard from '../../components/Shows/ShowCard';
import apiClient from '../../utils/api'; // Import the API client
import { getImageSrc } from '../../utils/imageUtils';
import styles from './Shows.module.css';

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userShowIds, setUserShowIds] = useState(new Set());
  const [popup, setPopup] = useState({ show: false, message: '' });
  const navigate = useNavigate();

  const filterCategories = [
    { id: 'all', label: 'All' },
    { id: 'action', label: 'Action' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'fantasy', label: 'Fantasy' }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [showsResponse, userShowsResponse] = await Promise.all([
          apiClient.get('/shows'),
          apiClient.get('/user-shows')
        ]);

        // Format basic show data
        const showsData = showsResponse.data.map(show => ({
          ...show,
          id: show._id,
          image: getImageSrc(show),
          category: show.genre && show.genre.length > 0 ? show.genre[0].toLowerCase() : 'action',
          // start with backend-provided show rating if available, otherwise null until we compute from season ratings
          rating: show.rating ?? null
        }));

        // For each show, fetch season ratings and compute an average rating
        const showsWithRatings = await Promise.all(showsData.map(async (s) => {
          try {
            // Fetch season ratings (5-point scale)
            const res = await apiClient.get(`/ratings/show/${s._id}`);
            const ratingsArray = Array.isArray(res.data) ? res.data : [];

            // Also fetch reviews for this anime (reviews use 0-10 scale)
            let reviewRatingsArray = [];
            try {
              const reviewsRes = await apiClient.get(`/reviews/anime/${s._id}`);
              reviewRatingsArray = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
            } catch (revErr) {
              // If reviews endpoint fails for a show, continue with season ratings only
              console.warn(`Failed to fetch reviews for show ${s._id}:`, revErr);
              reviewRatingsArray = [];
            }

            // Normalize ratings: season ratings are 0-5 already; review ratings are 0-10 -> convert to 0-5
            const seasonVals = ratingsArray.map(r => Number(r.rating || 0)).filter(v => !Number.isNaN(v));
            const reviewVals = reviewRatingsArray
              .map(r => {
                const val = Number(r.rating);
                return Number.isFinite(val) ? Math.max(0, Math.min(5, val / 2)) : null; // convert to 0-5
              })
              .filter(v => v !== null && !Number.isNaN(v));

            const allVals = [...seasonVals, ...reviewVals];

            if (allVals.length === 0) {
              // No ratings at all; fall back to backend-provided show.rating if present or null
              return { ...s, rating: s.rating ?? null };
            }

            const avg = allVals.reduce((sum, v) => sum + v, 0) / allVals.length;
            return { ...s, rating: Number(avg.toFixed(1)) };
          } catch (err) {
            console.warn(`Failed to fetch season ratings for show ${s._id}:`, err);
            return { ...s, rating: s.rating ?? null };
          }
        }));

        setShows(showsWithRatings);
        setFilteredShows(showsWithRatings);

        const userShowIdSet = new Set(userShowsResponse.data.filter(userShow => userShow.showId).map(userShow => userShow.showId._id));
        setUserShowIds(userShowIdSet);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    filterAndSearchShows();
  }, [shows, activeFilter, searchQuery]);

  const filterAndSearchShows = () => {
    let filtered = shows;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(show => show.category === activeFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(show => 
        show.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredShows(filtered);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddToMyShows = async (showId) => {
    if (userShowIds.has(showId)) {
      setPopup({ show: true, message: 'This show is already in your list.' });
      setTimeout(() => setPopup({ show: false, message: '' }), 3000);
      return;
    }

    try {
      await apiClient.post('/user-shows', { showId });
      setUserShowIds(prevIds => new Set([...prevIds, showId]));
      setPopup({ show: true, message: 'Show added successfully!' });
      setTimeout(() => setPopup({ show: false, message: '' }), 3000);
    } catch (error) {
      console.error('Failed to add show to user list', error);
      const errorMessage = error.response?.data?.message || 'Failed to add show. Please try again.';
      setPopup({ show: true, message: errorMessage });
      setTimeout(() => setPopup({ show: false, message: '' }), 3000);
    }
  };

  const handleImageClick = (imageSrc, title, showId) => {
    const imageParam = encodeURIComponent(imageSrc);
    const titleParam = encodeURIComponent(title);
    const showIdParam = showId || '';
    navigate(`/review?image=${imageParam}&title=${titleParam}&showId=${showIdParam}`);
  };

  if (loading) {
    return (
      <div className={styles.showsRoot}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin"></i>
            <span style={{ marginLeft: '10px' }}>Loading shows...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.showsRoot}>
      {popup.show && (
        <div className={styles.popup}>
          {popup.message}
        </div>
      )}
      {/* Glass Background Elements */}
      <div className={styles.glassOrb} style={{ top: '10%', left: '15%' }}></div>
      <div className={styles.glassOrb} style={{ top: '50%', right: '10%' }}></div>
      <div className={styles.glassOrb} style={{ bottom: '20%', left: '30%' }}></div>

      <Sidebar />

      <div className={styles.mainContent}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search anime shows..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles.filterButtons}>
            {filterCategories.map(category => (
              <button
                key={category.id}
                className={`${styles.filterBtn} ${activeFilter === category.id ? styles.active : ''}`}
                onClick={() => handleFilterChange(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shows Grid */}
        {filteredShows.length > 0 ? (
          <div className={styles.showsGrid}>
            {filteredShows.map((show, index) => (
              <ShowCard
                key={show.id}
                show={show}
                index={index}
                onImageClick={() => handleImageClick(show.image, show.title, show.id)}
                isAdded={userShowIds.has(show.id)}
                onAddToMyShows={() => handleAddToMyShows(show.id)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <i className="fas fa-search"></i>
            <h3>No shows found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shows;