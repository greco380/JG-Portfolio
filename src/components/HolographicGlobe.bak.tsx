import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LocationData {
  lat: number;
  lng: number;
  images: string[];
}

interface NewLocationData {
  name: string;
  lat: string;
  lng: string;
  image: File | null;
}

const HolographicGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageTransform, setImageTransform] = useState<'vector' | 'full' | 'squish'>('vector');
  const [devMode, setDevMode] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddImages, setShowAddImages] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);

  // Sample data structure
  const [locations, setLocations] = useState<Record<string, LocationData>>({
    'Japan': { lat: 36.2048, lng: 138.2529, images: ['tokyo-sample.jpg'] },
    'France': { lat: 46.2276, lng: 2.2137, images: ['paris-sample.jpg'] },
    'Brazil': { lat: -14.2350, lng: -51.9253, images: ['rio-sample.jpg'] },
    'Australia': { lat: -25.2744, lng: 133.7751, images: ['sydney-sample.jpg'] },
    'USA': { lat: 39.8283, lng: -98.5795, images: ['nyc-sample.jpg'] }
  });

  const [newLocation, setNewLocation] = useState<NewLocationData>({
    name: '',
    lat: '',
    lng: '',
    image: null
  });

  const [selectedLocation, setSelectedLocation] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);

  // Three.js globe creation
  useEffect(() => {
    const createThreeJSGlobe = () => {
      if (!mountRef.current) return;
      
      // Clear existing content
      mountRef.current.innerHTML = '';
      
      try {
        // Basic scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          60, 
          mountRef.current.clientWidth / mountRef.current.clientHeight, 
          0.1, 
          1000
        );
        
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        });
        
        // Set size
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Add to DOM
        mountRef.current.appendChild(renderer.domElement);
        
        // #####################
        // |
        // | GLOBE TILT IMPLEMENTATION
        // |
        // #######################
        // Create a group for the entire globe system (for axial tilt)
        const globeGroup = new THREE.Group();
        
        // Apply Earth's axial tilt (23.5 degrees)
        globeGroup.rotation.z = 23.5 * (Math.PI / 180);
        
        // Create sphere geometry
        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        
        // #####################
        // |
        // | LANDMASSES AND SEAS IMPLEMENTATION
        // |
        // #######################
        // Water material (darker blue/purple)
        const waterMaterial = new THREE.MeshBasicMaterial({
          color: 0x1a1a2e,
          transparent: true,
          opacity: 0.5
        });
        
        // Land material (lighter purple/blue)
        const landMaterial = new THREE.MeshBasicMaterial({
          color: 0x4A3A8C,
          transparent: true,
          opacity: 0.7
        });
        
        // Wireframe material
        const wireframeMaterial = new THREE.MeshBasicMaterial({
          color: 0x6F3EE2,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        
        // Create water sphere (base)
        const waterGlobe = new THREE.Mesh(sphereGeometry.clone(), waterMaterial);
        
        // #####################
        // |
        // | LANDMASSES AND SEAS IMPLEMENTATION (CONTINUED)
        // |
        // #######################
        // Create stylized continent shapes
        const createContinent = (lat: number, lng: number, width: number, height: number) => {
          const shape = new THREE.Shape();
          
          // Create an organic-looking shape
          const points: THREE.Vector2[] = [];
          const segments = 8;
          for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const radiusX = width * (0.8 + Math.random() * 0.4);
            const radiusY = height * (0.8 + Math.random() * 0.4);
            points.push(new THREE.Vector2(
              Math.cos(angle) * radiusX,
              Math.sin(angle) * radiusY
            ));
          }
          
          shape.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            shape.lineTo(points[i].x, points[i].y);
          }
          
          const geometry = new THREE.ShapeGeometry(shape);
          const continent = new THREE.Mesh(geometry, landMaterial);
          
          // Position on sphere surface
          const latRad = lat * (Math.PI / 180);
          const lngRad = lng * (Math.PI / 180);
          const radius = 2.01; // Slightly above sphere surface
          
          continent.position.x = radius * Math.cos(latRad) * Math.cos(lngRad);
          continent.position.y = radius * Math.sin(latRad);
          continent.position.z = radius * Math.cos(latRad) * Math.sin(lngRad);
          
          // Orient the continent to face outward
          continent.lookAt(continent.position.x * 2, continent.position.y * 2, continent.position.z * 2);
          
          return continent;
        };
        
        // Add stylized continents (simplified representation)
        const continents = [
          // North America
          createContinent(45, -100, 0.8, 0.6),
          // South America
          createContinent(-15, -60, 0.5, 0.8),
          // Europe
          createContinent(50, 10, 0.4, 0.4),
          // Africa
          createContinent(0, 20, 0.6, 0.9),
          // Asia
          createContinent(30, 90, 1.0, 0.7),
          // Australia
          createContinent(-25, 135, 0.5, 0.4),
        ];
        
        // Create wireframe globe
        const wireframeGlobe = new THREE.Mesh(sphereGeometry, wireframeMaterial);
        
        // #####################
        // |
        // | GLOBE TILT IMPLEMENTATION (CONTINUED)
        // |
        // #######################
        // Add everything to the globe group
        globeGroup.add(waterGlobe);
        continents.forEach(continent => globeGroup.add(continent));
        globeGroup.add(wireframeGlobe);
        
        // Add the globe group to the scene
        scene.add(globeGroup);
        
        // Add location markers
        const markerGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x2871B8,
          transparent: true,
          opacity: 0.9
        });
        
        const markers: THREE.Mesh[] = [];
        Object.entries(locations).forEach(([country, data]) => {
          const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
          
          // Convert lat/lng to 3D coordinates
          const lat = data.lat * (Math.PI / 180);
          const lng = data.lng * (Math.PI / 180);
          const radius = 2.1;
          
          marker.position.x = radius * Math.cos(lat) * Math.cos(lng);
          marker.position.y = radius * Math.sin(lat);
          marker.position.z = radius * Math.cos(lat) * Math.sin(lng);
          
          marker.userData = { country, data };
          globeGroup.add(marker);
          markers.push(marker);
        });
        
        // Position camera
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        
        // Animation variables
        let rotationY = 0;
        const rotationSpeed = 0.008;
        
        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          
          rotationY += rotationSpeed;
          
          // Rotate the entire globe group (includes water, continents, wireframe, and markers)
          globeGroup.rotation.y = rotationY;
          
          renderer.render(scene, camera);
        };
        
        animate();
        setGlobeReady(true);
        
        // Handle resize
        const handleResize = () => {
          if (!mountRef.current) return;
          
          const newWidth = mountRef.current.clientWidth;
          const newHeight = mountRef.current.clientHeight;
          
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Store cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          renderer.dispose();
          sphereGeometry.dispose();
          wireframeMaterial.dispose();
          waterMaterial.dispose();
          landMaterial.dispose();
          markerGeometry.dispose();
          // Dispose continent geometries
          continents.forEach(continent => {
            if (continent.geometry) continent.geometry.dispose();
          });
          if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
          }
        };
        
      } catch (error) {
        console.error('Three.js failed to load:', error);
        // Fallback to a better CSS sphere
        createFallbackSphere();
      }
    };
    
    const createFallbackSphere = () => {
      if (!mountRef.current) return;
      
      mountRef.current.innerHTML = '';
      
      const sphereContainer = document.createElement('div');
      sphereContainer.style.cssText = `
        width: 300px;
        height: 300px;
        margin: 50px auto;
        position: relative;
        transform-style: preserve-3d;
        animation: rotateSphere 8s linear infinite;
      `;
      
      // Create multiple circular layers to simulate a 3D sphere
      for (let i = 0; i < 20; i++) {
        const ring = document.createElement('div');
        const angle = (i * 9) - 90; // -90 to 90 degrees
        const scale = Math.cos(angle * Math.PI / 180);
        const translateZ = Math.sin(angle * Math.PI / 180) * 150;
        
        ring.style.cssText = `
          position: absolute;
          width: 300px;
          height: 300px;
          border: 1px solid rgba(111, 62, 226, ${0.3 + scale * 0.5});
          border-radius: 50%;
          transform: rotateX(${angle}deg) translateZ(${translateZ}px) scale(${scale});
          left: 0;
          top: 0;
        `;
        
        sphereContainer.appendChild(ring);
      }
      
      // Add vertical rings
      for (let i = 0; i < 12; i++) {
        const ring = document.createElement('div');
        const rotateY = i * 30; // 360/12 = 30 degrees
        
        ring.style.cssText = `
          position: absolute;
          width: 300px;
          height: 300px;
          border: 1px solid rgba(111, 62, 226, 0.4);
          border-radius: 50%;
          transform: rotateY(${rotateY}deg) rotateX(90deg);
          left: 0;
          top: 0;
        `;
        
        sphereContainer.appendChild(ring);
      }
      
      // Add markers
      Object.entries(locations).forEach(([country, data], index) => {
        const marker = document.createElement('div');
        marker.style.cssText = `
          position: absolute;
          width: 8px;
          height: 8px;
          background: #2871B8;
          border-radius: 50%;
          box-shadow: 0 0 10px #2871B8;
          left: ${145 + Math.cos(index * 72 * Math.PI / 180) * 120}px;
          top: ${145 + Math.sin(index * 72 * Math.PI / 180) * 120}px;
          z-index: 10;
        `;
        sphereContainer.appendChild(marker);
      });
      
      // Add CSS for sphere animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes rotateSphere {
          from { transform: rotateY(0deg) rotateX(15deg); }
          to { transform: rotateY(360deg) rotateX(15deg); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delayed {
          0%, 30% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 0.8; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1.5s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
      
      mountRef.current.appendChild(sphereContainer);
      setGlobeReady(true);
    };

    createThreeJSGlobe();
  }, [locations]);

  // Image cycling effect
  useEffect(() => {
    if (!globeReady) return;
    
    const imageKeys = Object.keys(locations);
    let currentIndex = 0;

    const cycleImages = () => {
      if (imageKeys.length === 0) return;
      
      setCurrentImage(imageKeys[currentIndex]);
      setImageTransform('vector');
      
      // Transform to full image (slower transition)
      setTimeout(() => setImageTransform('full'), 1000);
      
      // Hold full image for much longer (stay full for 9 seconds)
      setTimeout(() => setImageTransform('squish'), 10000);
      
      // Clear and move to next (total sequence: 12 seconds)
      setTimeout(() => {
        setCurrentImage(null);
        currentIndex = (currentIndex + 1) % imageKeys.length;
      }, 12000);
    };

    // 20 second cycle: 12 seconds for photo sequence + 8 seconds delay between photos
    const interval = setInterval(cycleImages, 20000);
    
    // Start immediately
    setTimeout(cycleImages, 1000);

    return () => clearInterval(interval);
  }, [locations, globeReady]);

  const handleAddLocation = () => {
    if (newLocation.name && newLocation.lat && newLocation.lng) {
      setLocations(prev => ({
        ...prev,
        [newLocation.name]: {
          lat: parseFloat(newLocation.lat),
          lng: parseFloat(newLocation.lng),
          images: newLocation.image ? [newLocation.image.name] : []
        }
      }));
      
      setNewLocation({ name: '', lat: '', lng: '', image: null });
      setShowAddLocation(false);
    }
  };

  const handleAddImages = () => {
    if (selectedLocation && newImage && locations[selectedLocation]) {
      setLocations(prev => ({
        ...prev,
        [selectedLocation]: {
          ...prev[selectedLocation],
          images: [...(prev[selectedLocation]?.images || []), newImage.name]
        }
      }));
      
      setNewImage(null);
      setSelectedLocation('');
      setShowAddImages(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-900 to-black py-16 relative overflow-hidden">
      {/* Dev Mode Toggle */}
      {devMode && (
        <div className="absolute top-4 right-4 z-20 bg-gray-800 p-4 rounded-lg border border-purple-500 max-w-sm">
          <h3 className="text-white mb-4 font-bold">Developer Mode</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowAddLocation(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Add New Location
            </button>
            
            <button
              onClick={() => setShowAddImages(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Add More Images
            </button>
            
            <div className="text-sm text-gray-300">
              <p>Current Locations: {Object.keys(locations).length}</p>
              <p>Total Images: {Object.values(locations).reduce((acc, loc) => acc + loc.images.length, 0)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Dev Mode Button */}
      <button
        onClick={() => setDevMode(!devMode)}
        className="absolute top-4 left-4 z-20 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
      >
        {devMode ? 'Exit Dev Mode' : 'Dev Mode'}
      </button>

      {/* Add Location Modal */}
      {showAddLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-gray-800 p-6 rounded-lg border border-purple-500 max-w-md w-full mx-4">
            <h3 className="text-white text-xl mb-4">Add New Location</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Country/Location Name"
                value={newLocation.name}
                onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
              />
              
              <input
                type="number"
                placeholder="Latitude"
                value={newLocation.lat}
                onChange={(e) => setNewLocation(prev => ({ ...prev, lat: e.target.value }))}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                step="0.0001"
              />
              
              <input
                type="number"
                placeholder="Longitude"
                value={newLocation.lng}
                onChange={(e) => setNewLocation(prev => ({ ...prev, lng: e.target.value }))}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                step="0.0001"
              />
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewLocation(prev => ({ 
                  ...prev, 
                  image: e.target.files && e.target.files.length > 0 ? e.target.files[0] : null 
                }))}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddLocation}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Add Location
                </button>
                <button
                  onClick={() => setShowAddLocation(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Images Modal */}
      {showAddImages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-gray-800 p-6 rounded-lg border border-purple-500 max-w-md w-full mx-4">
            <h3 className="text-white text-xl mb-4">Add More Images</h3>
            
            <div className="space-y-4">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
              >
                <option value="">Select Location</option>
                {Object.keys(locations).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(
                  e.target.files && e.target.files.length > 0 ? e.target.files[0] : null
                )}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddImages}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Add Image
                </button>
                <button
                  onClick={() => setShowAddImages(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="text-center mt-8 text-white max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Interactive Travel Globe
        </h2>
        
        {/* Main Globe Container - moved here to replace the descriptive text */}
        <div className="relative h-[600px] w-full max-w-4xl mx-auto mb-6">
          <div ref={mountRef} className="w-full h-full border border-purple-500 border-opacity-30 rounded-lg" />
          
          {/* Image Display Overlay */}
          {currentImage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className={`
                  transition-all duration-1000 ease-in-out transform
                  ${imageTransform === 'vector' ? 'w-32 h-32 opacity-30 scale-90' : ''}
                  ${imageTransform === 'full' ? 'w-80 h-80 opacity-100 scale-100' : ''}
                  ${imageTransform === 'squish' ? 'w-80 h-8 opacity-60 scale-x-100 scale-y-0' : ''}
                `}
                style={{
                  transition: 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transformOrigin: 'center center'
                }}
              >
                <div 
                  className={`
                    w-full h-full rounded-lg overflow-hidden relative
                    transition-all duration-1000 ease-in-out
                    ${imageTransform === 'full' ? 'ring-4 ring-purple-400 ring-opacity-50 shadow-2xl shadow-purple-500/30' : ''}
                  `}
                  style={{
                    background: imageTransform === 'vector' 
                      ? 'linear-gradient(45deg, #2871B8, #6F3EE2)' 
                      : `linear-gradient(45deg, #${Math.random().toString(16).substr(-6)}, #${Math.random().toString(16).substr(-6)})`,
                    filter: imageTransform === 'vector' ? 'blur(3px) brightness(0.7)' : 'blur(0px) brightness(1)',
                    transition: 'filter 1.5s ease-in-out, background 1.5s ease-in-out'
                  }}
                >
                  {imageTransform === 'full' && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-1000 ease-in-out">
                      <div className="text-white text-center transform transition-transform duration-1000 ease-out">
                        <div className="text-2xl font-bold mb-2 animate-fade-in">{currentImage}</div>
                        <div className="text-sm opacity-80 animate-fade-in-delayed">Sample Image Location</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-gray-300 mb-6">
          Watch as the holographic globe rotates, revealing images from locations I've visited. 
          Each image transforms from a low-poly style into full resolution before seamlessly returning to the globe.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          {Object.entries(locations).map(([country, data]) => (
            <div key={country} className="bg-gray-800 bg-opacity-50 p-3 rounded border border-gray-600">
              <div className="font-semibold text-blue-400">{country}</div>
              <div className="text-gray-400">{data.images.length} images</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolographicGlobe; 