import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

interface SplashScreenProps {
  onFinish: () => void;
}

const CustomSplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only show splash screen on mobile devices
    if (!Capacitor.isNativePlatform()) {
      onFinish();
      return;
    }

    // Hide the native splash screen
    SplashScreen.hide();

    // Show custom splash screen for 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // Don't render anything on web
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="text-center">
        {/* Logo and App Name */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">SM</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Strategy AI</h1>
          <p className="text-white/80 text-lg">Social Media Strategy Generator</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Tagline */}
        <div className="mt-8">
          <p className="text-white/70 text-sm">Powered by AI • Designed for Growth</p>
        </div>
      </div>
    </div>
  );
};

export default CustomSplashScreen;