import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/common/sidebar/Sidebar';
import ProfileSettings from '../../components/Settings/ProfileSettings';
import Toast from '../../components/Settings/Toast';
import styles from './setting.module.css';

const Settings = () => {
  const [activePanel, setActivePanel] = useState('profile');
  const [toast, setToast] = useState({ message: '', visible: false });
  const { user, loading, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

  const showToast = (message) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => {
    setToast({ message: '', visible: false });
  };

  const handleProfileUpdate = async (profileData) => {
    const result = await updateProfile(profileData);
    
    if (result.success) {
      showToast('Profile updated successfully!');
    } else {
      showToast(result.error);
    }
  };

  // Only keep the Profile navigation (remove Connected Accounts option)
  const settingsNavItems = [
    { id: 'profile', icon: 'fas fa-id-card', label: 'Profile' }
  ];

  if (loading) {
    return (
      <div className={styles.settingsRoot}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.settingsRoot}>
      {/* Glass Background Elements */}
      <div className={styles.glassOrb} style={{ top: '10%', left: '15%' }}></div>
      <div className={styles.glassOrb} style={{ top: '50%', right: '10%' }}></div>
      <div className={styles.glassOrb} style={{ bottom: '20%', left: '30%' }}></div>

      <Sidebar />

      <div className={styles.mainContent}>
        <div className={styles.settingsContainer}>
          <h1 className={styles.pageTitle}>Settings</h1>

          <div className={styles.settingsLayout}>
            {/* Settings Navigation */}
            <div className={styles.settingsNav}>
              <ul>
                {settingsNavItems.map((item) => (
                  <li
                    key={item.id}
                    className={`${styles.navItem} ${activePanel === item.id ? styles.active : ''}`}
                    onClick={() => setActivePanel(item.id)}
                  >
                    <i className={item.icon}></i> {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Settings Content - only Profile panel kept */}
            <div className={styles.settingsContent}>
              {activePanel === 'profile' && (
                <div className={`${styles.settingsPanel} ${styles.active}`}>
                  <ProfileSettings 
                    user={user} 
                    onUpdate={handleProfileUpdate}
                    onToast={showToast}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast 
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Settings;