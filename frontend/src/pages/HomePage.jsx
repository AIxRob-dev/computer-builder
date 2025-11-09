import { useEffect, useState } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import BestSellerProducts from "../components/BestSellerProducts.jsx";
import HeroSection from "../components/HeroSection";
import PromoSlider from "../components/PromoSlider";

const categories = [
    { href: "/Office-Pc", name: "office-pc" },
    { href: "/Gaming-pc", name: "gaming-pc" },
    { href: "/Rendering-pc", name: "rendering-pc" },
    { href: "/Exclusives", name: "exclusive-pc"},
    { href: "/Explore", name: "Explore"}
];

// Animated Text Component for rotating words
const AnimatedText = () => {
    const words = ["Coding", "Gaming", "Rendering", "Researching", "Designing", "Streaming", "Creating"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
                setIsAnimating(false);
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span className={`inline-block transition-all duration-500 ${isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-extrabold">
                {words[currentWordIndex]}
            </span>
        </span>
    );
};

// Sparkles Icon Component
const Sparkles = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

// Settings Icon Component
const Settings = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const HomePage = () => {
    const { fetchFeaturedProducts, fetchBestSellerProducts, products, isLoading } = useProductStore();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellerProducts, setBestSellerProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            // Fetch featured products
            await fetchFeaturedProducts();
            const featured = useProductStore.getState().products;
            setFeaturedProducts(featured);

            // Fetch best seller products
            await fetchBestSellerProducts();
            const bestSellers = useProductStore.getState().products;
            setBestSellerProducts(bestSellers);
        };

        loadProducts();
    }, [fetchFeaturedProducts, fetchBestSellerProducts]);

    return (
        <div className='relative min-h-screen bg-white overflow-hidden'>
            {/* Promo Slider */}
            <PromoSlider />
            
            {/* Hero Section - Full Viewport Height */}
            <HeroSection />

            {/* BUILD YOUR PC SECTION */}
            <div className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-12 sm:py-16 md:py-20 lg:py-24'>
                <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30'></div>
                
                <div className='relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full'>
                    {/* Main Heading with Animated Text */}
                    <div className='text-center mb-10 sm:mb-12 lg:mb-14'>
                        <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-5 sm:mb-6 leading-tight'>
                            We Build PCs for
                            <br />
                            <AnimatedText />
                        </h2>
                        <p className='text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-4'>
                            Choose from professionally configured builds or customize your perfect setup. 
                            Every PC is assembled with precision and tested for peak performance.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12'>
                        <div className='bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/20 hover:bg-white/15 transition-all duration-300 group'>
                            <div className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300'>
                                10+
                            </div>
                            <div className='text-xs sm:text-sm lg:text-base text-blue-100 font-medium'>
                                Pre-Built Configurations
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/20 hover:bg-white/15 transition-all duration-300 group'>
                            <div className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300'>
                                100%
                            </div>
                            <div className='text-xs sm:text-sm lg:text-base text-blue-100 font-medium'>
                                Quality Tested
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/20 hover:bg-white/15 transition-all duration-300 group'>
                            <div className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300'>
                                24/7
                            </div>
                            <div className='text-xs sm:text-sm lg:text-base text-blue-100 font-medium'>
                                Expert Support
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/20 hover:bg-white/15 transition-all duration-300 group'>
                            <div className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300'>
                                Premium
                            </div>
                            <div className='text-xs sm:text-sm lg:text-base text-blue-100 font-medium'>
                                Components Only
                            </div>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                        <div className='bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
                            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4'>
                                <svg className='w-6 h-6 sm:w-7 sm:h-7 text-blue-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2'>Specialized Office PCs</h3>
                            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                                Optimized for productivity with reliable performance for business applications and multitasking.
                            </p>
                        </div>

                        <div className='bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
                            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4'>
                                <svg className='w-6 h-6 sm:w-7 sm:h-7 text-blue-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2'>High-Performance Gaming</h3>
                            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                                Built for immersive gaming experiences with cutting-edge graphics and lightning-fast response times.
                            </p>
                        </div>

                        <div className='bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
                            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4'>
                                <svg className='w-6 h-6 sm:w-7 sm:h-7 text-blue-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2'>Professional Rendering</h3>
                            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                                Powerhouse systems for 3D rendering, video editing, and creative professional workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className='relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
                
                {/* Categories Section */}
             <section className='relative py-16 sm:py-20 lg:py-24 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-12 sm:mb-16'>
                        <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest shadow-lg mb-5'>
                            <Sparkles className='w-4 h-4' />
                            Premium Collections
                        </div>
                        
                        <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight'>
                            <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                                Purpose-Built
                            </span>
                            <br />
                            <span>Performance Systems</span>
                        </h2>
                        
                        <div className='flex items-center justify-center gap-3 mb-5'>
                            <div className='w-20 h-1 bg-gradient-to-r from-transparent via-blue-600 to-blue-600 rounded-full'></div>
                            <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
                            <div className='w-20 h-1 bg-gradient-to-l from-transparent via-blue-600 to-blue-600 rounded-full'></div>
                        </div>
                        
                        <p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                            From competitive gaming to professional content creation—discover precision-engineered systems tailored to your exact workflow
                        </p>

                        <div className='flex flex-wrap items-center justify-center gap-8 mt-10'>
                            <div className='text-center'>
                                <div className='text-3xl font-black text-gray-900'>500+</div>
                                <div className='text-sm text-gray-600 font-semibold uppercase tracking-wider'>Configurations</div>
                            </div>
                            <div className='w-px h-10 bg-gray-300'></div>
                            <div className='text-center'>
                                <div className='text-3xl font-black text-gray-900'>5 Year</div>
                                <div className='text-sm text-gray-600 font-semibold uppercase tracking-wider'>Warranty</div>
                            </div>
                            <div className='w-px h-10 bg-gray-300'></div>
                            <div className='text-center'>
                                <div className='text-3xl font-black text-gray-900'>24/7</div>
                                <div className='text-sm text-gray-600 font-semibold uppercase tracking-wider'>Support</div>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-8 lg:space-y-10'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10'>
                            {categories.slice(0, 2).map((category) => (
                                <CategoryItem category={category} key={category.name} />
                            ))}
                        </div>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
                            {categories.slice(2).map((category) => (
                                <CategoryItem category={category} key={category.name} />
                            ))}
                        </div>
                    </div>

                    <div className='text-center mt-16'>
                        <p className='text-gray-600 font-semibold mb-5 text-lg'>
                            Need something unique?
                        </p>
                        <button className='inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
                            <Settings className='w-5 h-5' />
                            Custom Build Configurator
                        </button>
                    </div>
                </div>
            </section>

                <div className='relative mb-12 sm:mb-16 lg:mb-20'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t-2 border-gray-200'></div>
                    </div>
                    <div className='relative flex justify-center'>
                        <span className='bg-white px-6 py-2 text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wider'>
                            Featured Collections
                        </span>
                    </div>
                </div>

                {!isLoading && bestSellerProducts.length > 0 && (
                    <section className='mb-12 sm:mb-16 lg:mb-20'>
                        <BestSellerProducts bestSellerProducts={bestSellerProducts} />
                    </section>
                )}

                {!isLoading && bestSellerProducts.length > 0 && featuredProducts.length > 0 && (
                    <div className='h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-12 sm:mb-16 lg:mb-20'></div>
                )}

                {!isLoading && featuredProducts.length > 0 && (
                    <section className='mb-12 sm:mb-16 lg:mb-20'>
                        <FeaturedProducts featuredProducts={featuredProducts} />
                    </section>
                )}

                <section className='mt-16 sm:mt-20 lg:mt-24 mb-12 sm:mb-16 lg:mb-20'>
                    <div className='bg-gradient-to-br from-blue-50 via-white to-blue-50/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border-2 border-blue-100 shadow-sm'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10'>
                            <div className='text-center group'>
                                <div className='w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                                    <svg className='w-7 h-7 sm:w-8 sm:h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-2'>Premium Quality</h3>
                                <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>Only top-tier components and brands</p>
                            </div>

                            <div className='text-center group'>
                                <div className='w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                                    <svg className='w-7 h-7 sm:w-8 sm:h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-2'>Fast Delivery</h3>
                                <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>Quick shipping to your doorstep</p>
                            </div>

                            <div className='text-center group'>
                                <div className='w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                                    <svg className='w-7 h-7 sm:w-8 sm:h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </div>
                                <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-2'>Custom Builds</h3>
                                <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>Tailored to your exact specifications</p>
                            </div>

                            <div className='text-center group'>
                                <div className='w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                                    <svg className='w-7 h-7 sm:w-8 sm:h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-2'>Expert Support</h3>
                                <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>24/7 technical assistance available</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            <div className='absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-blue-50/30 to-transparent pointer-events-none' />
        </div>
    );
};

export default HomePage;