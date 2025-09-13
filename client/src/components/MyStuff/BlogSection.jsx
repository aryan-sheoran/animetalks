import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/api';
import styles from './BlogSection.module.css';
import BlogModal from './BlogModal'; // Import the modal

const BlogSection = ({ blogPosts, onUpdate }) => {
  const [posts, setPosts] = useState(blogPosts || []);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  useEffect(() => {
    setPosts(blogPosts);
  }, [blogPosts]);

  const handleNewBlogPost = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCreatePost = async (postData) => {
    try {
      await apiClient.post('/blogs', postData);
      onUpdate(); // Refresh the blog posts list
      setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Error creating post:', error);
      // Optionally, show an error message to the user
    }
  };

  const handleLike = async (postId) => {
    try {
      await apiClient.post(`/blogs/${postId}/like`);
      if (onUpdate) {
        onUpdate(); // This will re-fetch the posts from the parent component
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`${styles.blogSection} ${styles.glassCard}`}>
      <h3>My Blog</h3>
      <button
        className={`${styles.newBlogButton} ${styles.btn} ${styles.btnPrimary}`}
        onClick={handleNewBlogPost}
      >
        + New Blog Post
      </button>

      {/* Render the modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {posts.map(post => (
        <div key={post._id} className={styles.blogEntry}>
          <div className={styles.blogTitle}>{post.title}</div>
          <div className={styles.blogContent}>{post.content}</div>
          <div className={styles.blogFooter}>
            <div>Posted on {formatDate(post.createdAt)}</div>
            <div className={styles.blogActions}>
              <div 
                className={styles.blogAction}
                onClick={() => handleLike(post._id)}
                style={{ cursor: 'pointer' }}
              >
                ❤️ {post.likeCount}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSection;