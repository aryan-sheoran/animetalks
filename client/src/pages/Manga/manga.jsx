/* filepath: /home/luffy/anime-talks/anitalks-project/client/src/pages/Manga/manga.jsx */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/sidebar/Sidebar';
import FeatureCard from '../../components/Manga/FeatureCard';
import CountdownTimer from '../../components/Manga/CountdownTimer';
import styles from './manga.module.css';

const Manga = () => {
  const navigate = useNavigate();

  // Set launch date to 3 months from now
  const launchDate = new Date();
  launchDate.setMonth(launchDate.getMonth() + 3);

  const features = [
    {
      icon: 'fas fa-book',
      title: 'Extensive Library',
      description: 'Access thousands of manga titles'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Ready',
      description: 'Read on any device'
    },
    {
      icon: 'fas fa-bell',
      title: 'Updates',
      description: 'Get notified of new chapters'
    }
  ];

  const handleBackToHome = () => {
    navigate('/index');
  };

  return (
    <div className={styles.mangaRoot}>
      <div className={styles.container}>
        <Sidebar />

        <div className={styles.comingSoon}>
          <div className={styles.content}>
            <h1>Manga Section Coming Soon</h1>
            <p>We're working hard to bring you an amazing manga experience.</p>
            
            <div className={styles.features}>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>

            <CountdownTimer targetDate={launchDate} />

            <button 
              className={styles.backButton}
              onClick={handleBackToHome}
            >
              <i className="fas fa-arrow-left"></i> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manga;