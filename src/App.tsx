import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesShowcase from './components/FeaturesShowcase';
import SmartControls from './components/SmartControls';
import ProductShowcase from './components/ProductShowcase';
import ProductGallery3D from './components/ProductGallery3D';
import OurStory from './components/OurStory';
import TeamSection from './components/TeamSection';
import AchievementsTimeline from './components/AchievementsTimeline';
import FutureVision from './components/FutureVision';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import WaterCursor from './components/WaterCursor';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <link rel="icon" href="https://files.edgestore.dev/iz2sept3369gmc0f/publicFiles/_public/560b1ad9-dd9e-4458-a6e3-a2878525f718.png" />
      <WaterCursor />
      <div className="min-h-screen transition-colors duration-300">
        <AnimatePresence>
          {loading && <LoadingScreen progress={progress} />}
        </AnimatePresence>
        <Header scrollPosition={scrollPosition} />
        <main>
          <Hero />
          <FeaturesShowcase />
          <SmartControls />
          <ProductShowcase />
          <ProductGallery3D />
          <OurStory />
          <AchievementsTimeline />
          <FutureVision />
          <TeamSection />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;