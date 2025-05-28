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
  const rolodexRef = useRef<HTMLDivElement>(null);

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

  // Auto-rotation logic - TEMPORARILY DISABLED
  const startAutoRotation = useCallback(() => {
    // if (autoRotationRef.current) clearInterval(autoRotationRef.current);
    // autoRotationRef.current = setInterval(() => {
    //   if (!isHovering) {
    //     moveToNext();
    //   }
    // }, 5500); // 5.5 seconds
  }, [isHovering, moveToNext]);

  const stopAutoRotation = () => {
    if (autoRotationRef.current) {
      clearInterval(autoRotationRef.current);
      autoRotationRef.current = null;
    }
  };

  const resetResumeTimer = useCallback(() => {
    // if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    // resumeTimerRef.current = setTimeout(() => {
    //   startAutoRotation();
    // }, 2500); // 2.5 seconds
  }, [startAutoRotation]);

  // Handle scroll wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stopAutoRotation();
    
    if (e.deltaY > 0) {
      moveToPrev();
    } else {
      moveToNext();
    }
    
    resetResumeTimer();
  }, [moveToPrev, moveToNext, stopAutoRotation, resetResumeTimer]);

  // Handle hover
  const handleMouseEnter = () => {
    console.log('Mouse Enter Rolodex Area - Disabling Scroll');
    setIsHovering(true);
    stopAutoRotation();
    // Disable page scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };

  const handleMouseLeave = () => {
    console.log('Mouse Leave Rolodex Area - Enabling Scroll');
    setIsHovering(false);
    resetResumeTimer();
    // Re-enable page scrolling
    document.body.style.overflow = 'unset';
    document.documentElement.style.overflow = 'unset';
  };

  // Start auto-rotation when component loads - TEMPORARILY DISABLED
  useEffect(() => {
    // if (inView) {
    //   startAutoRotation();
    // }
    
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocElementOverflow = document.documentElement.style.overflow;

    return () => {
      stopAutoRotation();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocElementOverflow;
    };
  }, [inView, startAutoRotation]);

  // Effect for handling non-passive wheel event
  useEffect(() => {
    const rolodexElement = rolodexRef.current;

    // Define the event handler for wheel events
    const wheelEventHandler = (e: Event) => {
      // We need to cast e to WheelEvent if we need to access e.deltaY etc.
      // However, handleWheel is already typed with WheelEvent.
      // For addEventListener, the generic Event type is often used.
      handleWheel(e as WheelEvent);
    };

    if (rolodexElement) {
      rolodexElement.addEventListener('wheel', wheelEventHandler, { passive: false } as any);
      return () => {
        rolodexElement.removeEventListener('wheel', wheelEventHandler, { passive: false } as any);
      };
    }
  }, [handleWheel]);

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
      x: index * 50,        // Base X position
      y: 200 - (index * 80), // Base Y position
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    }),
    // Exit animations for scroll down (front tile exits)
    exitDown: (index: number) => {
      const baseX = index * 50;        // X increases (moves right)
      const baseY = 200 - (index * 80); // Y decreases (moves up)
      
      if (index === 0) {
        // Front tile: tilt down and fade (scroll down)
        return {
          rotateX: 90,
          opacity: 0,
          scale: 0.9,
          x: baseX,
          y: baseY,
          transition: {
            duration: 0.8,  // Increased from 0.6
            ease: 'easeOut'
          }
        };
      } else if (index === 1) {
        // Middle tile: slide forward to front position
        return {
          x: baseX - 50,
          y: baseY + 80,
          opacity: 0,  // Fade out immediately
          transition: {
            duration: 1.0,  // Increased from 0.8
            ease: 'easeOut'
          }
        };
      } else {
        // Back tile (index 2): fade out immediately  
        return { 
          opacity: 0,  // Fade out immediately
          transition: { duration: 0.4, ease: 'easeOut' } 
        };
      }
    },
    // Exit animations for scroll up (back tile exits)
    exitUp: (index: number) => {
      const baseX = index * 50;        // X increases (moves right)
      const baseY = 200 - (index * 80); // Y decreases (moves up)
      
      if (index === 2) {
        // Back tile: fade down and out (scroll up)
        return {
          opacity: 0,
          scale: 0.7,
          y: baseY + 100,
          transition: {
            duration: 0.8,  // Increased from 0.6
            ease: 'easeOut'
          }
        };
      } else if (index === 1) {
        // Middle tile: slide back to back position
        return {
          x: baseX + 50,
          y: baseY - 80,
          opacity: 0,  // Fade out immediately
          transition: {
            duration: 1.0,  // Increased from 0.8
            ease: 'easeOut'
          }
        };
      } else {
        // First tile (index 0): fade out immediately
        return { 
          opacity: 0,  // Fade out immediately
          transition: { duration: 0.4, ease: 'easeOut' } 
        };
      }
    },
    // COMMENTED OUT: Enter from bottom animation (was causing unwanted animation on initial load)
    // This could be used for scroll transitions where new back tile enters from bottom-right
    // enterFromBottom: {
    //   x: [-50, -50, -50, 100],  // Start left, end at back position (right)
    //   y: [400, 200, 200, 40],   // Start below, end at back position (top)
    //   opacity: [0, 0, 1, 1],    // Stay invisible longer, then appear
    //   scale: [0.7, 0.7, 1.1, 1],
    //   transition: {
    //     duration: 2.5,
    //     ease: 'easeOut',
    //     times: [0, 0.5, 0.8, 1]  // Delay visibility until 50% through animation
    //   }
    // },
    // Enter from top (new front tile - scroll up) - starts tilted and invisible
    enterFromTop: {
      x: [0, 0],    // Start and end at front position (left)
      y: [200, 200], // Start and end at front position (bottom)
      opacity: [0, 0, 1],       // Stay invisible longer, then appear
      scale: [0.9, 0.9, 1],
      rotateX: [-90, -90, 0],   // Stay tilted longer, then rotate up
      transition: {
        duration: 1.2,           // Slightly longer duration
        ease: 'easeOut',
        times: [0, 0, 1]       // Delay visibility until 40% through animation
      }
    },
    // COMMENTED OUT: Initial position for entering from bottom (no longer used)
    // initialBottom: {
    //   x: -50,  // Start at bottom left
    //   y: 400,  // Start below stack
    //   opacity: 0, // Start invisible
    //   scale: 0.7 // Start small
    // },
    // Initial position for entering from top (prevents final position flash)
    initialTop: {
      x: 0,    // Start at front position (left)
      y: 200,  // Start at front position (bottom)
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
            ref={rolodexRef}
            className="lg:w-1/2 relative"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative h-[400px] perspective-1000">
              {/* Actual Rolodex cards */}
              <AnimatePresence mode="popLayout">
                {visibleCards.map((cardIndex, index) => {
                  const card = skillCards[cardIndex];
                  const isActive = activeIndex === index;
                  
                  // What I Do: Diagonal from bottom-left to top-right
                  // Index 0 (front): Bottom left (0, 200) - HIGHEST Z-INDEX
                  // Index 1 (middle): Middle diagonal (50, 120) 
                  // Index 2 (back): Top right (100, 40) - LOWEST Z-INDEX
                  const baseX = index * 50;
                  const baseY = 200 - (index * 80);
                  const baseZIndex = 3 - index; // Reverse: 0=3, 1=2, 2=1
                  
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
                          ? (index === 2 ? "hidden" : "hidden")  // All tiles start hidden
                          : (index === 0 ? "initialTop" : "hidden")
                      }
                      animate={
                        scrollDirection === 'down' 
                          ? "visible"  // All tiles use standard visible animation
                          : (index === 0 ? "enterFromTop" : "visible")
                      }
                      exit={scrollDirection === 'down' ? "exitDown" : "exitUp"}
                      custom={index}
                      onHoverStart={() => setActiveIndex(index)}
                      onHoverEnd={() => setActiveIndex(null)}
                      whileHover={{
                        x: hoverX,
                        y: baseY - 24,
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