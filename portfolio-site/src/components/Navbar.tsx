import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('hero');
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
    { name: 'Home', to: 'hero' },
    { name: 'About', to: 'mission' },
    { name: 'Blog', to: 'philosophy' },
    { name: 'Projects', to: 'projects' }
  ];

  // Mobile menu items
  const mobileMenuItems = [
    { name: 'Home', to: 'hero' },
    { name: 'Contact Me', to: 'contact' },
    { name: 'About', to: 'mission' },
    { name: 'Blog', to: 'philosophy' },
    { name: 'Projects', to: 'projects' }
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
          {/* Transparent border line */}
          <div className="absolute top-[3.2rem] left-0 right-0 h-20 bg-transparent z-20 border-t border-[#c392ec]/30 pointer-events-none"></div>
          
          {/* Bookmark tabs */}
          <motion.div 
            className="absolute left-0 right-0 flex justify-center z-30"
            style={{ scale: bookmarksScale }}
          >
            <div className="flex items-start space-x-1 relative z-10">
              {menuItems.map((item, index) => {
                const isActive = activeItem === item.to;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={800}
                    onSetActive={() => setActiveItem(item.to)}
                    className="relative cursor-pointer"
                  >
                    {/* Tab with perspective effect */}
                    <div className={`
                      relative py-4 px-8 rounded-t-xl text-lg font-medium bookmark-tab
                      transition-all duration-300 transform
                      ${isActive 
                        ? 'bg-[#85d5c8] text-[#0f172a] bookmark-tab-active' 
                        : 'bg-[#85d5c8]/70 text-gray-800 hover:bg-[#85d5c8]/90'
                      }
                    `} style={{
                      transform: `perspective(800px) rotateX(${isActive ? '0deg' : '-5deg'}) translateY(${isActive ? '-1px' : '0'})`,
                      transformOrigin: 'bottom center',
                      boxShadow: isActive 
                        ? '0 -5px 15px 0 rgba(195, 146, 236, 0.5)' 
                        : '0 -3px 5px 0 rgba(195, 146, 236, 0.2)'
                    }}>
                      {/* Light reflection effect */}
                      <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent rounded-t-xl pointer-events-none"></div>
                      
                      {/* Subtle side glow for all tabs */}
                      <div className="absolute inset-0 rounded-t-xl pointer-events-none" style={{
                        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(195, 146, 236, 0.2)'
                      }}></div>
                      
                      {/* Additional glow for active tab */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-t-xl border border-[#c392ec]/50 pointer-events-none"></div>
                      )}
                    
                      {/* Content with subtle 3D effect */}
                      <span className="relative z-10 block">{item.name}</span>
                    </div>
                  </Link>
                );
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
                    transform: 'scale(2.4)',
                    transformOrigin: 'center left'
                  }}
                />
              </div>
            </div>

            {/* Center: Navigation Menu */}
            <div className="hidden md:flex justify-center items-center space-x-10 w-2/4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="text-white hover:text-blue-200 transition-colors cursor-pointer text-[23px] font-medium font-sans"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right: Contact Me text */}
            <div className="hidden md:flex justify-end w-1/4">
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="text-white hover:text-blue-200 transition-colors cursor-pointer text-sm font-medium"
              >
                Contact Me
              </Link>
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
                {mobileMenuItems.map((item, index) => (
                  <Link
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
                  </Link>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 