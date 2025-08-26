import React, { useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Rocket, Calendar, Globe, Telescope } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Autoplay prevented by browser policy');
      });
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source 
          src="https://videos.pexels.com/video-files/6962125/6962125-hd_1920_1080_24fps.mp4" 
          type="video/mp4" 
        />
        {/* Fallback poster */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/30 to-purple-900/50" />

      {/* Stars Animation */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center animate-fade-in">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-shimmer">
            WELCOME TO
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 hover:scale-105 transition-transform">
            PROJECT RACOONS
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            UNIVERSE 89PI3
          </h3>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6">
            <h4 className="text-2xl md:text-3xl font-bold text-blue-300 mb-2">
              PROJECT I — PROJECT SELENE
            </h4>
            <p className="text-xl text-gray-300 font-medium">
              Lifetime lunar intelligence — phases, eclipses, and precision ephemerides
            </p>
            <p className="text-sm text-gray-400 mt-2">
              NASA Organization • Internal Research Initiative
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 text-left hover:-translate-y-1 hover:scale-102 transition-transform">
            <Telescope className="text-blue-400 w-8 h-8 mb-3" />
            <h5 className="text-lg font-bold text-white mb-2">Lunar Analysis</h5>
            <p className="text-sm text-gray-300">
              Comprehensive moon phase calculations and illumination tracking
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 text-left hover:-translate-y-1 hover:scale-102 transition-transform">
            <Calendar className="text-purple-400 w-8 h-8 mb-3" />
            <h5 className="text-lg font-bold text-white mb-2">Eclipse Prediction</h5>
            <p className="text-sm text-gray-300">
              Precise solar and lunar eclipse forecasting with visualization
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 text-left hover:-translate-y-1 hover:scale-102 transition-transform">
            <Globe className="text-cyan-400 w-8 h-8 mb-3" />
            <h5 className="text-lg font-bold text-white mb-2">3D Visualization</h5>
            <p className="text-sm text-gray-300">
              Interactive 3D models and global tracking systems
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={onStart}
            size="lg"
            className="group relative overflow-hidden hover:scale-105 transition-transform"
          >
            <span className="relative flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Start Exploring
            </span>
          </Button>

          <Button variant="secondary" size="lg">
            Quick Ephemeris
          </Button>

          <Button variant="secondary" size="lg">
            Eclipse Finder
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-8 max-w-2xl">
          This research platform provides lifetime computational analysis of lunar mechanics, 
          eclipse prediction, and astronomical phenomena. Developed for scientific research 
          and educational purposes under NASA organizational guidelines.
        </p>
      </div>
    </div>
  );
}