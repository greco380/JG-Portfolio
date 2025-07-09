import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import WhatIDoSection from './components/WhatIDoSection';
import TimelineSection from './components/TimelineSection';
import ProjectsSection from './components/ProjectsSection';
import PhilosophySection from './components/PhilosophySection';
import NextSection from './components/NextSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App bg-primary text-white">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <WhatIDoSection />
      <TimelineSection />
      <ProjectsSection />
      <PhilosophySection />
      <NextSection />
      <Footer />
    </div>
  );
}

export default App;
