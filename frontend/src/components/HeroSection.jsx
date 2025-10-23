import { useState, useEffect } from "react";
import { ShoppingBag, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            title: "New Collection",
            subtitle: "Discover the Latest Trends",
            description: "Elevate your style with our premium collection",
            buttonText: "Shop Now",
            buttonLink: "/category/GTA-Series",
            gradient: "from-gray-900/50 via-gray-800/40 to-black/60",
            image: "public/GTA6.png",
            icon: ShoppingBag
        },
        {
            title: "Premium Quality",
            subtitle: "Crafted for Excellence",
            description: "Experience unmatched quality and comfort",
            buttonText: "Explore",
            buttonLink: "/category/Maths",
            gradient: "from-black/50 via-gray-900/40 to-gray-800/60",
            image: "public/rdr2.jpg",
            icon: TrendingUp
        },
        {
            title: "Exclusive Deals",
            subtitle: "Limited Time Offers",
            description: "Don't miss out on our special promotions",
            buttonText: "View Deals",
            buttonLink: "/category/RDR2",
            gradient: "from-gray-800/50 via-black/40 to-gray-900/60",
            image: "public/Classic-product.png",
            icon: Sparkles
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className='relative w-full h-[700px] sm:h-[800px] lg:h-[900px] overflow-hidden'>
            {/* Slides */}
            {slides.map((slide, index) => {
                const IconComponent = slide.icon;
                return (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        {/* Background Image */}
                        <div 
                            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
                        
                        {/* Content */}
                        <div className='relative w-full h-full flex items-center justify-center'>
                            <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center'>
                                <div className='space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-in'>
                                    {/* Icon */}
                                    <div className='flex justify-center mb-2 sm:mb-3 lg:mb-4'>
                                        <IconComponent className='w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white opacity-80' />
                                    </div>

                                    {/* Subtitle */}
                                    <p className='text-gray-400 text-xs sm:text-sm lg:text-base uppercase tracking-wider sm:tracking-widest font-medium px-4'>
                                        {slide.subtitle}
                                    </p>

                                    {/* Title */}
                                    <h1 className='text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight px-4'>
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    <p className='text-gray-300 text-sm sm:text-lg lg:text-xl max-w-xl lg:max-w-2xl mx-auto px-4'>
                                        {slide.description}
                                    </p>

                                    {/* Button */}
                                    <div className='pt-2 sm:pt-3 lg:pt-4'>
                                        <button
                                            onClick={() => navigate(slide.buttonLink)}
                                            className='bg-white text-black px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-none 
                                            hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 
                                            shadow-lg hover:shadow-xl active:scale-95'
                                        >
                                            {slide.buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Dots Indicator */}
            <div className='absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10'>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 ${
                            index === currentSlide
                                ? 'w-8 sm:w-10 lg:w-12 h-2 sm:h-2.5 lg:h-3 bg-white'
                                : 'w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-white/40 hover:bg-white/60'
                        } rounded-full`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;