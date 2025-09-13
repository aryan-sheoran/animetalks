import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/sidebar/Sidebar';
import HeroCarousel from '../../components/Home/HeroCarousel';
import PopularShows from '../../components/Home/PopularShows';
import FeaturedAnime from '../../components/Home/FeaturedAnime';
import styles from './Home.module.css';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [popularShows, setPopularShows] = useState([]);
  // Remove hard-coded hero/featured data — rely on backend /home collection
  const [heroData, setHeroData] = useState([]);
  const [featuredAnimes, setFeaturedAnimes] = useState([]);

  // Simple helpers
  const asObjectId = (id) => (typeof id === 'string' && /[0-9a-fA-F]{24}/.test(id) ? id.match(/[0-9a-fA-F]{24}/)[0] : '');
  const getShowId = (show) => (show && show._id ? asObjectId(show._id) || show._id : '');
  const normalizeImage = (raw) => {
    if (!raw) return '';
    // Accept absolute or root-relative only; ignore plain filenames
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith('/')) return raw;
    // If it's only a filename, assume backend serves under /uploads (adjust if different)
    if (!raw.includes('/') && /\.[a-zA-Z0-9]{2,5}$/.test(raw)) return `/uploads/${raw}`;
    return raw;
  };
  const pickImage = (entity) => {
    if (!entity) return '';
    const img = entity.coverImageUrl || entity.imageUrl || entity.cardImage || '';
    return normalizeImage(img);
  };

  // Fetch popular shows from backend and map to the UI shape expected by PopularShows
  useEffect(() => {
    let mounted = true;
    const fetchPopular = async () => {
      try {
        const res = await api.get('/shows');
        const shows = Array.isArray(res.data) ? res.data : [];
        const mapped = shows.slice(0, 12).map((s, idx) => ({
          id: s._id,
            showId: getShowId(s),
          image: pickImage(s),
          title: s.title || 'Untitled',
          description: s.description || '',
          type: (s.genres && s.genres.length ? s.genres[0] : 'Unknown')
        })).filter(item => item.image && item.title);

        if (mounted) setPopularShows(mapped);
      } catch (err) {
        console.error('Failed to fetch popular shows:', err);
      }
    };

    fetchPopular();
    return () => { mounted = false; };
  }, []);

  // Fetch home items (hero & featured) from backend and replace defaults while preserving UI/UX
  useEffect(() => {
    let mounted = true;
    const fetchHome = async () => {
      try {
        const res = await api.get('/home');
        let items = Array.isArray(res.data) ? res.data : [];

        // Collect show IDs needing population (when show is just a string/ObjectId)
        const missingShowIds = items
          .filter(h => h && h.show && typeof h.show === 'string')
          .map(h => h.show)
          .slice(0, 20); // cap to avoid over-fetching

        let showCache = {};
        if (missingShowIds.length) {
          await Promise.all(missingShowIds.map(async (id) => {
            if (showCache[id]) return;
            try {
              const r = await api.get(`/shows/${id}`);
              if (r.data && r.data._id) showCache[id] = r.data;
            } catch (e) {
              // ignore individual failures
            }
          }));
        }

        let mapped = items.map(h => {
          if (!h) return null;
            const show = typeof h.show === 'object' ? h.show : showCache[h.show];
          if (!show) return null;
          const image = pickImage(show);
          if (!image) return null;
          return {
            id: h._id,
            homeId: h._id,
            showId: getShowId(show),
            title: show.title || 'Untitled',
            description: show.description || '',
            image,
            genres: show.genres || []
          };
        }).filter(Boolean);

        // Fallback: if no curated home items, derive from popularShows or fetch shows
        if (!mapped.length) {
          // No fallback - ensure only curated items are shown
          if (mounted) {
            setHeroData([]);
            setFeaturedAnimes([]);
          }
          return; 
        }

        if (!mapped.length) return; // still nothing

        const hero = mapped.slice(0, 4);
        let featured = mapped.slice(4, 12);
        if (featured.length < 4) {
          let i = 0;
          while (featured.length < 4 && hero.length) {
            featured.push(hero[i % hero.length]);
            i++;
            if (i > 20) break;
          }
        }
        if (mounted) {
          setHeroData(hero);
          setFeaturedAnimes(featured);
        }
      } catch (err) {
        console.error('Failed to fetch home items:', err);
      }
    };

    fetchHome();
    return () => { mounted = false; };
  }, []);

  const handleImageClick = (image, title, description = '', showId = '') => {
    // Normalize filename for backward compatibility
    let normalized = '';
    if (image) {
      try {
        const urlObj = new URL(image, window.location.origin);
        normalized = urlObj.pathname.split('/').pop();
      } catch {
        const cleaned = image.replace('/assets/card-images/', '').replace(/^[\/]+/, '');
        normalized = cleaned.split('/').pop();
      }
    }
    const params = new URLSearchParams();
    if (normalized) params.set('image', normalized);
    if (image) params.set('fullImage', image);
    if (title) params.set('title', title);
    if (description) params.set('info', description);
    if (showId && asObjectId(showId)) params.set('showId', asObjectId(showId));
    navigate(`/review?${params.toString()}`);
  };

  const getDisplayName = () => {
    if (isAuthenticated && user) {
      return user.username || user.email || 'User';
    }
    return 'Guest';
  };

  return (
    <div className={styles.homeRoot}>
      {/* Glass Background Elements */}
      <div className={styles.glassOrb} style={{ top: '10%', left: '15%' }}></div>
      <div className={styles.glassOrb} style={{ top: '50%', right: '10%' }}></div>
      <div className={styles.glassOrb} style={{ bottom: '20%', left: '30%' }}></div>

      <Sidebar />

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.main}>
          {/* Welcome Section */}
          <div className={styles.welcomeBanner}>
            <h1>Welcome back, {getDisplayName()}!</h1>
            <p>Your journey into the world of anime continues here.</p>
          </div>

          <HeroCarousel heroData={heroData} onImageClick={handleImageClick} />
          <PopularShows popularShows={popularShows} onImageClick={handleImageClick} />
          <FeaturedAnime featuredAnimes={featuredAnimes} onImageClick={handleImageClick} />
        </div>
      </div>
    </div>
  );
};

export default Home;