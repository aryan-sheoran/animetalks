import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/common/sidebar/Sidebar';
import UserProfile from '../../components/MyStuff/UserProfile';
import ReviewsSection from '../../components/MyStuff/ReviewsSection';
import BlogSection from '../../components/MyStuff/BlogSection';
import styles from './MyStuff.module.css';
import apiClient from '../../utils/api';


const MyStuff = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const [blogPosts, setBlogPosts] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Effect to redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('Not authenticated - redirecting to auth');
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

  const fetchBlogPosts = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await apiClient.get('/blogs/my-blogs');
        setBlogPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    }
  }, [isAuthenticated]);

  const fetchReviews = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await apiClient.get('/reviews/my-reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBlogPosts();
    fetchReviews();
  }, [fetchBlogPosts, fetchReviews]);

  // Sample data for reviews (can be replaced with API data later)
  const sampleReviews = [
    { title: 'Demon Slayer: Kimetsu no Yaiba', rating: 4.0 },
    { title: 'Attack on Titan', rating: 4.5 },
    { title: 'My Hero Academia', rating: 3.8 },
    { title: 'Jujutsu Kaisen', rating: 4.2 },
    { title: 'One Piece', rating: 4.7 }
  ];

  if (loading) {
    return (
      <div className={styles.myStuffRoot}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.myStuffRoot}>
      {/* Glass Background Elements */}
      <div className={styles.glassOrb} style={{ top: '10%', left: '15%' }}></div>
      <div className={styles.glassOrb} style={{ top: '50%', right: '10%' }}></div>
      <div className={styles.glassOrb} style={{ bottom: '20%', left: '30%' }}></div>

      <Sidebar />

      <div className={styles.mainContent}>
        <div className={`${styles.profileSection} ${styles.glassCard}`}>
          <div className={styles.sectionHeader}>User Profile</div>

          {/* First Row: User Info and Reviews side by side */}
          <div className={styles.profileRow}>
            <div className={styles.profileColumn}>
              <UserProfile user={user} />
            </div>
            <div className={styles.profileColumn}>
              <ReviewsSection reviews={reviews} />
            </div>
          </div>

          {/* Second Row: Blog Section at the bottom */}
          <div className={`${styles.profileRow} ${styles.blogRow}`}>
            <BlogSection blogPosts={blogPosts} onUpdate={fetchBlogPosts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStuff;