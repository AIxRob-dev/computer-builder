import { useState, useEffect } from "react";
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

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, slides.length]);

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setIsAutoPlaying(false);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
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
        
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    return (
        <div 
            className='relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Slides */}
            {slides.map((slide, index) => {
                const IconComponent = slide.icon;
                return (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        {/* Background Image with better mobile optimization */}
                        <div 
                            className='absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-700'
                            style={{ 
                                backgroundImage: `url(${slide.image})`,
                                transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)'
                            }} 
                        />
                        
                        {/* Premium Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} backdrop-blur-[1px]`} />
                        
                        {/* Content */}
                        <div className='relative w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8'>
                            <div className='max-w-4xl mx-auto text-center'>
                                <div className={`space-y-3 sm:space-y-4 lg:space-y-6 transition-all duration-700 ${
                                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                }`}>
                                    {/* Minimalist Icon */}
                                    <div className='flex justify-center mb-2 sm:mb-4'>
                                        <div className='p-2 sm:p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10'>
                                            <IconComponent className='w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white' strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    {/* Subtitle */}
                                    <p className='text-zinc-400 text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.2em] font-light'>
                                        {slide.subtitle}
                                    </p>

                                    {/* Title */}
                                    <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-tight tracking-tight'>
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    <p className='text-zinc-300 text-xs sm:text-sm lg:text-base max-w-md lg:max-w-xl mx-auto font-light leading-relaxed'>
                                        {slide.description}
                                    </p>

                                    {/* Minimalist Premium Button */}
                                    <div className='pt-3 sm:pt-4 lg:pt-6'>
                                        <button
                                            onClick={() => navigate(slide.buttonLink)}
                                            className='group relative bg-white text-black px-8 py-2.5 sm:px-10 sm:py-3 lg:px-12 lg:py-3.5 
                                            text-xs sm:text-sm lg:text-base font-medium tracking-wide uppercase
                                            transition-all duration-300 overflow-hidden
                                            hover:bg-zinc-900 hover:text-white
                                            border border-white hover:border-zinc-700'
                                        >
                                            <span className='relative z-10'>{slide.buttonText}</span>
                                            <div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
            <button
                onClick={prevSlide}
                className='hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 
                w-10 h-10 lg:w-12 lg:h-12 items-center justify-center
                bg-white/5 backdrop-blur-md border border-white/10
                text-white hover:bg-white/10 transition-all duration-300
                group'
                aria-label='Previous slide'
            >
                <ChevronLeft className='w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-0.5 transition-transform' strokeWidth={1.5} />
            </button>
            
            <button
                onClick={nextSlide}
                className='hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 
                w-10 h-10 lg:w-12 lg:h-12 items-center justify-center
                bg-white/5 backdrop-blur-md border border-white/10
                text-white hover:bg-white/10 transition-all duration-300
                group'
                aria-label='Next slide'
            >
                <ChevronRight className='w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-0.5 transition-transform' strokeWidth={1.5} />
            </button>

            {/* Minimalist Dots Indicator */}
            <div className='absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20'>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 ${
                            index === currentSlide
                                ? 'w-8 sm:w-10 lg:w-12 h-0.5 sm:h-[3px] bg-white'
                                : 'w-6 sm:w-8 h-0.5 sm:h-[3px] bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Swipe indicator for mobile */}
            <div className='sm:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-20'>
                <div className='flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest'>
                    <div className='w-8 h-[1px] bg-white/20' />
                    <span>Swipe</span>
                    <div className='w-8 h-[1px] bg-white/20' />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
