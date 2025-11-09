import { useState, useEffect, useCallback, useRef, memo } from "react";
import { ChevronLeft, ChevronRight, Cpu, Zap, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Memoized Slide Component
const Slide = memo(({ slide, isActive, onButtonClick }) => {
    const IconComponent = slide.icon;
    
    return (
        <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div 
                className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                style={{ 
                    backgroundImage: `url(${slide.image})`,
                    transform: isActive ? 'scale(1)' : 'scale(1.05)',
                    transition: 'transform 700ms ease-out'
                }}
                role="img"
                aria-label={`${slide.title} background`}
            />
            
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} backdrop-blur-sm`} />
            
            <div className='relative w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto text-center'>
                    <div className={`space-y-4 sm:space-y-5 lg:space-y-7 transition-all duration-700 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                        <div className='flex justify-center mb-3 sm:mb-4'>
                            <div className='p-3 sm:p-4 lg:p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl'>
                                <IconComponent className='w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 text-white' strokeWidth={1.5} />
                            </div>
                        </div>

                        <div className='flex justify-center'>
                            <span className='inline-block bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-xs sm:text-sm lg:text-base uppercase tracking-[0.15em] font-medium border border-white/20 shadow-lg'>
                                {slide.subtitle}
                            </span>
                        </div>

                        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight px-2 drop-shadow-2xl'>
                            {slide.title}
                        </h1>

                        <p className='text-white/90 text-sm sm:text-base lg:text-lg xl:text-xl max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto font-normal leading-relaxed px-4 drop-shadow-lg'>
                            {slide.description}
                        </p>

                        <div className='pt-5 sm:pt-6 lg:pt-8'>
                            <button
                                onClick={() => onButtonClick(slide.buttonLink)}
                                className='group relative bg-white hover:bg-gray-50 text-gray-900 px-10 py-4 sm:px-12 sm:py-5 lg:px-16 lg:py-6 
                                text-sm sm:text-base lg:text-lg font-semibold tracking-wide uppercase
                                border-2 border-white hover:border-gray-100
                                transition-all duration-300 rounded-lg
                                active:scale-95 shadow-xl hover:shadow-2xl cursor-pointer'
                            >
                                <span className='relative z-10 flex items-center gap-2 justify-center'>
                                    {slide.buttonText}
                                    <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform' strokeWidth={2} />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

Slide.displayName = 'Slide';

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayTimeoutRef = useRef(null);
    const navigate = useNavigate();

    const slides = [
        {
            title: "Gaming Powerhouse",
            subtitle: "Next-Gen Performance",
            description: "Experience unmatched gaming with cutting-edge components designed for ultimate performance",
            buttonText: "Build Now",
            buttonLink: "/category/Gaming-Pc",
            gradient: "from-slate-900/70 via-blue-900/60 to-slate-900/80",
            image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1920&q=80",
            icon: Cpu
        },
        {
            title: "Professional Workstations",
            subtitle: "Built for Creators",
            description: "Unleash your creativity with professional-grade power and precision engineering",
            buttonText: "Explore Builds",
            buttonLink: "/category/Rendering-Pc",
            gradient: "from-gray-900/70 via-purple-900/60 to-slate-900/80",
            image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1920&q=80",
            icon: Zap
        },
        {
            title: "Exclusive Configurations",
            subtitle: "Limited Edition PCs",
            description: "Premium builds with exceptional performance, cutting-edge design, and meticulous craftsmanship",
            buttonText: "View Collection",
            buttonLink: "/category/Exclusives",
            gradient: "from-zinc-900/70 via-indigo-900/60 to-gray-900/80",
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1920&q=80",
            icon: Award
        }
    ];

    useEffect(() => {
        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        };
    }, []);

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
            className='relative w-full h-screen overflow-hidden bg-gray-100 select-none'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {slides.map((slide, index) => (
                <Slide 
                    key={index}
                    slide={slide}
                    isActive={index === currentSlide}
                    onButtonClick={handleButtonClick}
                />
            ))}

            <button
                onClick={prevSlide}
                className='hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 
                w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 items-center justify-center
                text-white hover:text-white/80 transition-all duration-300
                group cursor-pointer'
                aria-label="Previous slide"
            >
                <ChevronLeft className='w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 group-hover:-translate-x-0.5 transition-transform drop-shadow-lg' strokeWidth={2.5} />
            </button>

            <button
                onClick={nextSlide}
                className='hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 
                w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 items-center justify-center
                text-white hover:text-white/80 transition-all duration-300
                group cursor-pointer'
                aria-label="Next slide"
            >
                <ChevronRight className='w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 group-hover:translate-x-0.5 transition-transform drop-shadow-lg' strokeWidth={2} />
            </button>

            {/* Slide Indicators */}
            <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3'>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                                ? 'bg-white w-8' 
                                : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;