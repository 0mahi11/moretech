import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Product {
  title: string;
  description: string;
  image: string;
}

const ProductGallery3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const products: Product[] = [
    {
      title: "Smart Navigation System",
      description: "Advanced AI-powered navigation with real-time obstacle detection and path optimization.",
      image: "https://cdn.hack.ngo/slackcdn/66e360c0620a4f562a7cbd73156c5ca5.png"
    },
    {
      title: "Health Monitoring Interface",
      description: "Comprehensive health tracking dashboard with vital signs monitoring and emergency alerts.",
      image: "https://cdn.hack.ngo/slackcdn/f293df881b0f552303721853f0a199f3.png"
    },
    {
      title: "Voice Control Module",
      description: "State-of-the-art voice recognition system for hands-free wheelchair operation.",
      image: "https://cdn.hack.ngo/slackcdn/14f3efe73e573be9c3cbfb984f0f2481.jpg"
    },
    {
      title: "Gesture Recognition System",
      description: "Intuitive gesture-based control system for enhanced accessibility and ease of use.",
      image: "https://cdn.hack.ngo/slackcdn/4700f111afd9db6c10f11805015336d8.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
            Innovation in Motion
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Experience our groundbreaking features through an immersive showcase
          </p>
        </div>

        <div ref={containerRef} className="relative min-h-[200vh]">
          <div className="sticky top-0 h-screen flex items-center justify-center">
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid grid-cols-1 gap-8">
                {products.map((product, index) => {
                  const translateY = useTransform(
                    scrollYProgress,
                    [index * 0.25, (index + 1) * 0.25],
                    ["100vh", "-100vh"]
                  );

                  const opacity = useTransform(
                    scrollYProgress,
                    [
                      Math.max(0, index * 0.25 - 0.1),
                      index * 0.25,
                      (index + 1) * 0.25,
                      Math.min(1, (index + 1) * 0.25 + 0.1)
                    ],
                    [0, 1, 1, 0]
                  );

                  const scale = useTransform(
                    scrollYProgress,
                    [index * 0.25, (index + 1) * 0.25],
                    [0.8, 1]
                  );

                  const rotateY = useTransform(
                    scrollYProgress,
                    [index * 0.25, (index + 1) * 0.25],
                    [20, 0]
                  );

                  return (
                    <motion.div
                      key={index}
                      style={{
                        translateY,
                        opacity,
                        scale,
                        rotateY,
                        position: 'absolute',
                        width: '100%'
                      }}
                      className="flex items-center justify-center perspective-1000"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform-gpu hover:scale-105 transition-transform duration-500 w-full max-w-4xl">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/2 relative overflow-hidden">
                            <motion.img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-64 md:h-full object-cover"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-500/20" />
                          </div>
                          <div className="md:w-1/2 p-8">
                            <motion.h3
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
                            >
                              {product.title}
                            </motion.h3>
                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="text-gray-700 dark:text-gray-300"
                            >
                              {product.description}
                            </motion.p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Learn More
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGallery3D;