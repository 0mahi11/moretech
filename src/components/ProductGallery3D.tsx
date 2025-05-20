import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
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
  const [isDragging, setIsDragging] = useState(false);

  const products: Product[] = [
    {
      title: "Smart Navigation System",
      description: "Our AI-powered navigation system represents a breakthrough in mobility assistance. Using advanced sensors and real-time processing, it creates a seamless experience that adapts to any environment, making navigation effortless and safe.",
      image: "https://cdn.hack.ngo/slackcdn/66e360c0620a4f562a7cbd73156c5ca5.png"
    },
    {
      title: "Health Monitoring Interface",
      description: "More than just mobility - our health monitoring system keeps track of vital signs in real-time, providing peace of mind to users and caregivers alike. It's like having a personal health assistant always by your side.",
      image: "https://cdn.hack.ngo/slackcdn/f293df881b0f552303721853f0a199f3.png"
    },
    {
      title: "Voice Control Module",
      description: "Freedom through voice - our natural language processing system understands commands in multiple languages, making control as simple as having a conversation. It's the future of accessibility, available today.",
      image: "https://cdn.hack.ngo/slackcdn/14f3efe73e573be9c3cbfb984f0f2481.jpg"
    },
    {
      title: "Gesture Recognition System",
      description: "Revolutionary gesture control that reads your movements with incredible precision. Whether it's a slight head tilt or hand motion, our system translates your gestures into smooth, reliable control.",
      image: "https://cdn.hack.ngo/slackcdn/4700f111afd9db6c10f11805015336d8.jpg"
    }
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 100,
    mass: 0.5
  });

  const bind = useGesture({
    onDrag: ({ movement: [x], down }) => {
      if (down && Math.abs(x) > 50) {
        setIsDragging(true);
        const newIndex = x > 0 
          ? Math.max(0, activeIndex - 1)
          : Math.min(products.length - 1, activeIndex + 1);
        setActiveIndex(newIndex);
      }
    },
    onDragEnd: () => {
      setIsDragging(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, 1 - (top / (height - viewportHeight))));
      const index = Math.min(
        products.length - 1,
        Math.floor(scrollProgress * products.length)
      );
      if (!isDragging) {
        setActiveIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products.length, isDragging]);

  return (
    <>
      <section 
        ref={containerRef} 
        className="min-h-[400vh] relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div 
            ref={ref} 
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            {...bind()}
          >
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
                    filter: `blur(${Math.abs(progress) * 5}px)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 70,
                    damping: 30,
                    mass: 1,
                  }}
                  className="w-full perspective-1000"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform-gpu">
                    <div className="flex flex-col md:flex-row items-stretch">
                      <motion.div 
                        className="md:w-1/2 relative overflow-hidden cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                      >
                        <motion.img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-[300px] md:h-[600px] object-cover"
                          initial={{ scale: 1.2 }}
                          animate={{ 
                            scale: 1,
                            rotate: progress * 5,
                          }}
                          transition={{ 
                            duration: 0.8,
                            type: 'spring',
                            bounce: 0.2
                          }}
                        />
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-500/20"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                      
                      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ 
                            opacity: progress === 0 ? 1 : 0,
                            y: progress === 0 ? 0 : 50
                          }}
                          transition={{ 
                            duration: 0.8,
                            type: 'spring',
                            bounce: 0.2
                          }}
                        >
                          <h3 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
                            {product.title}
                          </h3>
                          <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
                            {product.description}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Learn More
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
              className="max-w-[90%] max-h-[90vh] object-contain"
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -100 }}
              transition={{ 
                type: 'spring',
                damping: 20,
                stiffness: 100
              }}
            />
            <motion.button
              className="absolute top-4 right-4 text-white text-xl bg-purple-600/20 px-6 py-2 rounded-full backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFullscreen(false)}
            >
              Close
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery3D;