import React, { useState, useEffect } from 'react';
import styles from '../../pages/setting/setting.module.css';

const ProfileSettings = ({ user, onUpdate, onToast }) => {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    favoriteAnime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (user) {
      const userData = {
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        favoriteAnime: user.favoriteAnime || ''
      };
      setFormData(userData);
      setOriginalData(userData);
      setHasChanges(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Check if current data differs from original
      const dataChanged = Object.keys(newData).some(key => 
        newData[key] !== originalData[key]
      );
      setHasChanges(dataChanged);
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasChanges) {
        onToast('No changes to save');
        return;
    }

    // Basic validation
    if (!formData.username.trim()) {
        onToast('Username is required');
        return;
    }

    // DEBUG: Log form data being sent
    console.log('Form data being submitted:', formData);

    setIsSubmitting(true);

    try {
        // This calls the onUpdate prop which flows to Settings -> AuthContext
        const result = await onUpdate(formData);
        
        // DEBUG: Log the result
        console.log('Update result:', result);
        
        // Update original data to reflect saved state
        setOriginalData(formData);
        setHasChanges(false);
        
    } catch (error) {
        console.error('Profile update error:', error);
        onToast('Failed to update profile. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setHasChanges(false);
  };

  return (
    <div className={styles.settingsCard}>
      <div className={styles.panelHeader}>
        <h3>Profile Settings</h3>
        <p>Update your personal information</p>
      </div>
      <div className={styles.panelContent}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Your username"
              className={styles.formControl}
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              maxLength={50}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself"
              className={styles.formControl}
              rows="4"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={isSubmitting}
              maxLength={500}
            />
            <small className={styles.charCount}>
              {formData.bio.length}/500 characters
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, Country"
              className={styles.formControl}
              value={formData.location}
              onChange={handleInputChange}
              disabled={isSubmitting}
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="favoriteAnime">Favorite Anime</label>
            <input
              type="text"
              id="favoriteAnime"
              name="favoriteAnime"
              placeholder="Your favorite anime titles"
              className={styles.formControl}
              value={formData.favoriteAnime}
              onChange={handleInputChange}
              disabled={isSubmitting}
              maxLength={200}
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.btnReset}
              onClick={handleReset}
              disabled={isSubmitting || !hasChanges}
            >
              Reset Changes
            </button>
            <button 
              type="submit" 
              className={`${styles.btnSave} ${!hasChanges ? styles.disabled : ''}`}
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
        
        {hasChanges && (
          <div className={styles.unsavedChanges}>
            <i className="fas fa-exclamation-triangle"></i>
            You have unsaved changes
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;