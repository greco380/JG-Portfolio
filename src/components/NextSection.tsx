import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NextSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const items = [
    {
      id: 1,
      title: 'Past',
      description: 'Agency work & enterprise projects',
      highlights: ['Baresquare', 'Analytics', 'Agency Consulting'],
    },
    {
      id: 2,
      title: 'Present',
      description: 'AI R&D & System Architecture',
      highlights: ['AI Integration', 'Platform Building', 'Process Automation'],
    },
    {
      id: 3,
      title: 'Future',
      description: 'Next Role & Collaborations',
      highlights: ['Europe Based', 'Remote Friendly', 'Strategic Projects'],
    }
  ];

  // Calculate layout based on screen size
  const getLayout = () => {
    const isDesktop = screenSize.width >= 1024;
    const isTablet = screenSize.width >= 768;
    
    if (isDesktop) {
      // Desktop: Try to fit 3 items per row, if not possible, snake to next row
      const itemsPerRow = Math.min(3, Math.floor(screenSize.width / 320));
      return { itemsPerRow, totalRows: Math.ceil(items.length / itemsPerRow) };
    } else if (isTablet) {
      // Tablet: 2 items per row
      return { itemsPerRow: 2, totalRows: Math.ceil(items.length / 2) };
    } else {
      // Mobile: 1 item per row
      return { itemsPerRow: 1, totalRows: items.length };
    }
  };

  const layout = getLayout();
  
  // Calculate position for each item in snake pattern
  const getItemPosition = (index: number) => {
    const { itemsPerRow } = layout;
    const row = Math.floor(index / itemsPerRow);
    const colInRow = index % itemsPerRow;
    
    // For odd rows, reverse the order (snake pattern)
    const adjustedCol = row % 2 === 0 ? colInRow : itemsPerRow - 1 - colInRow;
    
    return { row, col: adjustedCol, originalIndex: index };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  };

  // Generate pathway connections between items
  const generatePathway = (fromIndex: number, toIndex: number) => {
    const fromPos = getItemPosition(fromIndex);
    const toPos = getItemPosition(toIndex);
    
    // If items are on the same row, horizontal connection
    if (fromPos.row === toPos.row) {
      return { type: 'horizontal', from: fromPos, to: toPos };
    }
    
    // If items are on different rows, right-angle connection
    return { type: 'right-angle', from: fromPos, to: toPos };
  };

  return (
    <section id="next" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary/70 opacity-50"></div>
      
      <div className="container mx-auto px-4 z-10" ref={ref}>
        <h2 className="heading-lg text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          What's Next
        </h2>
        
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Snake Grid Layout */}
          <div className="relative mb-20">
            {/* Grid container */}
            <div 
              className="grid gap-8 mb-8"
              style={{
                gridTemplateColumns: `repeat(${layout.itemsPerRow}, 1fr)`,
                gridTemplateRows: `repeat(${layout.totalRows}, 1fr)`
              }}
            >
              {items.map((item, index) => {
                const position = getItemPosition(index);
                
                return (
                  <motion.div
                    key={item.id}
                    className="glass-card p-6 flex flex-col justify-center text-center relative min-h-[280px]"
                    style={{
                      gridColumn: position.col + 1,
                      gridRow: position.row + 1
                    }}
                    variants={itemVariants}
                  >
                    <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white text-xs px-4 py-1 rounded-full">
                      {item.title}
                    </span>
                    <h3 className="text-xl font-bold mb-4 text-blue-200">{item.description}</h3>
                    <ul className="text-gray-300 space-y-2">
                      {item.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm">{highlight}</li>
                      ))}
                    </ul>
                    
                    {/* Connection points */}
                    <div className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-accent opacity-50"></div>
                    <div className="absolute top-1/2 -left-4 w-2 h-2 rounded-full bg-accent opacity-50"></div>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-accent opacity-50"></div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-accent opacity-50"></div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Pathway Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {items.map((_, index) => {
                if (index === items.length - 1) return null;
                
                const currentPos = getItemPosition(index);
                const nextPos = getItemPosition(index + 1);
                const pathway = generatePathway(index, index + 1);
                
                const cardWidth = 100 / layout.itemsPerRow; // percentage width
                const cardHeight = 280 + 32; // card height + gap
                
                const fromX = (currentPos.col * cardWidth) + (cardWidth / 2);
                const fromY = (currentPos.row * cardHeight) + (cardHeight / 2);
                const toX = (nextPos.col * cardWidth) + (cardWidth / 2);
                const toY = (nextPos.row * cardHeight) + (cardHeight / 2);
                
                if (pathway.type === 'horizontal') {
                  // Simple horizontal line
                  return (
                    <motion.line
                      key={`path-${index}`}
                      x1={`${fromX}%`}
                      y1={`${(fromY / (layout.totalRows * cardHeight)) * 100}%`}
                      x2={`${toX}%`}
                      y2={`${(toY / (layout.totalRows * cardHeight)) * 100}%`}
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      variants={pathVariants}
                    />
                  );
                } else {
                  // Right-angle path
                  const midY = (fromY + toY) / 2;
                  
                  return (
                    <motion.path
                      key={`path-${index}`}
                      d={`M ${fromX}% ${(fromY / (layout.totalRows * cardHeight)) * 100}% 
                          L ${fromX}% ${(midY / (layout.totalRows * cardHeight)) * 100}%
                          L ${toX}% ${(midY / (layout.totalRows * cardHeight)) * 100}%
                          L ${toX}% ${(toY / (layout.totalRows * cardHeight)) * 100}%`}
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      fill="none"
                      variants={pathVariants}
                    />
                  );
                }
              })}
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* CTA Section */}
          <motion.div 
            className="text-center mt-12 md:mt-16"
            variants={itemVariants}
          >
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4">
              I'm currently available for new opportunities and collaborations.
              Let's discuss how my skills and experience could benefit your team.
            </p>
            <a 
              href="#contact" 
              className="btn-primary inline-block"
            >
              Let's Talk
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NextSection; 