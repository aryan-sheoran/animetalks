import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Intro.module.css';
import glassStyles from '../../styles/glassmorphism.module.css';

const Intro = () => {
  const particlesRef = useRef(null);
  const heroImageRef = useRef(null);
  const nextImageRef = useRef(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isHiding, setIsHiding] = useState(false);
  const preloadedImagesRef = useRef({});
  const particleUpdateQueuedRef = useRef(false);
  const isTransitioningRef = useRef(false);

  // Function to handle smooth scroll to auth section
  const handleGetStartedClick = (e) => {
    e.preventDefault();
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      authSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // SEPARATED: Particle System Management
  const initializeParticles = useCallback(() => {
    if (!window.particlesJS) {
      console.warn('Particles.js library not loaded');
      return;
    }

    window.particlesJS('particles-js', {
      particles: {
        number: {
          value: 120,
          density: {
            enable: true,
            value_area: 1000
          }
        },
        color: {
          value: ['#dc143c', '#ff4d6d', '#ffffff']
        },
        shape: {
          type: ['circle', 'star'],
          stroke: {
            width: 0,
            color: '#000000'
          },
          polygon: {
            nb_sides: 5
          }
        },
        opacity: {
          value: 0.6,
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 2.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 120,
          color: '#dc143c',
          opacity: 0.2,
          width: 0.5
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: false
          },
          resize: true
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4
          }
        }
      },
      retina_detect: true
    });

    console.log('✅ Particles initialized successfully');
  }, []);

  // SEPARATED: Particle Color Updates
  const updateParticleColors = useCallback((colors) => {
    if (particleUpdateQueuedRef.current || !colors || colors.length < 2) return;
    
    particleUpdateQueuedRef.current = true;
    
    const updateFn = () => {
      try {
        if (window.pJSDom && window.pJSDom[0]) {
          const pJS = window.pJSDom[0].pJS;
          
          // Update line linking color (most visible change)
          if (pJS.particles.line_linked) {
            pJS.particles.line_linked.color = colors[0];
          }
          
          // Update a small batch of particles gradually
          if (pJS.particles.array && pJS.particles.array.length > 0) {
            const batchSize = Math.min(20, pJS.particles.array.length);
            const startIndex = Math.floor(Math.random() * Math.max(0, pJS.particles.array.length - batchSize));
            
            for (let i = startIndex; i < startIndex + batchSize; i++) {
              const particle = pJS.particles.array[i];
              if (particle && particle.color) {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                if (pJS.fn && pJS.fn.vendors && pJS.fn.vendors.hexToRgb) {
                  particle.color.rgb = pJS.fn.vendors.hexToRgb(randomColor);
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn('Particle update error:', e);
      }
      
      particleUpdateQueuedRef.current = false;
    };

    // Use requestIdleCallback for non-blocking updates
    if (window.requestIdleCallback) {
      window.requestIdleCallback(updateFn, { timeout: 200 });
    } else {
      setTimeout(updateFn, 100);
    }
  }, []);

  // SEPARATED: Image Preloading System
  const preloadAllImages = useCallback(async (images) => {
    console.log('🔄 Starting image preload...');
    
    const loadPromises = images.map((imagePath, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          preloadedImagesRef.current[index] = img;
          console.log(`✅ Loaded: ${imagePath}`);
          resolve();
        };
        img.onerror = () => {
          console.warn(`❌ Failed to load: ${imagePath}`);
          resolve(); // Don't block other images
        };
        img.src = `/assets/${imagePath}`;
      });
    });

    await Promise.all(loadPromises);
    setAllImagesLoaded(true);
    console.log('✅ All images preloaded successfully');
  }, []);

  // SEPARATED: Image Transition System
  const createCrossfadeImage = useCallback(() => {
    if (nextImageRef.current) return; // Already created

    const img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease-in-out';
    img.style.pointerEvents = 'none';
    nextImageRef.current = img;
    
    if (heroImageRef.current && heroImageRef.current.parentNode) {
      heroImageRef.current.parentNode.appendChild(img);
    }
  }, []);

  // SEPARATED: Image Update Function
  const updateHeroImage = useCallback((index, images, filterColors) => {
    if (!heroImageRef.current || isTransitioningRef.current || !allImagesLoaded) return;
    
    isTransitioningRef.current = true;
    createCrossfadeImage();

    const preloadedImg = preloadedImagesRef.current[index];
    
    if (preloadedImg && nextImageRef.current) {
      // Setup the next image
      nextImageRef.current.src = preloadedImg.src;
      
      // Apply filter effects
      const filterStyle = filterColors ? `
        drop-shadow(0 0 20px ${filterColors[0]}40)
        drop-shadow(0 0 35px ${filterColors[1]}30)
        drop-shadow(3px 3px 10px rgba(0, 0, 0, 0.4))
      ` : '';
      
      heroImageRef.current.style.filter = filterStyle;
      nextImageRef.current.style.filter = filterStyle;
      
      // Perform crossfade transition
      nextImageRef.current.style.opacity = '1';
      heroImageRef.current.style.opacity = '0';
      
      // Complete the transition
      setTimeout(() => {
        if (heroImageRef.current && nextImageRef.current) {
          heroImageRef.current.src = nextImageRef.current.src;
          heroImageRef.current.style.opacity = '1';
          nextImageRef.current.style.opacity = '0';
        }
        
        isTransitioningRef.current = false;
      }, 400);
    } else {
      // Fallback for missing preloaded image
      heroImageRef.current.style.opacity = '0';
      setTimeout(() => {
        heroImageRef.current.src = `/assets/${images[index]}`;
        heroImageRef.current.style.opacity = '1';
        isTransitioningRef.current = false;
      }, 200);
    }
  }, [allImagesLoaded, createCrossfadeImage]);

  // SEPARATED: Background Theme Updates
  const updateBackgroundTheme = useCallback((theme) => {
    const root = document.documentElement;
    
    // Update CSS variables
    root.style.setProperty('--gradient-primary', theme.gradient);
    
    // Update body background
    document.body.style.background = theme.background;
  }, []);

  // SEPARATED: Complete Theme Update Function
  const updateTheme = useCallback((index, themes, images) => {
    if (!allImagesLoaded) return;

    requestAnimationFrame(() => {
      // 1. Update background theme
      updateBackgroundTheme(themes[index]);
      
      // 2. Extract colors for effects
      const colors = themes[index].gradient.match(/#[0-9A-Fa-f]{6}/gi);
      
      // 3. Update particle colors (non-blocking)
      if (colors) {
        updateParticleColors([colors[0], colors[1], '#ffffff']);
      }
      
      // 4. Update hero image with filters
      updateHeroImage(index, images, colors);
    });
  }, [allImagesLoaded, updateBackgroundTheme, updateParticleColors, updateHeroImage]);

  // SEPARATED: Theme Cycling System
  const startThemeCycling = useCallback((themes, images) => {
    let currentIndex = 0;
    
    // Initial setup
    setTimeout(() => updateTheme(0, themes, images), 100);
    
    // Start cycling interval
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      updateTheme(currentIndex, themes, images);
    }, 5000);

    return interval;
  }, [updateTheme]);

  // Main useEffect - Orchestrates everything
  useEffect(() => {
    // Theme and image configuration
    const images = [
      'intro-img/back0.png',
      'intro-img/back1.png',
      'intro-img/back2.png',
      'intro-img/back5.png',
      'intro-img/back6.png',
      'intro-img/back7.png',
      'intro-img/back8.png',
      'intro-img/back9.png',
      'intro-img/back10.png'
    ];

    const themes = [
      { gradient: 'linear-gradient(45deg, #800020, #B22222)', background: 'linear-gradient(135deg, #1a1314 0%, #3f1b1b 100%)' },
      { gradient: 'linear-gradient(45deg, #1a237e, #5e35b1)', background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a35 100%)' },
      { gradient: 'linear-gradient(45deg, #ff8f00, #ffa000)', background: 'linear-gradient(135deg, #3e2723 0%, #4e342e 100%)' },
      { gradient: 'linear-gradient(45deg, #6a1b9a, #9c27b0)', background: 'linear-gradient(135deg, #1a0d1a 0%, #35193a 100%)' },
      { gradient: 'linear-gradient(45deg, #00695c, #00acc1)', background: 'linear-gradient(135deg, #0d1a1a 0%, #1a3535 100%)' },
      { gradient: 'linear-gradient(45deg, #1b5e20, #00796b)', background: 'linear-gradient(135deg, #1b2b34 0%, #263238 100%)' },
      { gradient: 'linear-gradient(45deg, #3e2723, #6d4c41)', background: 'linear-gradient(135deg, #1b0000 0%, #2d1c14 100%)' },
      { gradient: 'linear-gradient(45deg, #2e7d32, #81c784)', background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 60%)' },
      { gradient: 'linear-gradient(45deg, #ff6f00, #ffab00)', background: 'linear-gradient(135deg, #1c0c00 0%, #4e2800 100%)' }
    ];

    // 1. Initialize particles
    initializeParticles();

    // 2. Setup image transitions
    if (heroImageRef.current) {
      heroImageRef.current.style.transition = 'opacity 0.4s ease-in-out, filter 0.2s ease-in-out';
      heroImageRef.current.style.willChange = 'opacity, filter';
    }
    
    // 3. Setup background transitions
    document.body.style.transition = 'background 1.2s ease-in-out';

    // 4. Start image preloading
    preloadAllImages(images);

    // 5. Start the minimum time timer
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3000);

    // 6. Start theme cycling when ready
    let interval;
    const startWhenReady = () => {
      if (allImagesLoaded) {
        interval = startThemeCycling(themes, images);
      } else {
        setTimeout(startWhenReady, 100);
      }
    };

    startWhenReady();

    // Cleanup function
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      document.body.style.transition = '';
      isTransitioningRef.current = false;
      particleUpdateQueuedRef.current = false;
      
      // Clean up crossfade image
      if (nextImageRef.current && nextImageRef.current.parentNode) {
        nextImageRef.current.parentNode.removeChild(nextImageRef.current);
        nextImageRef.current = null;
      }
    };
  }, [initializeParticles, preloadAllImages, startThemeCycling, allImagesLoaded]);

  useEffect(() => {
    if (allImagesLoaded && minTimeElapsed) {
      setIsHiding(true);
      const hideTimer = setTimeout(() => {
        setShowLoader(false);
      }, 800); // Match this with the transition duration in CSS
      return () => clearTimeout(hideTimer);
    }
  }, [allImagesLoaded, minTimeElapsed]);

  return (
    <div className={styles.introRoot}>
      {/* Unique Loading Overlay */}
      {showLoader && (
        <div className={`${styles.loadingOverlay} ${isHiding ? styles.hiding : ''}`}>
          <div className={styles.loadingContent}>
            <h1 className={`${styles.loadingLogo} ${glassStyles.gradientText}`}>
              AnimeDB
            </h1>
            <div className={styles.loadingBar}>
              <div className={styles.loadingProgress}></div>
            </div>
            <p className={styles.loadingText}>Entering the Animeverse...</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={`${styles.logo} ${glassStyles.gradientText}`}>ANIMEDB</div>
        <a 
          href="#auth-section" 
          className={`${styles.getStarted} ${glassStyles.gradientButton}`}
          onClick={handleGetStartedClick}
        >
          Get started
        </a>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div id="particles-js" className={styles.particlesJs} ref={particlesRef}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Your <span className={glassStyles.gradientText}>Ultimate</span> <br />ANIME GUIDE
          </h1>
          <p className={styles.heroDescription}>
            Join the Ultimate Animeverse – Talk, Rate, Belong.<br />Your Gateway to the Anime World – Chat, Rate, Relate.
          </p>
          <div className={styles.heroButtons}>
            <span 
              className={`${styles.knowMore} ${glassStyles.glassButton}`}
              onClick={handleGetStartedClick}
              style={{ cursor: 'pointer' }}
            >
              Explore More
            </span>
          </div>
        </div>
        <div className={styles.heroImage} style={{ position: 'relative' }}>
          <img 
            ref={heroImageRef}
            src="/assets/intro-img/back0.png" 
            alt="Anime Character"
            style={{
              width: '100%',
              opacity: 1,
              transition: 'opacity 0.4s ease-in-out, filter 0.2s ease-in-out',
              willChange: 'opacity, filter'
            }}
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={`${styles.features} ${styles.section}`}>
        <div className="features-container">
          <h2 className={`${styles.featuresTitle} ${glassStyles.gradientText}`}>Features</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${glassStyles.glassCard}`}>
              <div className={styles.featureIcon}>🌟</div>
              <h3 className={styles.featureTitle}>Give Your Reviews</h3>
              <p className={styles.featureDescription}>Share your thoughts and rate your favorite anime series with detailed reviews and scores.</p>
            </div>
            {false && (
            <div className={`${styles.featureCard} ${glassStyles.glassCard}`}>
              <div className={styles.featureIcon}>💬</div>
              <h3 className={styles.featureTitle}>Join Community</h3>
              <p className={styles.featureDescription}>Connect with fellow anime lovers, discuss episodes, and participate in engaging discussions.</p>
            </div>
            )}
            <div className={`${styles.featureCard} ${glassStyles.glassCard}`}>
              <div className={styles.featureIcon}>🎬</div>
              <h3 className={styles.featureTitle}>Make new Friends</h3>
              <p className={styles.featureDescription}>Meet like-minded anime fans, join watch parties, and build lasting friendships.</p>
            </div>
            <div className={`${styles.featureCard} ${glassStyles.glassCard}`}>
              <div className={styles.featureIcon}>📝</div>
              <h3 className={styles.featureTitle}>Make Blogs daily</h3>
              <p className={styles.featureDescription}>Express yourself through blog posts about anime theories, character analysis, and recommendations.</p>
            </div>
            <div className={`${styles.featureCard} ${glassStyles.glassCard}`}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Track Your Reviews</h3>
              <p className={styles.featureDescription}>Keep track of all your anime reviews, ratings, and watching progress in one organized place.</p>
            </div>
            {false && (
            <div className={`${styles.featureCard} ${glassStyles.glassCard}`}>
              <div className={styles.featureIcon}>🌐</div>
              <h3 className={styles.featureTitle}>Chat Globally</h3>
              <p className={styles.featureDescription}>Connect with anime fans worldwide through our real-time global chat system and make friends across borders.</p>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="auth-section" className={styles.authSection}>
        <div className={`${styles.authContainer} ${glassStyles.glassCardStrong}`}>
          <div className={styles.sectionImage}>
            <img 
              src="/assets/test images/backiee-238171-portrait.jpg" 
              alt="Anime Login"
              onError={(e) => {
                console.warn('Failed to load backiee-238171-portrait.jpg, using fallback');
                e.target.src = './assets/intro-img/lat1.jpg';
              }}
            />
          </div>
          <div className={styles.sectionContent}>
            <h2 className={styles.authTitle}>Welcome Back!</h2>
            <p className={styles.authDescription}>Ready to dive back into the world of anime? Log in to access your reviews, connect with friends, and continue your anime journey.</p>
            <div className={styles.authButtons}>
              <Link to="/auth" className={`${styles.actionBtn} ${glassStyles.gradientButton}`}>Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className={styles.authSection}>
        <div className={`${styles.authContainer} ${styles.reverse} ${glassStyles.glassCardStrong}`}>
          <div className={styles.sectionImage}>
            <img 
              src="/assets/test images/backiee-254632-landscape.jpg" 
              alt="Anime Sign Up"
              onError={(e) => {
                console.warn('Failed to load backiee-254632-landscape.jpg, using fallback');
                e.target.src = './assets/intro-img/lat2.jpg';
              }}
            />
          </div>
          <div className={styles.sectionContent}>
            <h2 className={styles.authTitle}>Join Our Community</h2>
            <p className={styles.authDescription}>Start your anime journey today! Join thousands of anime enthusiasts, share your thoughts, and make new friends who share your passion.</p>
            <div className={styles.authButtons}>
              <Link to="/auth?mode=signup" className={`${styles.actionBtn} ${glassStyles.gradientButton}`}>Sign Up</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      {false && (
      <footer className={`${styles.footer} ${glassStyles.glassCardStrong}`}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            {/* Brand Section */}
            <div className={styles.footerBrand}>
              <h3>ANITALKS</h3>
              <p>Your ultimate destination for anime reviews, discussions, and community engagement.</p>
              <div className={styles.socialLinks}>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-discord"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">Home</a></li>
                <li><a href="#">Reviews</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">About Us</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className={styles.footerSection}>
              <h4>Resources</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className={styles.footerSection}>
              <h4>Stay Updated</h4>
              <p>Subscribe to our newsletter for the latest anime reviews and community updates.</p>
              <div className={styles.newsletterForm}>
                <input type="email" placeholder="Enter your email" className={glassStyles.glassInput} />
                <button className={glassStyles.gradientButton}>Subscribe</button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className={styles.footerBottom}>
            <p>© 2025 ANITALKS. All rights reserved.</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default Intro;
