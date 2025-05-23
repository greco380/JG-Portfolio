import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const ProjectsSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<number[]>([0, 1, 2]);
  const [isHoveringTopRight, setIsHoveringTopRight] = useState(false);
  const [isHoveringBottomLeft, setIsHoveringBottomLeft] = useState(false);

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

  // Handle scrolling up through projects
  const scrollPrev = () => {
    if (visibleProjects[0] > 0) {
      const newVisible = visibleProjects.map(index => index - 1);
      setVisibleProjects(newVisible);
    }
  };

  // Handle scrolling down through projects
  const scrollNext = () => {
    if (visibleProjects[visibleProjects.length - 1] < projects.length - 1) {
      const newVisible = visibleProjects.map(index => index + 1);
      setVisibleProjects(newVisible);
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
              Explore my featured work, each project highlighting different skills and technologies. Hover over a project to see more details.
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
          
          {/* Right side - Rolodex of project cards at 45-degree angle */}
          <motion.div
            className="lg:w-2/3 relative"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* 120-degree counterclockwise container with perspective */}
            <div className="relative h-[600px] perspective-1000">
              {/* Navigation indicators */}
              {visibleProjects[0] > 0 && (
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
                    <FaChevronUp className="text-white text-xl" />
                  </div>
                </motion.div>
              )}
              
              {visibleProjects[visibleProjects.length - 1] < projects.length - 1 && (
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
                    <FaChevronDown className="text-white text-xl" />
                  </div>
                </motion.div>
              )}
              
              {/* Actual Rolodex cards */}
              <AnimatePresence>
                {visibleProjects.map((projectIndex, index) => {
                  const project = projects[projectIndex];
                  const isActive = activeIndex === index;
                  
                  // Calculate 120-degree counterclockwise angle positioning
                  // Top-right to bottom-left diagonal
                  const baseX = 300 - (index * 80);
                  const baseY = 100 + (index * 130);
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
                      key={project.id}
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
                       {index === 0 && visibleProjects[0] > 0 && (
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
                       {index === visibleProjects.length - 1 && 
                        visibleProjects[visibleProjects.length - 1] < projects.length - 1 && (
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