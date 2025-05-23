import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<number[]>([0, 1, 2]);
  const [isHovering, setIsHovering] = useState(false);
  const autoRotationRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const projects = [
    {
      id: 1,
      title: 'Neural Interface',
      description: 'A natural language processing system that connects AI models to traditional software interfaces.',
      techStack: ['React', 'Python', 'TensorFlow', 'API Design'],
      demo: '#',
      code: '#',
      delay: 0
    },
    {
      id: 2,
      title: 'Data Visualizer Pro',
      description: 'Interactive dashboard for complex data visualization with real-time updates and collaborative features.',
      techStack: ['D3.js', 'Next.js', 'GraphQL', 'WebSockets'],
      demo: '#',
      code: '#',
      delay: 0.2
    },
    {
      id: 3,
      title: 'Workflow Automator',
      description: 'No-code platform for creating custom automated workflows across multiple software platforms.',
      techStack: ['Vue.js', 'Node.js', 'MongoDB', 'OAuth'],
      demo: '#',
      code: '#',
      delay: 0.4
    },
    {
      id: 4,
      title: 'AI Content Generator',
      description: 'Creative assistant that generates and refines content using advanced language models.',
      techStack: ['OpenAI API', 'React', 'Node.js', 'Firebase'],
      demo: '#',
      code: '#',
      delay: 0.6
    },
    {
      id: 5,
      title: 'Blockchain Explorer',
      description: 'Interactive tool for visualizing and analyzing blockchain transactions and smart contracts.',
      techStack: ['Ethereum', 'Web3.js', 'Next.js', 'TypeScript'],
      demo: '#',
      code: '#',
      delay: 0.8
    }
  ];

  // Update scroll direction tracking
  const moveToNext = useCallback(() => {
    setScrollDirection('down');
    const nextIndex = (visibleProjects[2] + 1) % projects.length;
    setVisibleProjects([visibleProjects[1], visibleProjects[2], nextIndex]);
  }, [visibleProjects, projects.length]);

  const moveToPrev = useCallback(() => {
    setScrollDirection('up');
    const prevIndex = visibleProjects[0] === 0 ? projects.length - 1 : visibleProjects[0] - 1;
    setVisibleProjects([prevIndex, visibleProjects[0], visibleProjects[1]]);
  }, [visibleProjects, projects.length]);

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

  // Track scroll direction to determine which animations to use
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');

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
      const baseX = 200 + (index * 80);  // X increases (moves right)
      const baseY = 360 - (index * 130); // Y decreases (moves up)
      
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
      const baseX = 200 + (index * 80);  // X increases (moves right)
      const baseY = 360 - (index * 130); // Y decreases (moves up)
      
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
    // Enter from bottom (new back tile - scroll down) - starts invisible at bottom right
    enterFromBottom: {
      x: [120, 120, 120, 360],  // Start left, end at back position (right)
      y: [500, 250, 250, 100],  // Start below, end at back position (top)
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
      x: [200, 200],  // Start and end at front position (left)
      y: [360, 360],  // Start and end at front position (bottom)
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
      x: 120, // Start at bottom left
      y: 500, // Start below stack
      opacity: 0, // Start invisible
      scale: 0.7 // Start small
    },
    // Initial position for entering from top (prevents final position flash)
    initialTop: {
      x: 200, // Start at front position (left)
      y: 360, // Start at front position (bottom)
      opacity: 0, // Start invisible
      scale: 0.9, // Start slightly small
      rotateX: -90 // Start tilted down
    }
  };

  return (
    <section id="projects" className="min-h-screen py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side - "Projects" heading and description */}
          <motion.div 
            className="lg:w-1/3 flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Projects
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Explore my featured work, each project highlighting different skills and technologies. Hover to inspect, scroll to navigate.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <a 
                href="/#projects" 
                className="btn-primary inline-flex items-center mt-6"
              >
                View All Projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Right side - Rolodex of project cards */}
          <motion.div
            className="lg:w-2/3 relative"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            onWheel={handleWheel}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative h-[600px] perspective-1000">
              {/* Actual Rolodex cards */}
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((projectIndex, index) => {
                  const project = projects[projectIndex];
                  const isActive = activeIndex === index;
                  
                  // Calculate positioning - diagonal from bottom left to top right
                  const baseX = 200 + (index * 80);  // X increases (moves right)
                  const baseY = 360 - (index * 130); // Y decreases (moves up)
                  const baseZIndex = index + 1;
                  
                  // Hover adjustments
                  const hoverX = baseX;
                  const zIndex = isActive ? 100 : baseZIndex;
                  
                  return (
                    <motion.div
                      key={`${project.id}-${index}`}
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
                         <h3 className="text-2xl font-bold mb-3 text-blue-200 transition-colors">
                           {project.title}
                         </h3>
                         
                         <p className="text-gray-300 mb-6">
                           {project.description}
                         </p>
                         
                         {/* Tech stack */}
                         <div className="mb-6">
                           <div className="flex flex-wrap gap-2">
                             {project.techStack.map((tech, i) => (
                               <span 
                                 key={i}
                                 className="px-3 py-1 text-xs rounded-full bg-white/10 text-blue-100"
                               >
                                 {tech}
                               </span>
                             ))}
                           </div>
                         </div>
                         
                         {/* Links */}
                         <div className="flex justify-between mt-auto">
                           <a 
                             href={project.demo}
                             className="flex items-center text-sm text-blue-200 hover:text-white transition-colors"
                             aria-label={`View live demo of ${project.title}`}
                           >
                             <span className="mr-2"><FaExternalLinkAlt /></span>
                             Try Demo
                           </a>
                           <a 
                             href={project.code}
                             className="flex items-center text-sm text-blue-200 hover:text-white transition-colors"
                             aria-label={`View code for ${project.title}`}
                           >
                             <span className="mr-2"><FaGithub /></span>
                             View Code
                           </a>
                         </div>
                       </div>
                       
                       {/* Hover effect */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection; 