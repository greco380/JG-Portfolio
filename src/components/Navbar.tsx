import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('hero');
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Dynamic animation values based on scroll position
  const bookmarksScale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const bookmarksY = useTransform(scrollY, [0, 300], [0, -100]);
  const bookmarksOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // For the scrolled navbar, use a slightly higher threshold to ensure smooth transition
  const scrolledNavOpacity = useTransform(scrollY, [200, 300], [0, 1]);
  const scrolledNavY = useTransform(scrollY, [200, 300], [100, 0]);
  
  // Boolean for conditional rendering
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 250);
    };
    
    window.addEventListener('scroll', updateScrollState);
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: 'Home', to: '/', type: 'route' },
    { name: 'About', to: '/about', type: 'route' },
    { name: 'Blog', to: 'philosophy', type: 'scroll' },
    { name: 'Projects', to: 'projects', type: 'scroll' }
  ];

  // Mobile menu items
  const mobileMenuItems = [
    { name: 'Home', to: '/', type: 'route' },
    { name: 'About', to: '/about', type: 'route' },
    { name: 'Blog', to: 'philosophy', type: 'scroll' },
    { name: 'Projects', to: 'projects', type: 'scroll' },
    { name: 'Contact Me', to: 'https://calendly.com/greco-joshua', type: 'external' }
  ];

  return (
    <>
      {/* Initial Bookmark-style Menu with dynamic animation */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-40"
        style={{ 
          opacity: bookmarksOpacity,
          y: bookmarksY,
          pointerEvents: isScrolled ? 'none' : 'auto'
        }}
      >
        <div className="container mx-auto">
          {/* Oval Menu Container */}
          <motion.div 
            className="absolute left-0 right-0 flex justify-center z-30"
            style={{ scale: bookmarksScale }}
          >
            <div 
              className="flex items-center justify-center space-x-8 relative z-10 px-8 py-4"
              style={{
                background: 'linear-gradient(150deg, #7c3aed, #4f46e5, #0f172a)',
                borderRadius: '50px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {menuItems.map((item, index) => {
                const isActive = (item.type === 'route' && location.pathname === item.to) || 
                                (item.type === 'scroll' && activeItem === item.to);
                
                if (item.type === 'route') {
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="relative cursor-pointer group"
                    >
                      <div className={`
                        relative py-2 px-4 rounded-full text-lg font-medium transition-all duration-300
                        ${isActive 
                          ? 'text-white bg-white/20' 
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                        }
                        overflow-hidden
                      `}>
                        {/* Diagonal ripple effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                        
                        {/* Content */}
                        <span className="relative z-10">{item.name}</span>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <ScrollLink
                      key={item.name}
                      to={item.to}
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={800}
                      onSetActive={() => setActiveItem(item.to)}
                      className="relative cursor-pointer group"
                    >
                      <div className={`
                        relative py-2 px-4 rounded-full text-lg font-medium transition-all duration-300
                        ${isActive 
                          ? 'text-white bg-white/20' 
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                        }
                        overflow-hidden
                      `}>
                        {/* Diagonal ripple effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                        
                        {/* Content */}
                        <span className="relative z-10">{item.name}</span>
                      </div>
                    </ScrollLink>
                  );
                }
              })}
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden absolute top-4 right-4 z-40">
            <button 
              className="p-3 bg-[#85d5c8] rounded-full text-[#0f172a] focus:outline-none shadow-lg shadow-[#c392ec]/20"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="text-xl">
                <span><FaBars /></span>
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scrolled Navbar - smoothly fades in as user scrolls */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 bg-primary/95 backdrop-blur-md shadow-lg"
        style={{ 
          opacity: scrolledNavOpacity,
          y: scrolledNavY,
          pointerEvents: isScrolled ? 'auto' : 'none'
        }}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {/* Left: Logo (JG Icon) */}
            <div className="flex items-center w-1/4 relative overflow-visible">
              <div className="relative">
                <img 
                  src="/jg_blue_pink_5.png" 
                  alt="JG Logo" 
                  className="w-10 h-10 object-contain"
                  style={{
                    transform: 'scale(2.0)',
                    transformOrigin: 'center left'
                  }}
                />
              </div>
            </div>

            {/* Center: Navigation Menu */}
            <div className="hidden md:flex justify-center items-center space-x-10 w-2/4">
              {menuItems.map((item) => {
                if (item.type === 'route') {
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="text-white hover:text-blue-200 transition-colors cursor-pointer text-[23px] font-medium font-sans"
                    >
                      {item.name}
                    </Link>
                  );
                } else {
                  return (
                    <ScrollLink
                      key={item.name}
                      to={item.to}
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}
                      className="text-white hover:text-blue-200 transition-colors cursor-pointer text-[23px] font-medium font-sans"
                    >
                      {item.name}
                    </ScrollLink>
                  );
                }
              })}
            </div>

            {/* Right: Contact Me text */}
            <div className="hidden md:flex justify-end w-1/4">
              {/* TODO: Update this Calendly integration at a later time */}
              <a
                href="https://calendly.com/greco-joshua"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors cursor-pointer text-sm font-medium"
              >
                Contact Me
              </a>
            </div>

            {/* Mobile Menu Button (only visible on mobile) */}
            <div className="md:hidden">
              <button 
                className="text-white focus:outline-none"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <span className="text-xl">
                  {isMenuOpen ? <span><FaTimes /></span> : <span><FaBars /></span>}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-primary/95 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div
                className="flex flex-col items-center space-y-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                {mobileMenuItems.map((item, index) => {
                  if (item.type === 'route') {
                    return (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="text-white hover:text-blue-200 transition-colors cursor-pointer text-xl font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                        >
                          {item.name}
                        </motion.div>
                      </Link>
                    );
                  } else if (item.type === 'external') {
                    return (
                      <a
                        key={item.name}
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-200 transition-colors cursor-pointer text-xl font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                        >
                          {item.name}
                        </motion.div>
                      </a>
                    );
                  } else {
                    return (
                      <ScrollLink
                        key={item.name}
                        to={item.to}
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="text-white hover:text-blue-200 transition-colors cursor-pointer text-xl font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                        >
                          {item.name}
                        </motion.div>
                      </ScrollLink>
                    );
                  }
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 