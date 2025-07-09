import React, { useState, useEffect, useRef } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  image: string;
  description: string;
}

interface Point {
  x: number;
  y: number;
  z: number;
  char: string;
  color: string;
  lat: number;
  lon: number;
}

const HolographicGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [globeReady, setGlobeReady] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayMode, setDisplayMode] = useState<'vector' | 'full' | 'squish'>('vector');

  // Globe state
  const [rotation, setRotation] = useState({
    autoRotation: 0,
    manualRotationX: 0,
    manualRotationY: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  // Pre-loaded land polygons (embedded data for instant rendering)
  const landPolygons = [
    [[-17.3, 14.8], [-5.5, 15.5], [10.5, 13.0], [14.5, 12.5], [18.5, 4.5], [20.5, -4.5], [18.0, -18.0], [20.0, -34.8], [18.5, -34.0], [12.5, -17.0], [11.5, -4.0], [8.5, 4.5], [8.0, 12.0], [-4.5, 11.0], [-12.0, 10.0], [-17.3, 14.8]],
    [[-9.5, 43.5], [-9.0, 38.5], [-5.5, 36.0], [0.0, 38.5], [3.0, 42.5], [7.5, 44.0], [10.0, 46.5], [16.0, 45.5], [20.0, 45.0], [29.0, 45.5], [30.0, 52.0], [30.0, 59.5], [24.0, 65.0], [25.5, 71.0], [15.0, 68.0], [12.0, 65.0], [5.0, 58.5], [-1.0, 50.5], [-5.5, 48.5], [-9.5, 43.5]],
    [[30.0, 52.0], [40.0, 48.0], [50.0, 45.0], [67.0, 45.0], [75.0, 36.0], [80.0, 28.0], [85.0, 27.0], [92.0, 25.0], [95.0, 21.0], [98.0, 16.0], [102.0, 14.0], [109.0, 18.0], [115.0, 22.0], [122.0, 30.0], [122.0, 40.0], [135.0, 45.0], [142.0, 50.0], [142.0, 60.0], [162.0, 66.0], [180.0, 68.0], [180.0, 71.0], [140.0, 73.0], [100.0, 77.0], [60.0, 70.0], [30.0, 69.0], [30.0, 59.5], [30.0, 52.0]],
    [[-168.0, 65.5], [-165.0, 60.0], [-153.0, 57.0], [-130.0, 54.5], [-125.0, 48.5], [-95.0, 49.0], [-80.0, 45.0], [-70.0, 45.0], [-60.0, 47.0], [-56.0, 51.0], [-56.0, 58.5], [-62.0, 60.0], [-78.0, 62.0], [-75.0, 68.0], [-85.0, 70.0], [-95.0, 72.0], [-105.0, 73.0], [-115.0, 74.0], [-125.0, 71.0], [-135.0, 69.0], [-155.0, 71.0], [-168.0, 65.5]],
    [[-125.0, 48.5], [-117.0, 32.5], [-110.0, 23.5], [-97.0, 15.5], [-83.0, 8.5], [-77.0, 7.5], [-81.0, 11.0], [-87.0, 13.0], [-87.5, 17.5], [-91.0, 18.0], [-97.0, 26.0], [-110.0, 31.0], [-114.0, 32.5], [-117.0, 32.5]],
    [[-81.0, 11.0], [-77.0, 7.5], [-73.5, 11.0], [-64.0, 10.5], [-50.0, 0.0], [-35.0, -8.0], [-35.0, -23.0], [-40.0, -23.0], [-48.0, -28.0], [-53.0, -34.0], [-58.0, -34.5], [-62.0, -40.0], [-65.0, -42.0], [-71.0, -45.0], [-72.0, -50.0], [-69.0, -52.0], [-68.5, -54.5], [-66.0, -55.0], [-71.0, -56.0], [-75.0, -52.0], [-74.0, -45.0], [-72.0, -18.0], [-70.0, -18.0], [-69.0, -10.0], [-73.0, -5.0], [-78.0, -2.5], [-80.0, 0.0], [-79.0, 2.0], [-77.0, 4.0], [-81.0, 11.0]],
    [[113.5, -22.0], [113.5, -35.0], [115.0, -35.0], [129.0, -32.0], [134.0, -32.0], [138.0, -35.0], [141.0, -38.0], [147.0, -38.0], [150.0, -37.0], [153.0, -28.0], [153.5, -25.0], [150.0, -22.0], [145.0, -15.0], [142.0, -11.0], [135.0, -12.0], [131.0, -12.0], [125.0, -14.0], [122.0, -17.0], [113.5, -22.0]],
    [[-180.0, -64.0], [-180.0, -85.0], [180.0, -85.0], [180.0, -64.0], [160.0, -70.0], [90.0, -66.0], [0.0, -69.0], [-60.0, -63.0], [-180.0, -64.0]],
    [[-73.0, 78.0], [-58.0, 76.0], [-20.0, 70.0], [-18.0, 64.0], [-41.0, 60.0], [-45.0, 60.0], [-53.0, 66.0], [-58.0, 68.0], [-62.0, 72.0], [-67.0, 76.0], [-73.0, 78.0]],
    [[49.5, -12.0], [50.5, -15.5], [50.0, -25.5], [47.0, -25.0], [43.5, -21.0], [43.5, -16.0], [46.0, -13.0], [49.5, -12.0]],
    [[130.0, 31.0], [131.0, 34.0], [136.0, 35.5], [140.0, 36.0], [141.0, 39.0], [141.5, 42.0], [145.0, 44.0], [145.5, 43.0], [143.0, 41.0], [140.0, 41.0], [139.5, 35.0], [135.0, 34.0], [132.0, 33.0], [130.0, 31.0]],
    [[95.0, 5.5], [98.0, 3.0], [100.0, 0.5], [102.0, -1.0], [104.0, -2.5], [106.0, -6.0], [110.5, -7.0], [114.0, -7.5], [115.5, -8.5], [114.0, -8.5], [110.0, -8.0], [105.0, -6.5], [102.0, -4.0], [100.0, -2.0], [95.0, 2.0], [95.0, 5.5]],
    [[141.0, -2.5], [150.0, -6.0], [155.0, -7.0], [155.5, -10.0], [147.0, -10.0], [143.0, -8.0], [141.0, -8.0], [141.0, -2.5]],
    [[173.0, -35.0], [175.0, -37.0], [178.0, -38.0], [177.0, -39.5], [176.0, -41.0], [174.5, -41.5], [172.5, -43.5], [171.0, -44.5], [168.0, -46.5], [166.5, -46.0], [166.5, -45.0], [170.0, -42.0], [172.0, -40.5], [173.0, -35.0]],
    [[-5.0, 50.0], [-3.0, 53.0], [-1.0, 54.0], [0.0, 53.0], [-2.0, 51.0], [-5.0, 50.0]],
    [[-8.0, 54.0], [-6.0, 55.0], [-5.5, 54.5], [-6.0, 53.0], [-8.0, 52.0], [-8.0, 54.0]]
  ];
  
  // Constants
  const tiltAngle = (23.5 * Math.PI) / 180;
  const autoRotationSpeed = (2 * Math.PI) / (120 * 30); // 120 seconds at 30 FPS

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

  // Data is now pre-loaded, no need for async loading

  // Initialize Web Worker and canvas
  useEffect(() => {
    if (!mountRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.style.cursor = 'grab';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(canvas);

    // Setup canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    const setupCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = mountRef.current!.clientWidth;
      const height = mountRef.current!.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const baseCharSize = Math.max(6, Math.min(10, Math.floor(Math.min(width, height) / 100))) * 8;
      const charHeight = baseCharSize;
      
      ctx.font = `bold ${charHeight}px 'Courier New', Monaco, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    };

    setupCanvas();

    // Initialize Web Worker
    try {
      workerRef.current = new Worker('/earthWorker.js');
      
      workerRef.current.onmessage = (event) => {
        const points: Point[] = event.data;
        renderPoints(points, ctx);
      };

      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
      };

      console.log('Web Worker initialized');
      setGlobeReady(true);

    } catch (error) {
      console.error('Failed to initialize Web Worker:', error);
    }

    // Setup interaction
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      // Use smaller sensitivity for smoother interaction
      setRotation(prev => ({
        ...prev,
        manualRotationY: prev.manualRotationY + deltaX * 0.005,
        manualRotationX: prev.manualRotationX + deltaY * 0.005
      }));
      
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      canvas.style.cursor = 'grab';
    };

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        setIsDragging(true);
        setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDragging || e.touches.length !== 1) return;
      
      const deltaX = e.touches[0].clientX - lastMousePos.x;
      const deltaY = e.touches[0].clientY - lastMousePos.y;
      
      // Use smaller sensitivity for smoother touch interaction
      setRotation(prev => ({
        ...prev,
        manualRotationY: prev.manualRotationY + deltaX * 0.005,
        manualRotationX: prev.manualRotationX + deltaY * 0.005
      }));
      
      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    const handleResize = () => {
      setupCanvas();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, lastMousePos]);

  // Animation loop
  useEffect(() => {
    if (!globeReady || !workerRef.current) return;

    let lastFrameTime = 0;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      
      // Throttle to 30 FPS or when dragging
      const needsRender = deltaTime >= 33 || isDragging;

      if (needsRender) {
        // Update auto rotation - simple frame-based increment
        setRotation(prev => ({
          ...prev,
          autoRotation: prev.autoRotation + autoRotationSpeed
        }));

        // Send data to worker using callback to get latest state
        setRotation(currentRotation => {
          workerRef.current!.postMessage({
            rotationX: tiltAngle + currentRotation.manualRotationX,
            rotationY: currentRotation.autoRotation + currentRotation.manualRotationY,
            grid: null, // Not needed for this implementation
            landPolygons: landPolygons
          });
          return currentRotation; // Return unchanged state
        });

        lastFrameTime = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [globeReady, rotation, isDragging]);

  // Render points from worker
  const renderPoints = (points: Point[], ctx: CanvasRenderingContext2D) => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Clear canvas
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, width, height);

    // Calculate sphere radius and center
    const sphereRadius = Math.min(width, height) * 0.35;
    const centerX = width / 2;
    const centerY = height / 2;

    // Sort points by depth (back to front)
    points.sort((a, b) => a.z - b.z);

    // Render points
    points.forEach(point => {
      // Project to 2D
      const screenX = point.x * sphereRadius + centerX;
      const screenY = -point.y * sphereRadius + centerY;

      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        // Color based on terrain type
        const intensity = 0.6 + 0.4 * point.z;
        
        if (point.color === 'ice') {
          ctx.fillStyle = `rgba(200, 255, 255, ${intensity})`;
        } else if (point.color === 'land') {
          const r = Math.floor(0 * intensity);
          const g = Math.floor(200 * intensity);
          const b = Math.floor(100 * intensity);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        } else {
          const r = Math.floor(0 * intensity);
          const g = Math.floor(100 * intensity);
          const b = Math.floor(255 * intensity);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        }

        ctx.fillText(point.char, screenX, screenY);
      }
    });

    // Add atmospheric glow effect
    const gradient = ctx.createRadialGradient(
      centerX, centerY, sphereRadius * 0.8,
      centerX, centerY, sphereRadius * 1.2
    );
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0)');
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  // Auto-cycle through images
  useEffect(() => {
    if (!globeReady) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % locationEntries.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [globeReady, locationEntries.length]);

  const currentLocation = locationEntries[currentImageIndex];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      {/* Main Globe Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

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
          🖱️ Drag to rotate • 📱 Touch to spin
        </p>
        <p className="text-gray-400 text-xs">
          Real geography • 30 FPS optimized
        </p>
      </div>
    </div>
  );
};

export default HolographicGlobe; 