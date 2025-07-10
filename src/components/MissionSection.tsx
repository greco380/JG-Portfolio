import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const MissionSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const quoteVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section 
      id="mission" 
      className="flex items-center justify-center relative pt-8 pb-40"
      ref={ref}
    >
            {/* Background with line art/schematic pattern */}
            <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <g stroke="white" strokeWidth="0.2" fill="none">
            <circle cx="50%" cy="50%" r="150" />
            <circle cx="50%" cy="50%" r="100" />
            <line x1="0" y1="50%" x2="100%" y2="50%" />
            <line x1="50%" y1="0" x2="50%" y2="100%" />
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 z-10 mt-40">
        <h2 className="heading-lg text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          Mission Statement
        </h2>
        
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          variants={quoteVariants}
          initial="hidden"
          animate={controls}
        >
          <p className="text-2xl md:text-3xl font-light leading-relaxed mb-2">
            I believe AI should enhance human creativity, not replace it.
          </p>
          <p className="text-2xl md:text-3xl font-light leading-relaxed mb-2">
            My mission is to build tools that automate the boring,
            amplify the human, and making autonomous workflows work for you.
          </p>
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-secondary to-accent rounded-full mx-auto mt-20"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection; 