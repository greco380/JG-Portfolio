import React, { useEffect, useRef, useState } from 'react';

interface CustomCalendlyProps {
  url?: string;
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: {
        url: string;
        prefill?: any;
        utm?: any;
      }) => void;
      closePopupWidget: () => void;
    };
  }
}

const CustomCalendly: React.FC<CustomCalendlyProps> = ({
  url = "https://calendly.com/greco-joshua"
}) => {
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout>();

  // Load Calendly assets
  useEffect(() => {
    console.log('Loading Calendly assets...');
    
    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(cssLink);

    // Load JavaScript
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      console.log('Calendly script loaded successfully!');
      setIsCalendlyLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Calendly script');
    };
    
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (document.head.contains(cssLink)) {
        document.head.removeChild(cssLink);
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Set up event listeners for Contact Me buttons
  useEffect(() => {
    const setupEventListeners = () => {
      console.log('Setting up Contact Me button listeners...');
      
      // Find all Contact Me buttons
      const contactButtons = document.querySelectorAll('a[href*="calendly.com"]');
      
      contactButtons.forEach((button) => {
        const handleClick = (e: Event) => {
          e.preventDefault();
          console.log('Contact button clicked!');
          openCalendly();
        };

        const handleMouseEnter = () => {
          console.log('Hover started - setting 10 second timer');
          hoverTimerRef.current = setTimeout(() => {
            console.log('10 second hover completed - opening Calendly directly');
            openCalendly();
          }, 10000); // 10 seconds
        };

        const handleMouseLeave = () => {
          if (hoverTimerRef.current) {
            console.log('Hover ended - clearing timer');
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = undefined;
          }
        };

        button.addEventListener('click', handleClick);
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        // Store cleanup functions
        (button as any)._calendlyCleanup = () => {
          button.removeEventListener('click', handleClick);
          button.removeEventListener('mouseenter', handleMouseEnter);
          button.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    };

    // Set up listeners after a brief delay to ensure DOM is ready
    const timer = setTimeout(setupEventListeners, 100);
    
    return () => {
      clearTimeout(timer);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      
      // Cleanup button listeners
      const contactButtons = document.querySelectorAll('a[href*="calendly.com"]');
      contactButtons.forEach((button) => {
        if ((button as any)._calendlyCleanup) {
          (button as any)._calendlyCleanup();
        }
      });
    };
  }, [isCalendlyLoaded]);

  // ESC key handler for closing Calendly
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('ESC key pressed - closing Calendly');
        if (window.Calendly && window.Calendly.closePopupWidget) {
          window.Calendly.closePopupWidget();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const openCalendly = () => {
    console.log('Opening Calendly...', { isCalendlyLoaded, hasCalendly: !!window.Calendly });
    
    if (!isCalendlyLoaded || !window.Calendly) {
      console.warn('Calendly not loaded - using fallback (new window)');
      window.open(url, '_blank', 'width=800,height=600');
      return;
    }

    try {
      // Add custom styles for the popup
      injectCustomStyles();
      
      // Initialize Calendly popup widget
      window.Calendly.initPopupWidget({
        url: url,
        prefill: {},
        utm: {}
      });
      console.log('Calendly popup initiated successfully!');
    } catch (error) {
      console.error('Error opening Calendly:', error);
      // Fallback: open in new window
      window.open(url, '_blank', 'width=800,height=600');
    }
  };

  const injectCustomStyles = () => {
    // Remove existing custom styles
    const existingStyle = document.getElementById('custom-calendly-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add custom styles
    const style = document.createElement('style');
    style.id = 'custom-calendly-styles';
    style.textContent = `
      .calendly-overlay {
        background: rgba(15, 23, 42, 0.8) !important;
        backdrop-filter: blur(10px) !important;
        padding: 20px !important;
      }
      
      .calendly-popup {
        border-radius: 20px !important;
        overflow: hidden !important;
        box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.4) !important;
        border: 2px solid rgba(147, 51, 234, 0.3) !important;
        background: #0f172a !important;
        width: 90vw !important;
        max-width: 700px !important;
        height: 90vh !important;
        max-height: 750px !important;
        margin: auto !important;
      }
      
      .calendly-popup-content {
        border-radius: 20px !important;
        background: #0f172a !important;
        height: 100% !important;
      }
      
      .calendly-popup iframe {
        border-radius: 20px !important;
        background: #0f172a !important;
      }
      
      .calendly-popup .calendly-popup-close {
        background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%) !important;
        border-radius: 50% !important;
        border: 2px solid rgba(255, 255, 255, 0.2) !important;
        color: white !important;
        width: 40px !important;
        height: 40px !important;
        font-size: 20px !important;
        font-weight: bold !important;
        top: 15px !important;
        right: 15px !important;
      }
      
      /* Style the Calendly content inside iframe */
      .calendly-inline-widget,
      .calendly-popup-content .calendly-inline-widget {
        background: #0f172a !important;
        border-radius: 20px !important;
      }
      
      /* Remove white background from Calendly */
      [data-calendly-wrapper] {
        background: #0f172a !important;
      }
    `;
    document.head.appendChild(style);
  };

  return null; // No visible UI - component only handles functionality
};

export default CustomCalendly;