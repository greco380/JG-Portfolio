import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PhilosophySection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  });
  const [activePhrase, setActivePhrase] = useState(0);

  const phrases = [
    { text: "I value clarity.", delay: 0 },
    { text: "I design with intent.", delay: 2 },
    { text: "Unfinished is worse than imperfect.", delay: 4 }
  ];

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Cycle through phrases
      const interval = setInterval(() => {
        setActivePhrase((prev) => {
          if (prev === phrases.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [controls, inView, phrases.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 2,
        duration: 0.8,
        ease: 'easeOut'
      }
    })
  };

  const underlineVariants = {
    hidden: { width: '0%' },
    visible: {
      width: '100%',
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section id="philosophy" className="min-h-screen flex items-center justify-center py-20 relative" ref={ref}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <h2 className="heading-lg text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          My Philosophy
        </h2>
        
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="relative h-24">
            {phrases.map((phrase, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
                style={{ opacity: activePhrase === index ? 1 : 0 }}
                variants={itemVariants}
                custom={index}
              >
                <h3 className="text-3xl md:text-4xl font-light">
                  {phrase.text}
                </h3>
                
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-secondary to-accent mt-4"
                  variants={underlineVariants}
                  initial="hidden"
                  animate={activePhrase === index ? "visible" : "hidden"}
                />
              </motion.div>
            ))}
          </div>
          
          <motion.p 
            className="text-gray-300 mt-24 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: 6, duration: 1 }}
          >
            These principles guide everything I build, from the initial concept to the final polish.
            They help me create systems that are intuitive, intentional, and always focused on the
            end user's experience.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection; 