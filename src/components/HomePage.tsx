import React from 'react';
import HeroSection from './HeroSection';
import MissionSection from './MissionSection';
import WhatIDoSection from './WhatIDoSection';
import ProjectsSection from './ProjectsSection';
import PhilosophySection from './PhilosophySection';
import NextSection from './NextSection';
import Footer from './Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <PhilosophySection />
      <WhatIDoSection />
      {/* <HolographicGlobe /> */}
      <ProjectsSection />
      <NextSection />
      <Footer />
    </>
  );
};

export default HomePage;