import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated} = useAuth();

  const handleEditProfile = () => {
    navigate('/settings');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (loading) return '...';
    if (!isAuthenticated || !user) return 'GU';
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return user?.email ? user.email.substring(0, 2).toUpperCase() : 'SJ';
  };

  const getUserName = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'Guest User';
    return user?.username || user?.email || 'User';
  };

  const getUserBadge = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'Guest';
    return user?.isPremium ? 'Premium User' : 'Standard User';
  };

  const getUserLocation = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'Not specified';
    return user?.location || 'Not specified';
  };

  const getUserBio = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'No bio available';
    return user?.bio || 'No bio available';
  };

  const getFavoriteAnime = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'No favorites set';
    
    // Fix: Check if favoriteAnime exists as a string (not array)
    if (user?.favoriteAnime && typeof user.favoriteAnime === 'string' && user.favoriteAnime.trim() !== '') {
        return user.favoriteAnime;
    }
    
    return 'No favorites set';
  };

  // Add error boundary handling
  const renderUserProfile = () => {
    try {
      return (
        <div className={`${styles.userInfo} ${styles.glassCard}`}>
          <div className={styles.userDetails}>
            <div className={styles.userAvatar}>
              {getUserInitials()}
            </div>
            <div className={styles.userName}>{getUserName()}</div>
            <div className={styles.userBadge}>{getUserBadge()}</div>
            <button className={styles.editProfileBtn} onClick={handleEditProfile}>
              <i>✏️</i> Edit Profile
            </button>
          </div>

          <div className={styles.userInfoDetails}>
            <div className={styles.userInfoItem}>
              <div className={styles.userInfoLabel}>Location</div>
              <div className={styles.userInfoValue}>{getUserLocation()}</div>
            </div>

            <div className={styles.userInfoItem}>
              <div className={styles.userInfoLabel}>Bio</div>
              <div className={styles.userInfoValue}>{getUserBio()}</div>
            </div>

            <div className={styles.favoriteAnime}>
              <span className={styles.favoriteAnimeIcon}>🎬</span>
              <div>
                <div className={styles.userInfoLabel}>Favorite Anime</div>
                <div className={styles.userInfoValue}>{getFavoriteAnime()}</div>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering user profile:', error);
      return (
        <div className={`${styles.userInfo} ${styles.glassCard}`}>
          <div className={styles.loading}>Error loading user profile. Please try again.</div>
        </div>
      );
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className={`${styles.userInfo} ${styles.glassCard}`}>
        <div className={styles.loading}>Loading user profile...</div>
      </div>
    );
  }

  return (
    <div>
      {renderUserProfile()}
    </div>
  );
};

export default UserProfile;