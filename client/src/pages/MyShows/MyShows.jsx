/* filepath: /home/luffy/anime-talks/anitalks-project/client/src/pages/MyShows/MyShows.jsx */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/sidebar/Sidebar';
import ShowCard from '../../components/MyShows/ShowCard';
import apiClient from '../../utils/api';
import { getImageSrc } from '../../utils/imageUtils';
import styles from './MyShows.module.css';

const MyShows = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await apiClient.get('/user-shows');
        setShows(response.data);
      } catch (error) {
        console.error("Failed to load shows", error);
      } finally {
        setLoading(false);
      }
    };

    const checkForNewShows = () => {
      const newShowAdded = localStorage.getItem('newShowAdded');
      if (newShowAdded === 'true') {
        localStorage.removeItem('newShowAdded');
        fetchShows();
      }
    };

    // Check when the component mounts
    fetchShows();
    checkForNewShows();

    // Also check when the window gets focus
    window.addEventListener('focus', checkForNewShows);

    return () => {
      window.removeEventListener('focus', checkForNewShows);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };


    const handleImageClick = (imageSrc, title, showId) => {
    const imageParam = encodeURIComponent(imageSrc);
    const titleParam = encodeURIComponent(title);
    const showIdParam = showId || '';
    navigate(`/review?image=${imageParam}&title=${titleParam}&showId=${showIdParam}`);
  };


  const handleAddShow = () => {
    alert('Add a new show feature will be implemented soon!');
  };

  const handleDeleteShow = async (userShowId) => {
    try {
      await apiClient.delete(`/user-shows/${userShowId}`);
      setShows(shows.filter(userShow => userShow._id !== userShowId));
    } catch (error) {
      console.error("Failed to delete show", error);
      alert('Failed to delete show. Please try again.');
    }
  };

  const handleToggleFavorite = async (userShowId, isFavorite) => {
    try {
      const response = await apiClient.put(`/user-shows/${userShowId}`, { isFavorite });
      setShows(shows.map(userShow => 
        userShow._id === userShowId ? response.data : userShow
      ));
      const showTitle = shows.find(userShow => userShow._id === userShowId)?.show.title;
      const message = isFavorite ? 'added to' : 'removed from';
      alert(`${showTitle} has been ${message} favorites!`);
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  // Filter and sort logic
  const filteredAndSortedShows = () => {
    let filtered = shows;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(userShow => 
        userShow.showId && (
          userShow.showId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (userShow.showId.genre && userShow.showId.genre.join(' ').toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }

    // Apply sorting
    if (sortBy === 'name') {
      return [...filtered].sort((a, b) => {
        if (!a.showId || !b.showId) return 0;
        return a.showId.title.localeCompare(b.showId.title);
      });
    } else if (sortBy === 'rating') {
      return [...filtered].sort((a, b) => {
        if (!a.showId || !b.showId) return 0;
        return b.showId.rating - a.showId.rating;
      });
    }
    
    return filtered;
  };

  const currentShows = filteredAndSortedShows().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedShows().length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className={styles.myShowsRoot}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin"></i>
            <span style={{ marginLeft: '10px' }}>Loading your shows...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.myShowsRoot}>
      {/* Glass Background Elements */}
      <div className={styles.glassOrb} style={{ top: '10%', left: '15%' }}></div>
      <div className={styles.glassOrb} style={{ top: '50%', right: '10%' }}></div>
      <div className={styles.glassOrb} style={{ bottom: '20%', left: '30%' }}></div>

      <Sidebar />

      <div className={styles.mainContent}>
        <div className={styles.showsSection}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <h1>My Shows</h1>
            <button className={styles.addShowBtn} onClick={handleAddShow}>
              <i className="fas fa-plus"></i> Add New Show
            </button>
          </div>

          {/* Filter Section */}
          <div className={styles.filterSection}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search shows..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <i className="fas fa-search"></i>
            </div>
            <div className={styles.filterOptions}>
              <select 
                className={styles.sortSelect}
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="recent">Recently Added</option>
                <option value="name">Name (A-Z)</option>
                <option value="rating">Rating (High-Low)</option>
              </select>
            </div>
          </div>

          {/* Shows Grid */}
          {currentShows.length > 0 ? (
            <>
          <div className={styles.showsGrid}>
            {currentShows.filter(userShow => userShow.showId).map((userShow) => (
              <ShowCard 
                key={userShow._id}
                userShow={userShow}
                onDelete={() => handleDeleteShow(userShow._id)}
                onToggleFavorite={(isFavorite) => handleToggleFavorite(userShow._id, isFavorite)}
                onImageClick={() => handleImageClick(getImageSrc(userShow.showId), userShow.showId.title, userShow.showId._id)}
              />
            ))}
          </div>              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  {currentPage < totalPages && (
                    <button
                      className={styles.pageBtn}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noShows}>
              <i className="fas fa-tv"></i>
              <h3>No shows found</h3>
              <p>Try adjusting your search or filter criteria, or add a new show to your list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyShows;