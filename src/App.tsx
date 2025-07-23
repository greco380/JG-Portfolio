import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import CustomCalendly from './components/CustomCalendly';

function App() {
  return (
    <Router>
      <div className="App bg-primary text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <CustomCalendly />
      </div>
    </Router>
  );
}

export default App;
