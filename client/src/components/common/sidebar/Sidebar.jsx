import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    // Optionally redirect to login page
    window.location.href = '/auth';
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 992 && isActive) {
        const sidebar = document.querySelector(`.${styles.sidebar}`);
        const menuToggle = document.querySelector('.menu-icon-toggle');
        
        if (sidebar && !sidebar.contains(event.target) && menuToggle && !menuToggle.contains(event.target)) {
          setIsActive(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isActive]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsActive(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main menu items
  const menuItems = [
    { path: '/index', icon: 'fas fa-home', label: 'Home' },
    { path: '/manga', icon: 'fas fa-book', label: 'Manga' },
    { path: '/shows', icon: 'fas fa-tv', label: 'Shows' },
    { path: '/myStuff', icon: 'fas fa-folder', label: 'My Stuff' },
    { path: '/myShows', icon: 'fas fa-tv', label: 'My Shows' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  // Function to get username with fallback
  const getDisplayName = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'Guest';
    return user.username || user.email || 'User';
  };

  // Function to get user status
  const getUserStatus = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'Guest';
    return user?.isPremium ? 'Premium User' : 'Online';
  };

  return (
    <>
      <div className={`menu-icon-toggle ${styles.menuIconToggle}`} onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </div>

      <div className={`${styles.sidebar} ${isActive ? styles.active : ''}`}>
        <div className={styles.logo}>
          <span style={{ color: 'white' }}>ANI</span>TALKS
        </div>

        <div className={styles.menu}>
          <div className={styles.menuTitle}>MENU</div>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.menuIcon}>
                <i className={item.icon}></i>
              </span>
              {item.label}
            </Link>
          ))}
          
          {/* Add logout button */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className={`${styles.menuItem} ${styles.logoutBtn}`}
            >
              <span className={styles.menuIcon}>
                <i className="fas fa-sign-out-alt"></i>
              </span>
              Logout
            </button>
          )}
        </div>

        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {loading ? (
              <div className={styles.avatarSkeleton}>
                <i className="fas fa-user"></i>
              </div>
            ) : (
              <img 
                src="/assets/card-images/berserk.jpeg"
                alt="User Avatar"
              />
            )}
            <div className={styles.statusIndicator}></div>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {getDisplayName()}
            </div>
            <div className={styles.userStatus}>
              {getUserStatus()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;