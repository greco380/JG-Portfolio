import React, { useEffect, useState } from 'react';
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
  const [isHoveringTopRight, setIsHoveringTopRight] = useState(false);
  const [isHoveringBottomLeft, setIsHoveringBottomLeft] = useState(false);

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

  // Handle scrolling up through cards
  const scrollPrev = () => {
    if (visibleCards[0] > 0) {
      const newVisible = visibleCards.map(index => index - 1);
      setVisibleCards(newVisible);
    }
  };

  // Handle scrolling down through cards
  const scrollNext = () => {
    if (visibleCards[visibleCards.length - 1] < skillCards.length - 1) {
      const newVisible = visibleCards.map(index => index + 1);
      setVisibleCards(newVisible);
    }
  };

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
    hidden: (index: number) => ({
      x: index % 2 === 0 ? -100 : 100,
      y: 50,
      opacity: 0,
      rotateZ: index % 2 === 0 ? -10 : 10
    }),
    visible: (index: number) => ({
      x: 0,
      y: 0,
      opacity: 1,
      rotateZ: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    }),
    exit: (index: number) => ({
      x: index % 2 === 0 ? -100 : 100,
      y: 100,
      opacity: 0,
      rotateZ: index % 2 === 0 ? -10 : 10,
      transition: {
        duration: 0.4,
        ease: 'easeIn'
      }
    })
  };

  return (
    <section id="skills" className="min-h-screen py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <h2 className="heading-lg text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          What I Do
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side - Rolodex of skill cards (moved from right to left) */}
          <motion.div 
            className="lg:w-1/2 relative"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* 120-degree counterclockwise container with perspective */}
            <div className="relative h-[500px] perspective-1000">
              {/* Navigation indicators */}
              {visibleCards[0] > 0 && (
                <motion.div 
                  className="absolute top-0 right-20 z-10 cursor-pointer"
                  initial={{ opacity: 0.6 }}
                  animate={{ 
                    opacity: isHoveringTopRight ? 1 : 0.6,
                    y: isHoveringTopRight ? 5 : 0 
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={scrollPrev}
                  onHoverStart={() => setIsHoveringTopRight(true)}
                  onHoverEnd={() => setIsHoveringTopRight(false)}
                >
                  <div className="bg-accent/20 backdrop-blur-sm p-3 rounded-full">
                    <span className="text-white text-xl">↑</span>
                  </div>
                </motion.div>
              )}
              
              {visibleCards[visibleCards.length - 1] < skillCards.length - 1 && (
                <motion.div 
                  className="absolute bottom-0 left-20 z-10 cursor-pointer"
                  initial={{ opacity: 0.6 }}
                  animate={{ 
                    opacity: isHoveringBottomLeft ? 1 : 0.6,
                    y: isHoveringBottomLeft ? -5 : 0 
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={scrollNext}
                  onHoverStart={() => setIsHoveringBottomLeft(true)}
                  onHoverEnd={() => setIsHoveringBottomLeft(false)}
                >
                  <div className="bg-accent/20 backdrop-blur-sm p-3 rounded-full">
                    <span className="text-white text-xl">↓</span>
                  </div>
                </motion.div>
              )}
              
              {/* Actual Rolodex cards */}
              <AnimatePresence>
                {visibleCards.map((cardIndex, index) => {
                  const card = skillCards[cardIndex];
                  const isActive = activeIndex === index;
                  
                  // Calculate 120-degree counterclockwise angle positioning
                  // Top-right to bottom-left diagonal
                  // Center tiles more horizontally (increase baseX) and raise by 150px (decrease baseY)
                  const baseX = 150 - (index * 80); // Centered more
                  const baseY = -50 + (index * 130); // Raised by 150px
                  const baseRotateZ = -180; // 180-degree angle
                  
                  // Reverse the z-index order: first element (bottom-left) is in front
                  const baseZIndex = index + 1; // Lower index = higher in the stack
                  
                  // Hover adjustments - pop up vertically without rotation change
                  const hoverX = baseX;
                  const hoverY = isActive ? baseY - 75 : baseY; // Move up by 75px on hover
                  const hoverScale = isActive ? 1.08 : 1;
                  const hoverRotateZ = baseRotateZ; // Keep the same rotation
                  const hoverRotateY = 0; // No Y-axis rotation
                  
                  // When active, bring to absolute front regardless of original position
                  const zIndex = isActive ? 100 : baseZIndex;
                  
                  return (
                    <motion.div
                      key={card.id}
                      className="absolute glass-card p-6 rounded-xl overflow-hidden w-full max-w-md"
                      style={{ 
                        zIndex,
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center center',
                      }}
                      animate={{
                        x: hoverX,
                        y: hoverY,
                        rotateZ: hoverRotateZ,
                        rotateY: hoverRotateY,
                        scale: hoverScale,
                        opacity: isActive ? 1 : 0.9,
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      variants={itemVariants}
                      initial="hidden"
                      exit="exit"
                      custom={index}
                      onHoverStart={() => setActiveIndex(index)}
                      onHoverEnd={() => setActiveIndex(null)}
                      whileHover={{
                        y: baseY - 75,
                        scale: 1.08,
                        zIndex: 100,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                    >
                      {/* Top-right hover corner for previous scroll */}
                      {index === 0 && visibleCards[0] > 0 && (
                        <div 
                          className="absolute top-0 right-0 w-16 h-16 cursor-pointer z-20"
                          onMouseEnter={() => {
                            setIsHoveringTopRight(true);
                            scrollPrev();
                          }}
                          onMouseLeave={() => setIsHoveringTopRight(false)}
                        />
                      )}
                      
                      {/* Bottom-left hover corner for next scroll */}
                      {index === visibleCards.length - 1 && 
                       visibleCards[visibleCards.length - 1] < skillCards.length - 1 && (
                        <div 
                          className="absolute bottom-0 left-0 w-16 h-16 cursor-pointer z-20"
                          onMouseEnter={() => {
                            setIsHoveringBottomLeft(true);
                            scrollNext();
                          }}
                          onMouseLeave={() => setIsHoveringBottomLeft(false)}
                        />
                      )}
                      
                      {/* Project card top glowing edge */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary to-accent"></div>
                      
                      {/* Content container with 180 degree rotation to fix upside-down text */}
                      <div className="w-full h-full" style={{ transform: 'rotate(180deg)' }}>
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

          {/* Right side - Text (moved from left to right) */}
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