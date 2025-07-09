import React from 'react';
import { motion } from 'framer-motion';
import HolographicGlobe from './HolographicGlobe';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Hero Section with Character Description */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              About Joshua Greco
            </h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <img 
                src="/josh_official.png" 
                alt="Joshua Greco" 
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full mx-auto shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="prose prose-lg prose-invert max-w-3xl mx-auto"
            >
              <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
                I'm a systems engineer and product strategist who believes that the best technology 
                is invisible to the user. My work focuses on creating intelligent systems that 
                enhance human capabilities rather than replace them.
              </p>
              
              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                With a background spanning AI automation, data architecture, and full-stack development, 
                I specialize in building bridges between complex technical systems and the people who 
                use them. Whether it's designing intuitive interfaces, optimizing data flows, or 
                integrating AI into existing workflows, I'm passionate about creating solutions that 
                just work.
              </p>
              
              <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to 
                open-source projects, or mentoring the next generation of engineers. I believe 
                that the future belongs to those who can combine technical expertise with human 
                empathy.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Globe Section */}
      <section className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Interactive Globe
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore this interactive visualization showcasing my global perspective and technical capabilities.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <HolographicGlobe />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary/80 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Connect with me
            </h3>
            <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 px-4">
              Let's build something amazing together
            </p>
            <div className="flex justify-center space-x-4 md:space-x-6 mb-6 md:mb-8">
              <a href="mailto:contact@joshuagreco.com" className="text-secondary hover:text-accent transition-colors px-2 py-1 text-sm md:text-base">
                Email
              </a>
              <a href="https://linkedin.com/in/joshuagreco" className="text-secondary hover:text-accent transition-colors px-2 py-1 text-sm md:text-base">
                LinkedIn
              </a>
              <a href="https://github.com/joshuagreco" className="text-secondary hover:text-accent transition-colors px-2 py-1 text-sm md:text-base">
                GitHub
              </a>
            </div>
            <p className="text-gray-500 text-xs md:text-sm px-4">
              © 2025 Joshua Greco. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;