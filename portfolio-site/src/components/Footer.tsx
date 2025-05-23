import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1/2 bg-accent/10 blur-3xl rounded-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 mb-4">
                Joshua Greco
              </h2>
              <p className="text-gray-300 max-w-md">
                Engineer, strategist, and builder of better systems based in Greece. 
                Always open to discussing new opportunities and collaborations.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-xl font-bold text-blue-200 mb-4">Connect With Me</h3>
              <a 
                href="mailto:greco.joshua@gmail.com" 
                className="flex items-center text-gray-300 hover:text-white transition-colors mb-2"
              >
                <span className="mr-2"><FaEnvelope /></span>
                greco.joshua@gmail.com
              </a>
              
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://linkedin.com/in/joshuagreco" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-2xl"
                  aria-label="LinkedIn"
                >
                  <span><FaLinkedin /></span>
                </a>
                <a 
                  href="https://github.com/joshgreco" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-2xl"
                  aria-label="GitHub"
                >
                  <span><FaGithub /></span>
                </a>
                <a 
                  href="https://instagram.com/greco380" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-2xl"
                  aria-label="Instagram"
                >
                  <span><FaInstagram /></span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Joshua Greco. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm italic">
              Crafted with intention in Greece, dreaming in neon.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 