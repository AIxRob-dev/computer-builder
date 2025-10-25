import { useState, useEffect, useCallback, useRef } from "react";
import { ShoppingBag, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gta6Image from "/GTA6.png";
import rdr2Image from "/rdr2.jpg";
import classicImage from "/Classic-product.png";

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayTimeoutRef = useRef(null);
    const navigate = useNavigate();

    const slides = [
        {
            title: "New Collection",
            subtitle: "Discover the Latest Trends",
            description: "Elevate your style with our premium collection",
            buttonText: "Shop Now",
            buttonLink: "/category/GTA-Series",
            gradient: "from-black/50 via-zinc-900/30 to-black/50",
            image: gta6Image,
            icon: ShoppingBag
        },
        {
            title: "Premium Quality",
            subtitle: "Crafted for Excellence",
            description: "Experience unmatched quality and comfort",
            buttonText: "Explore",
            buttonLink: "/category/Maths",
            gradient: "from-zinc-900/40 via-black/30 to-zinc-900/50",
            image: rdr2Image,
            icon: TrendingUp
        },
        {
            title: "Exclusive Deals",
            subtitle: "Limited Time Offers",
            description: "Don't miss out on our special promotions",
            buttonText: "View Deals",
            buttonLink: "/category/RDR2",
            gradient: "from-black/50 via-zinc-900/30 to-black/40",
            image: classicImage,
            icon: Sparkles
        }
    ];

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        };
    }, []);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, slides.length]);

    const resumeAutoPlay = useCallback(() => {
        if (autoPlayTimeoutRef.current) {
            clearTimeout(autoPlayTimeoutRef.current);
        }
        autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 3000);
    }, []);

    // Touch handlers for mobile swipe
    const handleTouchStart = useCallback((e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setIsAutoPlaying(false);
    }, []);

    const handleTouchMove = useCallback((e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }
        if (isRightSwipe) {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        }

        setTouchStart(0);
        setTouchEnd(0);
        resumeAutoPlay();
    }, [touchStart, touchEnd, slides.length, resumeAutoPlay]);

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [resumeAutoPlay]);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [slides.length, resumeAutoPlay]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [slides.length, resumeAutoPlay]);

    const handleButtonClick = useCallback((link) => {
        navigate(link);
    }, [navigate]);

    return (
        <div 
            className='relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Slides */}
            {slides.map((slide, index) => {
                const IconComponent = slide.icon;
                const isActive = index === currentSlide;
                
                return (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        {/* Background Image with optimized loading */}
                        <div 
                            className='absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform'
                            style={{ 
                                backgroundImage: `url(${slide.image})`,
                                transform: isActive ? 'scale(1)' : 'scale(1.05)',
                                transition: 'transform 700ms ease-out'
                            }}
                            role="img"
                            aria-label={`${slide.title} background`}
                        />
                        
                        {/* Premium Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} backdrop-blur-[1px]`} />
                        
                        {/* Content - More Compact */}
                        <div className='relative w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8'>
                            <div className='max-w-3xl lg:max-w-4xl mx-auto text-center'>
                                <div className={`space-y-2 sm:space-y-3 lg:space-y-5 transition-all duration-700 ${
                                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                }`}>
                                    {/* Minimalist Icon - Smaller */}
                                    <div className='flex justify-center mb-1.5 sm:mb-3'>
                                        <div className='p-1.5 sm:p-2 lg:p-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10'>
                                            <IconComponent className='w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white' strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    {/* Subtitle - Smaller */}
                                    <p className='text-zinc-400 text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.2em] font-light'>
                                        {slide.subtitle}
                                    </p>

                                    {/* Title - More Compact */}
                                    <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight tracking-tight px-2'>
                                        {slide.title}
                                    </h1>

                                    {/* Description - Smaller */}
                                    <p className='text-zinc-300 text-[11px] sm:text-xs lg:text-sm max-w-sm lg:max-w-lg mx-auto font-light leading-relaxed px-4'>
                                        {slide.description}
                                    </p>

                                    {/* Minimalist Premium Button - More Compact */}
                                    <div className='pt-2 sm:pt-3 lg:pt-5'>
                                        <button
                                            onClick={() => handleButtonClick(slide.buttonLink)}
                                            className='group relative bg-white text-black px-6 py-2 sm:px-8 sm:py-2.5 lg:px-10 lg:py-3 
                                            text-[10px] sm:text-xs lg:text-sm font-medium tracking-wide uppercase
                                            overflow-hidden border border-white
                                            hover:bg-zinc-900 hover:text-white hover:border-zinc-700
                                            transition-[background-color,color,border-color] duration-300
                                            will-change-transform active:scale-95'
                                        >
                                            <span className='relative z-10'>{slide.buttonText}</span>
                                            <div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 will-change-transform' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Arrows - Hidden on mobile */}
            <button
                onClick={prevSlide}
                className='hidden sm:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 
                w-9 h-9 lg:w-10 lg:h-10 items-center justify-center
                bg-white/5 backdrop-blur-md border border-white/10
                text-white hover:bg-white/10 transition-[background-color] duration-300
                group will-change-transform'
                aria-label='Previous slide'
            >
                <ChevronLeft className='w-4 h-4 lg:w-5 lg:h-5 group-hover:-translate-x-0.5 transition-transform will-change-transform' strokeWidth={1.5} />
            </button>
            
            <button
                onClick={nextSlide}
                className='hidden sm:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 
                w-9 h-9 lg:w-10 lg:h-10 items-center justify-center
                bg-white/5 backdrop-blur-md border border-white/10
                text-white hover:bg-white/10 transition-[background-color] duration-300
                group will-change-transform'
                aria-label='Next slide'
            >
                <ChevronRight className='w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-0.5 transition-transform will-change-transform' strokeWidth={1.5} />
            </button>

            {/* Minimalist Dots Indicator */}
            <div className='absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20'>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-[width,background-color] duration-300 will-change-[width] ${
                            index === currentSlide
                                ? 'w-7 sm:w-9 lg:w-11 h-0.5 sm:h-[3px] bg-white'
                                : 'w-5 sm:w-7 lg:w-9 h-0.5 sm:h-[3px] bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Swipe indicator for mobile */}
            <div className='sm:hidden absolute bottom-12 left-1/2 -translate-x-1/2 z-20'>
                <div className='flex items-center gap-1.5 text-white/40 text-[9px] uppercase tracking-widest'>
                    <div className='w-6 h-[1px] bg-white/20' />
                    <span>Swipe</span>
                    <div className='w-6 h-[1px] bg-white/20' />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
