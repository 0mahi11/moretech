import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import useMeasure from 'react-use-measure';

interface Product {
  title: string;
  description: string;
  image: string;
}

const ProductGallery3D: React.FC = () => {
  const [ref, bounds] = useMeasure();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100
  });

  const products: Product[] = [
    {
      title: "Smart Navigation System",
      description: "Advanced AI-powered navigation with real-time obstacle detection and path optimization for seamless mobility in any environment.",
      image: "https://cdn.hack.ngo/slackcdn/66e360c0620a4f562a7cbd73156c5ca5.png"
    },
    {
      title: "Health Monitoring Interface",
      description: "Comprehensive health tracking dashboard with vital signs monitoring and emergency alerts for enhanced user safety.",
      image: "https://cdn.hack.ngo/slackcdn/f293df881b0f552303721853f0a199f3.png"
    },
    {
      title: "Voice Control Module",
      description: "State-of-the-art voice recognition system for hands-free wheelchair operation, supporting multiple languages.",
      image: "https://cdn.hack.ngo/slackcdn/14f3efe73e573be9c3cbfb984f0f2481.jpg"
    },
    {
      title: "Gesture Recognition System",
      description: "Intuitive gesture-based control system for enhanced accessibility and ease of use in various scenarios.",
      image: "https://cdn.hack.ngo/slackcdn/4700f111afd9db6c10f11805015336d8.jpg"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const scrollProgress = -top / (height - window.innerHeight);
      const index = Math.min(
        products.length - 1,
        Math.floor(scrollProgress * products.length)
      );
      setActiveIndex(index);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products.length]);

  return (
    <>
      <section 
        ref={containerRef} 
        className="min-h-[400vh] relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div ref={ref} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {products.map((product, index) => {
              const progress = (index - activeIndex) / 2;
              const scale = Math.max(0.5, 1 - Math.abs(progress) * 0.5);
              const opacity = Math.max(0, 1 - Math.abs(progress) * 2);
              
              return (
                <motion.div
                  key={index}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    scale,
                    opacity,
                    zIndex: progress === 0 ? 2 : 1,
                  }}
                  animate={{
                    x: `${progress * 100}%`,
                    rotateY: progress * 45,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="w-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center">
                      <motion.div 
                        className="md:w-1/2 relative overflow-hidden cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-[300px] md:h-[500px] object-cover"
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-500/20" />
                      </motion.div>
                      
                      <div className="md:w-1/2 p-8 md:p-12">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
                            {product.title}
                          </h3>
                          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                            {product.description}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Explore Feature
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.img
              src={products[activeIndex].image}
              alt={products[activeIndex].title}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            />
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={() => setIsFullscreen(false)}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery3D;