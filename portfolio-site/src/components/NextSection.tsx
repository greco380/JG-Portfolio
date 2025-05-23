import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NextSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

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
      position: 'left'
    },
    {
      id: 2,
      title: 'Present',
      description: 'AI R&D & System Architecture',
      highlights: ['AI Integration', 'Platform Building', 'Process Automation'],
      position: 'center'
    },
    {
      id: 3,
      title: 'Future',
      description: 'Next Role & Collaborations',
      highlights: ['Europe Based', 'Remote Friendly', 'Strategic Projects'],
      position: 'right'
    }
  ];

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

  const arrowVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        duration: 0.8,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section id="next" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary/70 opacity-50"></div>
      
      <div className="container mx-auto px-4 z-10" ref={ref}>
        <h2 className="heading-lg text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          What's Next
        </h2>
        
        <motion.div
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Timeline map */}
          <div className="relative flex flex-col md:flex-row justify-between items-center mb-20">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <motion.div
                  className="glass-card p-8 md:w-64 md:h-64 flex flex-col justify-center text-center mb-12 md:mb-0 relative"
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
                  
                  {/* Connector dots on the corners */}
                  <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-accent"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-accent"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-accent"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-accent"></div>
                </motion.div>
                
                {/* Arrow connector */}
                {index < items.length - 1 && (
                  <motion.div 
                    className="hidden md:block h-0.5 bg-gradient-to-r from-secondary to-accent flex-grow mx-4 relative"
                    variants={arrowVariants}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-45 w-2 h-2 border-t-2 border-r-2 border-accent"></div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* CTA Section */}
          <motion.div 
            className="text-center mt-16"
            variants={itemVariants}
          >
            <p className="text-xl mb-8 max-w-2xl mx-auto">
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