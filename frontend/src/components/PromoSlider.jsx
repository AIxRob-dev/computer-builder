import { useEffect, useRef } from 'react';
import { Zap, ShieldCheck, Truck, Award } from 'lucide-react';

const PromoSlider = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId;
    let position = 0;
    const speed = 0.3; // Smooth and steady speed

    const animate = () => {
      position -= speed;
      
      // Reset position when first set of items scrolls out
      if (Math.abs(position) >= slider.scrollWidth / 2) {
        position = 0;
      }
      
      slider.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const promoItems = [
    { 
      text: "FREE SHIPPING ON ALL PCs", 
      icon: Truck,
      highlight: false, 
      accent: "blue" 
    },
    { 
      text: "FLASH SALE - 15% OFF CUSTOM BUILDS", 
      icon: Zap,
      highlight: true, 
      accent: "blue" 
    },
    { 
      text: "1 YEAR WARRANTY • ALL COMPONENTS", 
      icon: ShieldCheck,
      highlight: false, 
      accent: "blue" 
    },
    { 
      text: "PREMIUM QUALITY • VERIFIED BUILDS", 
      icon: Award,
      highlight: false, 
      accent: "blue" 
    },
  ];
  
  // Create enough duplicates to fill the screen completely
  const duplicatedItems = Array(20).fill(promoItems).flat();

 return (
    <div className="w-full bg-blue-600 overflow-hidden py-2 sm:py-2.5 relative">
      <div 
        ref={sliderRef}
        className="flex items-center whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        {duplicatedItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex items-center gap-2 sm:gap-2.5 shrink-0 mr-8 sm:mr-12 lg:mr-16">
              <IconComponent className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90' strokeWidth={2.5} />
              <span 
                className={`text-xs sm:text-sm font-bold tracking-wide ${
                  item.highlight 
                    ? 'text-yellow-300' 
                    : 'text-white'
                }`}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromoSlider;