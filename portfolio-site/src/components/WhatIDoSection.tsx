import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const WhatIDoSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([0, 1, 2]);
  const [isHovering, setIsHovering] = useState(false);
  const autoRotationRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const skillCards = [
    {
      id: 1,
      title: 'AI Automation',
      description: 'Building systems that leverage AI to automate repetitive tasks and enhance creative workflows.',
      icon: '🤖',
      delay: 0.1
    },
    {
      id: 2,
      title: 'Data Structuring',
      description: 'Creating scalable and efficient data architectures that support meaningful insights and actions.',
      icon: '📊',
      delay: 0.3
    },
    {
      id: 3,
      title: 'Product Strategy',
      description: 'Crafting product roadmaps that align user needs with business goals and technological capabilities.',
      icon: '🧠',
      delay: 0.5
    },
    {
      id: 4,
      title: 'UX Design',
      description: 'Creating intuitive interfaces that enhance user engagement and simplify complex interactions.',
      icon: '🎨',
      delay: 0.7
    },
    {
      id: 5,
      title: 'Backend Architecture',
      description: 'Designing robust server systems that scale efficiently and maintain data integrity.',
      icon: '⚙️',
      delay: 0.9
    }
  ];

  // Track scroll direction to determine which animations to use
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');

  // Update scroll direction tracking
  const moveToNext = useCallback(() => {
    setScrollDirection('down');
    const nextIndex = (visibleCards[2] + 1) % skillCards.length;
    setVisibleCards([visibleCards[1], visibleCards[2], nextIndex]);
  }, [visibleCards, skillCards.length]);

  const moveToPrev = useCallback(() => {
    setScrollDirection('up');
    const prevIndex = visibleCards[0] === 0 ? skillCards.length - 1 : visibleCards[0] - 1;
    setVisibleCards([prevIndex, visibleCards[0], visibleCards[1]]);
  }, [visibleCards, skillCards.length]);

  // Auto-rotation logic
  const startAutoRotation = useCallback(() => {
    if (autoRotationRef.current) clearInterval(autoRotationRef.current);
    autoRotationRef.current = setInterval(() => {
      if (!isHovering) {
        moveToNext();
      }
    }, 5500); // 5.5 seconds
  }, [isHovering, moveToNext]);

  const stopAutoRotation = () => {
    if (autoRotationRef.current) {
      clearInterval(autoRotationRef.current);
      autoRotationRef.current = null;
    }
  };

  const resetResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      startAutoRotation();
    }, 2500); // 2.5 seconds
  }, [startAutoRotation]);

  // Handle scroll wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    stopAutoRotation();
    
    // Invert scroll direction for more natural feel
    if (e.deltaY > 0) {
      moveToPrev();
    } else {
      moveToNext();
    }
    
    resetResumeTimer();
  };

  // Handle hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    stopAutoRotation();
    // Disable page scrolling
    document.body.style.overflow = 'hidden';
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    resetResumeTimer();
    // Re-enable page scrolling
    document.body.style.overflow = 'unset';
  };

  // Start auto-rotation when component loads
  useEffect(() => {
    if (inView) {
      startAutoRotation();
    }
    
    return () => {
      stopAutoRotation();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      // Clean up: ensure scrolling is re-enabled if component unmounts
      document.body.style.overflow = 'unset';
    };
  }, [inView, startAutoRotation]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    }),
    // Exit animations for scroll down (front tile exits)
    exitDown: (index: number) => {
      const baseX = 50 + (index * 80);   // X increases (moves right)
      const baseY = 210 - (index * 130); // Y decreases (moves up)
      
      if (index === 0) {
        // Front tile: tilt down and fade (scroll down)
        return {
          rotateX: 90,
          opacity: 0,
          scale: 0.9,
          x: baseX,
          y: baseY,
          transition: {
            duration: 0.6,
            ease: 'easeOut'
          }
        };
      } else if (index === 1) {
        // Middle tile: slide forward to front position
        return {
          x: baseX - 80,
          y: baseY + 130,
          transition: {
            duration: 0.8,
            ease: 'easeOut'
          }
        };
      } else {
        return { transition: { duration: 0.4, ease: 'easeOut' } };
      }
    },
    // Exit animations for scroll up (back tile exits)
    exitUp: (index: number) => {
      const baseX = 50 + (index * 80);   // X increases (moves right)
      const baseY = 210 - (index * 130); // Y decreases (moves up)
      
      if (index === 2) {
        // Back tile: fade down and out (scroll up)
        return {
          opacity: 0,
          scale: 0.7,
          y: baseY + 100,
          transition: {
            duration: 0.6,
            ease: 'easeOut'
          }
        };
      } else if (index === 1) {
        // Middle tile: slide back to back position
        return {
          x: baseX + 80,
          y: baseY - 130,
          transition: {
            duration: 0.8,
            ease: 'easeOut'
          }
        };
      } else {
        return { transition: { duration: 0.4, ease: 'easeOut' } };
      }
    },
    // Enter from bottom (new back tile - scroll down) - starts invisible at bottom left
    enterFromBottom: {
      x: [-30, -30, -30, 210],  // Start left, end at back position (right)
      y: [350, 100, 100, -50],  // Start below, end at back position (top)
      opacity: [0, 1, 1, 1],
      scale: [0.7, 1.1, 1.1, 1],
      transition: {
        duration: 2.5,
        ease: 'easeOut',
        times: [0, 0.3, 0.7, 1]
      }
    },
    // Enter from top (new front tile - scroll up) - starts tilted and invisible
    enterFromTop: {
      x: [50, 50],   // Start and end at front position (left)
      y: [210, 210], // Start and end at front position (bottom)
      opacity: [0, 1],
      scale: [0.9, 1],
      rotateX: [-90, 0], // Tilt up from below
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    },
    // Initial position for entering from bottom (prevents final position flash)
    initialBottom: {
      x: -30, // Start at bottom left
      y: 350, // Start below stack
      opacity: 0, // Start invisible
      scale: 0.7 // Start small
    },
    // Initial position for entering from top (prevents final position flash)
    initialTop: {
      x: 50,  // Start at front position (left)
      y: 210, // Start at front position (bottom)
      opacity: 0, // Start invisible
      scale: 0.9, // Start slightly small
      rotateX: -90 // Start tilted down
    }
  };

  return (
    <section id="skills" className="min-h-screen py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <h2 className="heading-lg text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          What I Do
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side - Rolodex of skill cards */}
          <motion.div 
            className="lg:w-1/2 relative"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            onWheel={handleWheel}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative h-[500px] perspective-1000">
              {/* Actual Rolodex cards */}
              <AnimatePresence mode="popLayout">
                {visibleCards.map((cardIndex, index) => {
                  const card = skillCards[cardIndex];
                  const isActive = activeIndex === index;
                  
                  // Calculate positioning - diagonal from bottom left to top right
                  const baseX = 50 + (index * 80);   // X increases (moves right)
                  const baseY = 210 - (index * 130); // Y decreases (moves up)
                  const baseZIndex = index + 1;
                  
                  // Hover adjustments
                  const hoverX = baseX;
                  const zIndex = isActive ? 100 : baseZIndex;
                  
                  return (
                    <motion.div
                      key={`${card.id}-${index}`}
                      className="absolute glass-card p-6 rounded-xl overflow-hidden w-full max-w-md"
                      style={{ 
                        zIndex,
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center bottom',
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      variants={itemVariants}
                      initial={
                        scrollDirection === 'down' 
                          ? (index === 2 ? "initialBottom" : "hidden")
                          : (index === 0 ? "initialTop" : "hidden")
                      }
                      animate={
                        scrollDirection === 'down' 
                          ? (index === 2 ? "enterFromBottom" : "visible")
                          : (index === 0 ? "enterFromTop" : "visible")
                      }
                      exit={scrollDirection === 'down' ? "exitDown" : "exitUp"}
                      custom={index}
                      onHoverStart={() => setActiveIndex(index)}
                      onHoverEnd={() => setActiveIndex(null)}
                      whileHover={{
                        x: hoverX,
                        y: baseY - 75,
                        scale: 1.08,
                        opacity: 1,
                      }}
                    >
                      {/* Project card top glowing edge */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary to-accent"></div>
                      
                      {/* Content container - NO ROTATION */}
                      <div className="w-full h-full">
                        <div className="text-4xl mb-4">{card.icon}</div>
                        <h3 className="text-xl font-bold mb-2 text-blue-200">{card.title}</h3>
                        <p className="text-gray-300">{card.description}</p>
                      </div>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right side - Text */}
          <motion.div 
            className="lg:w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold mb-6 text-blue-200">
                I specialize in building systems that work <span className="italic">for you</span>,
                not the other way around.
              </h3>
            </motion.div>
            
            <motion.ul className="space-y-4 text-lg" variants={containerVariants}>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="inline-block mr-2 text-secondary">▹</span>
                <span>Designing intuitive user experiences that minimize cognitive load</span>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="inline-block mr-2 text-secondary">▹</span>
                <span>Building scalable backends that handle complex workflows</span>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="inline-block mr-2 text-secondary">▹</span>
                <span>Integrating AI systems that enhance user capabilities</span>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="inline-block mr-2 text-secondary">▹</span>
                <span>Optimizing data flows to enable real-time analytics</span>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="inline-block mr-2 text-secondary">▹</span>
                <span>Creating flexible systems that adapt to changing needs</span>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatIDoSection; 