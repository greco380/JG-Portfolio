import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Transform values based on scroll position
  const ovalToRectProgress = useTransform(
    scrollY, 
    [0, windowHeight * 0.5], 
    [0, 1]
  );
  
  // Transform container shape - Make it a true wide oval initially
  const borderRadius = useTransform(
    ovalToRectProgress,
    [0, 1],
    ['50% / 50%', '20px']
  );
  
  // Transform container dimensions - Make it a wide oval initially
  const width = useTransform(
    ovalToRectProgress,
    [0, 1],
    ['95vw', '100%']
  );
  
  const height = useTransform(
    ovalToRectProgress,
    [0, 1],
    ['90vh', '80vh']
  );
  
  // Remove/reduce padding for initial oval effect
  const paddingX = useTransform(
    ovalToRectProgress,
    [0, 1],
    ['1vw', '0%']
  );
  const paddingY = useTransform(
    ovalToRectProgress,
    [0, 1],
    ['1vh', '0%']
  );
  
  // Transform content layout - responsive for mobile
  const gridTemplateColumns = useTransform(
    ovalToRectProgress,
    [0, 1],
    ['1fr 1fr', '0.8fr 1.2fr']
  );
  
  // Profile image scaling
  const profileScale = useTransform(
    ovalToRectProgress,
    [0, 1],
    [1, 0.8]
  );
  
  // Text scaling
  const nameScale = useTransform(
    ovalToRectProgress,
    [0, 1],
    [1, 1.2]
  );
  
  // Background gradient rotation
  const gradientRotation = useTransform(
    ovalToRectProgress,
    [0, 1],
    ['150deg', '120deg']
  );
  
  // Create a dynamic background style that updates with the gradient rotation
  const backgroundStyle = useTransform(
    gradientRotation,
    (rotation) => `linear-gradient(${rotation}, #0f172a, #4f46e5, #7c3aed)`
  );

  // Create outline border style with gradient
  const outlineBorderStyle = useTransform(
    gradientRotation,
    (rotation) => `23px solid transparent`
  );

  const outlineBackgroundStyle = useTransform(
    gradientRotation,
    (rotation) => `linear-gradient(${rotation}, #0f172a, #4f46e5, #7c3aed)`
  );

  return (
    <section id="hero" className="flex justify-center items-center min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary z-0"></div>
      
      {/* Background Icon Overlay - positioned on left side */}
      <div 
        className="absolute left-0 top-0 w-1/2 h-full opacity-70 flex items-center justify-center hidden md:flex"
        style={{
          zIndex: 15,
          transform: 'scale(1.2)'
        }}
      >
        <img 
          src="/background-icon.png" 
          alt="Background Icon" 
          className="w-full h-full object-contain"
          style={{
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
      
      {/* Profile Image Layer - positioned in front of background icon */}
      <div 
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center hidden md:flex"
        style={{
          zIndex: 20,
          transform: 'translateY(-75px)'
        }}
      >
        <motion.img 
          src="/profile_Josh_edit.PNG" 
          alt="Joshua Greco Profile" 
          className="w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] object-cover rounded-full shadow-2xl"
          style={{ 
            scale: profileScale,
            transform: 'scale(2.3)'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.3 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </div>
      
      {/* Oval to Rectangle Container */}
      <motion.div 
        className="relative z-10 overflow-hidden"
        style={{
          width,
          height,
          borderRadius,
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.3)',
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          margin: '0 auto',
          background: outlineBackgroundStyle,
          padding: '23px'
        }}
      >
        {/* Inner content container that masks the gradient background */}
        <div 
          className="relative w-full h-full"
          style={{
            backgroundColor: '#0f172a',
            borderRadius: 'inherit'
          }}
        >
          {/* Frosted glass interior */}
          <div 
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(10px) saturate(1.8)',
              opacity: 0.6,
              borderRadius: 'inherit'
            }}
          ></div>
        {/* Mobile Layout - Vertical Stack */}
        <div className="md:hidden w-full h-full flex flex-col justify-center items-center p-4 space-y-8 relative z-10">
          {/* Mobile Text Content - Top Priority */}
          <motion.div 
            className="flex flex-col justify-center text-center"
            style={{ scale: nameScale }}
          >
            <div className="bg-purple-700/80 p-4 rounded-2xl backdrop-blur-sm">
              <motion.h1 
                className="text-3xl font-black text-mint-green mb-3"
                style={{ 
                  color: 'rgb(200, 255, 230)',
                  textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
                  fontWeight: '400',
                  fontSize: '116%',
                  fontFamily: 'Membra, sans-serif !important'
                }}
              >
                Joshua Greco
              </motion.h1>
              
              <div className="flex flex-col items-center space-y-1">
                <motion.h2 className="text-lg text-white font-light">
                  Systems Engineer.
                </motion.h2>
                <motion.h2 className="text-lg text-white font-light ml-4">
                  Solutions Consultant.
                </motion.h2>
                <motion.h2 className="text-lg text-white font-light ml-8">
                  AI Integration Specialist.
                </motion.h2>
              </div>
            </div>
            
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a 
                href="https://calendly.com/greco-joshua"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Contact Me
              </a>
            </motion.div>
          </motion.div>

          {/* Mobile Profile Image - Below Text */}
          <motion.div className="flex justify-center">
            <motion.img 
              src="/profile_Josh_edit.PNG" 
              alt="Joshua Greco Profile" 
              className="w-48 h-48 object-cover rounded-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </div>

        {/* Desktop Layout - Grid */}
        <motion.div 
          className="hidden md:grid w-full h-full items-center p-8 lg:p-12 relative z-10"
          style={{ gridTemplateColumns }}
        >
          {/* Left Side - Decorative Elements */}
          <motion.div 
            className="flex justify-center items-center relative"
            style={{ scale: profileScale }}
          >
            {/* Colored Background Elements - keeping for visual interest */}
            <div className="absolute w-48 h-48 bg-blue-400 rounded-full opacity-15 -top-10 -left-10 z-5"></div>
            <div className="absolute w-32 h-32 bg-purple-500 rounded-full opacity-10 -bottom-5 -left-20 z-5"></div>
            <div className="absolute w-24 h-24 bg-pink-400 rounded-full opacity-15 bottom-10 right-20 z-5"></div>
          </motion.div>
          
          {/* Right Side - Text Content */}
          <motion.div 
            className="flex flex-col justify-center text-left ml-4 lg:ml-8"
            style={{ scale: nameScale }}
          >
            <div className="bg-purple-700/80 p-6 lg:p-8 rounded-2xl backdrop-blur-sm">
              <motion.h1 
                className="text-mint-green mb-3 font-membra"
                style={{ 
                  color: 'rgb(200, 255, 230)',
                  textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
                  fontWeight: 'normal',
                  fontSize: 'clamp(2.9rem, 6.5vw, 6.5rem)'
                }}
              >
                JOSH GRECO
              </motion.h1>
              
              <div className="flex flex-col items-start space-y-1">
                <motion.h2 className="text-xl lg:text-2xl text-white font-light">
                  Systems Engineer.
                </motion.h2>
                <motion.h2 className="text-xl lg:text-2xl text-white font-light ml-16">
                  Solutions Consultant.
                </motion.h2>
                <motion.h2 className="text-xl lg:text-2xl text-white font-light ml-32">
                  AI Integration Specialist.
                </motion.h2>
              </div>
            </div>
            
            <motion.div 
              className="mt-6 lg:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a 
                href="https://calendly.com/greco-joshua"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Contact Me
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
        </div>
      </motion.div>
      
    </section>
  );
};

export default HeroSection; 