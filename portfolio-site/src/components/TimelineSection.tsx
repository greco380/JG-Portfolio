import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TimelineSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const timelineEvents = [
    {
      id: 1,
      year: '2019',
      title: 'Data Intelligence Platform',
      result: 'Streamlined analytics for enterprise clients',
      link: '#',
      delay: 0
    },
    {
      id: 2,
      year: '2020',
      title: 'Workflow Automation Tool',
      result: 'Reduced manual tasks by 65% for marketing teams',
      link: '#',
      delay: 0.2
    },
    {
      id: 3,
      year: '2021',
      title: 'AI Integration System',
      result: 'Connected disparate tools with intelligent interfaces',
      link: '#',
      delay: 0.4
    },
    {
      id: 4,
      year: '2022',
      title: 'Predictive Analytics Engine',
      result: 'Forecast accuracy improved by 42% for clients',
      link: '#',
      delay: 0.6
    },
    {
      id: 5,
      year: 'Present',
      title: 'Full-Stack System Architecture',
      result: 'Building the next generation of intelligent tools',
      link: '#',
      delay: 0.8
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  const lineVariants = {
    hidden: { height: 0 },
    visible: {
      height: '100%',
      transition: {
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section id="timeline" className="min-h-screen py-20 bg-primary/90" ref={ref}>
      <div className="container mx-auto px-4">
        <h2 className="heading-lg text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          Project Timeline
        </h2>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Central timeline line */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary/30 via-accent/50 to-secondary/30"
            variants={lineVariants}
            initial="hidden"
            animate={controls}
          />
          
          <motion.div
            className="relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {timelineEvents.map((event, index) => (
              <motion.div 
                key={event.id}
                className="mb-16 relative"
                variants={itemVariants}
                custom={index}
              >
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <h3 className="text-xl font-bold text-blue-200">{event.title}</h3>
                    <p className="text-gray-300 mt-2">{event.result}</p>
                    <a href={event.link} className="inline-block mt-2 text-secondary hover:text-accent transition-colors duration-300">
                      See More
                    </a>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center z-20 shadow-lg shadow-accent/30">
                      <span className="text-xs font-bold">{event.year}</span>
                    </div>
                    
                    {/* Glowing connection effect */}
                    <motion.div 
                      className="absolute top-5 w-8 h-8 rounded-full bg-accent/30 blur-md z-10"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop'
                      }}
                    />
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection; 