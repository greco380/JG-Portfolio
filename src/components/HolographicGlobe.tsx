import React, { useState, useEffect, useRef } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  image: string;
  description: string;
}

interface GridPosition {
  x: number;
  y: number;
}

interface AsciiCell {
  char: string;
  isLand: boolean;
  lat: number;
  lng: number;
}

const HolographicGlobe: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayMode, setDisplayMode] = useState<'vector' | 'full' | 'squish'>('vector');
  const [rotationOffset, setRotationOffset] = useState(0);
  
  // Grid dimensions
  const GRID_WIDTH = 86;
  const GRID_HEIGHT = 52;
  
  // Coordinate mapping function
  const coordToGrid = (lat: number, lng: number, offset: number = 0): GridPosition => {
    // Apply longitude offset for rotation
    const adjustedLng = ((lng + offset) % 360 + 360) % 360;
    const normalizedLng = adjustedLng > 180 ? adjustedLng - 360 : adjustedLng;
    
    // Map coordinates to grid (lat: -90 to 90, lng: -180 to 180)
    const x = Math.floor(((normalizedLng + 180) / 360) * GRID_WIDTH);
    const y = Math.floor(((90 - lat) / 180) * GRID_HEIGHT);
    
    return { 
      x: Math.max(0, Math.min(GRID_WIDTH - 1, x)), 
      y: Math.max(0, Math.min(GRID_HEIGHT - 1, y)) 
    };
  };
  
  // Generate ASCII grid
  const generateAsciiGrid = (rotationOffset: number): AsciiCell[][] => {
    const grid: AsciiCell[][] = [];
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
      const row: AsciiCell[] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Convert grid position back to lat/lng
        const lng = ((x / GRID_WIDTH) * 360 - 180) - rotationOffset;
        const lat = 90 - ((y / GRID_HEIGHT) * 180);
        
        // Check if this position is within Earth bounds (simplified sphere)
        const earthRadius = 85; // Approximate Earth in grid units
        const centerX = GRID_WIDTH / 2;
        const centerY = GRID_HEIGHT / 2;
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow((y - centerY) * 1.5, 2)); // Adjust for aspect ratio
        const isWithinEarth = distance <= (earthRadius / 2);
        
        let char = '°';
        let isLand = false;
        
        if (!isWithinEarth) {
          // Space pattern outside Earth: alternating .*.*.* and *.*.*
          const patternA = (x + y) % 6 < 3;
          if (patternA) {
            char = ((x + y) % 2 === 0) ? '.' : '*';
          } else {
            char = ((x + y) % 2 === 0) ? '*' : '.';
          }
        } else {
          // For now, use placeholder logic for land detection
          isLand = Math.random() > 0.7; // Temporary placeholder - replace with polygon detection
          
          if (isLand) {
            char = '▓'; // Land
          } else {
            char = '°'; // Ocean
          }
        }
        
        row.push({ char, isLand, lat, lng });
      }
      grid.push(row);
    }
    
    return grid;
  };
  
  // Generate current grid
  const currentGrid = generateAsciiGrid(rotationOffset);

  // Sample locations data
  const locations: Record<string, LocationData> = {
    'New York': {
      lat: 40.7128,
      lng: -74.0060,
      image: '/api/placeholder/300/200',
      description: 'The city that never sleeps'
    },
    'London': {
      lat: 51.5074,
      lng: -0.1278,
      image: '/api/placeholder/300/200',
      description: 'Historic capital with modern innovation'
    },
    'Tokyo': {
      lat: 35.6762,
      lng: 139.6503,
      image: '/api/placeholder/300/200',
      description: 'Technology hub of the future'
    },
    'Sydney': {
      lat: -33.8688,
      lng: 151.2093,
      image: '/api/placeholder/300/200',
      description: 'Harbor city with stunning architecture'
    },
    'Paris': {
      lat: 48.8566,
      lng: 2.3522,
      image: '/api/placeholder/300/200',
      description: 'City of lights and romance'
    }
  };

  const locationEntries = Object.entries(locations);

  // Animation loop for rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationOffset(prev => (prev + 2) % 360); // Rotate 2 degrees per frame
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, []);

  // Auto-cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % locationEntries.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [locationEntries.length]);

  const currentLocation = locationEntries[currentImageIndex];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      {/* ASCII Globe Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="ascii-globe"
          style={{
            fontFamily: 'Courier New, Monaco, monospace',
            fontSize: '11px',
            lineHeight: '1.1',
            letterSpacing: '0',
            color: '#00ff88',
            textShadow: '0 0 2px #00ff88',
            whiteSpace: 'pre'
          }}
        >
          {currentGrid.map((row, y) => (
            <div key={y}>
              {row.map((cell, x) => (
                <span key={`${x}-${y}`} style={{
                  color: cell.isLand ? '#00ff88' : '#0099ff'
                }}>
                  {cell.char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Title Section */}
      <div className="absolute top-8 left-8 z-20 max-w-md">
        <h2 className="text-4xl font-bold text-white mb-4">
          Global Showcase
        </h2>
        <div className="text-green-400 text-sm font-mono">
          ASCII 3D Earth - Natural Earth Data
        </div>
      </div>

      {/* Image Overlay System */}
      {currentLocation && (
        <div className="absolute inset-0 pointer-events-none">
          {displayMode === 'vector' && (
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-80 h-60 border-2 border-green-400 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-blue-600/20" />
              <div className="relative p-6 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-2">{currentLocation[0]}</h3>
                <p className="text-gray-300 mb-4">{currentLocation[1].description}</p>
                <div className="text-green-400 text-sm">
                  {currentLocation[1].lat.toFixed(2)}°, {currentLocation[1].lng.toFixed(2)}°
                </div>
              </div>
            </div>
          )}

          {displayMode === 'full' && (
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-80 h-60 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={currentLocation[1].image}
                alt={currentLocation[0]}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = '/api/placeholder/300/200'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-1">{currentLocation[0]}</h3>
                <p className="text-gray-300 text-sm">{currentLocation[1].description}</p>
              </div>
            </div>
          )}

          {displayMode === 'squish' && (
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-80 h-32 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={currentLocation[1].image}
                alt={currentLocation[0]}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
                onError={(e) => { e.currentTarget.src = '/api/placeholder/300/200'; }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-xl font-bold text-white text-center">{currentLocation[0]}</h3>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-8 left-8 z-30 flex flex-col gap-4">
        {/* Display Mode Controls */}
        <div className="flex gap-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-2">
          {(['vector', 'full', 'squish'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDisplayMode(mode)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                displayMode === mode
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-3 gap-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 max-w-md">
          {locationEntries.map(([name], index) => (
            <button
              key={name}
              onClick={() => setCurrentImageIndex(index)}
              className={`p-2 rounded text-xs transition-colors ${
                index === currentImageIndex
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-30 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3">
        <p className="text-green-400 text-sm font-mono">
          🌍 ASCII Earth • Auto-rotating
        </p>
        <p className="text-gray-400 text-xs">
          86×52 grid • {Math.round(rotationOffset)}° rotation
        </p>
      </div>
    </div>
  );
};

export default HolographicGlobe; 