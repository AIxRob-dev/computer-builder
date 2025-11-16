import { useEffect, useState, memo, lazy, Suspense } from "react";
import { useProductStore } from "../stores/useProductStore";

// ⚡ CRITICAL: Lazy load heavy components
const CategoryItem = lazy(() => import("../components/CategoryItem"));
const FeaturedProducts = lazy(() => import("../components/FeaturedProducts"));
const BestSellerProducts = lazy(() => import("../components/BestSellerProducts"));
const HeroSection = lazy(() => import("../components/HeroSection"));
const PromoSlider = lazy(() => import("../components/PromoSlider"));
const About = lazy(() => import("../components/About"));

const categories = [
    { href: "/Office-Pc", name: "office-pc" },
    { href: "/Gaming-pc", name: "gaming-pc" },
    { href: "/Rendering-pc", name: "rendering-pc" },
    { href: "/Exclusives", name: "exclusive-pc"},
    { href: "/Explore", name: "Explore"}
];

// ⚡ OPTIMIZED: Memoized animated text component
const AnimatedText = memo(() => {
    const words = ["Coding", "Gaming", "Rendering", "Researching", "Designing", "Streaming", "Creating"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
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
});

AnimatedText.displayName = 'AnimatedText';

// ⚡ OPTIMIZED: Memoized icon components
const Sparkles = memo(({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
));

Sparkles.displayName = 'Sparkles';

const Settings = memo(({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
));

Settings.displayName = 'Settings';

// ⚡ Simple loading skeleton
const ProductsSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
        </div>
    </div>
);

const HomePage = () => {
    const { fetchFeaturedProducts, fetchBestSellerProducts, isLoading } = useProductStore();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellerProducts, setBestSellerProducts] = useState([]);

    // ⚡ CRITICAL: Parallel fetching instead of sequential
    useEffect(() => {
        const loadProducts = async () => {
            console.log("🚀 Loading products in parallel...");
            
            try {
                // ⚡ Fetch both product types simultaneously
                const [featuredResult, bestSellerResult] = await Promise.allSettled([
                    fetchFeaturedProducts(),
                    fetchBestSellerProducts()
                ]);

                // Handle featured products
                if (featuredResult.status === 'fulfilled') {
                    const featured = useProductStore.getState().products;
                    setFeaturedProducts(featured);
                    console.log("✅ Featured products loaded:", featured.length);
                }

                // Handle best seller products  
                if (bestSellerResult.status === 'fulfilled') {
                    const bestSellers = useProductStore.getState().products;
                    setBestSellerProducts(bestSellers);
                    console.log("✅ Best seller products loaded:", bestSellers.length);
                }
            } catch (error) {
                console.error("❌ Error loading products:", error);
            }
        };

        loadProducts();
    }, [fetchFeaturedProducts, fetchBestSellerProducts]);

    return (
        <div className='relative min-h-screen bg-white overflow-hidden'>
            {/* ⚡ Lazy load non-critical sections */}
            <Suspense fallback={<div className="h-16 bg-blue-600 animate-pulse" />}>
                <PromoSlider />
            </Suspense>
            
            <Suspense fallback={<div className="h-screen bg-gradient-to-br from-blue-600 to-blue-800 animate-pulse" />}>
                <HeroSection />
            </Suspense>

            {/* BUILD YOUR PC SECTION */}
            <div className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-12 sm:py-16 md:py-20 lg:py-24'>
                {/* ⚡ OPTIMIZED: Removed heavy inline SVG pattern */}
                
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

                    {/* Stats Grid - Reduced animations */}
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12'>
                        {[
                            { number: "10+", text: "Pre-Built Configurations" },
                            { number: "100%", text: "Quality Tested" },
                            { number: "24/7", text: "Expert Support" },
                            { number: "Premium", text: "Components Only" }
                        ].map((stat, idx) => (
                            <div key={idx} className='bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/20 hover:bg-white/15 transition-all duration-300'>
                                <div className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2'>
                                    {stat.number}
                                </div>
                                <div className='text-xs sm:text-sm lg:text-base text-blue-100 font-medium'>
                                    {stat.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Feature Highlights - Simplified */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                        {[
                            {
                                icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                                title: "Specialized Office PCs",
                                desc: "Optimized for productivity with reliable performance for business applications and multitasking."
                            },
                            {
                                icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                                title: "High-Performance Gaming",
                                desc: "Built for immersive gaming experiences with cutting-edge graphics and lightning-fast response times."
                            },
                            {
                                icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
                                title: "Professional Rendering",
                                desc: "Powerhouse systems for 3D rendering, video editing, and creative professional workflows."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className='bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-shadow duration-300'>
                                <div className='w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 sm:w-7 sm:h-7 text-blue-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2'>{feature.title}</h3>
                                <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>{feature.desc}</p>
                            </div>
                        ))}
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
                                {[
                                    { number: "500+", label: "Configurations" },
                                    { number: "5 Year", label: "Warranty" },
                                    { number: "24/7", label: "Support" }
                                ].map((item, idx) => (
                                    <div key={idx} className='text-center'>
                                        <div className='text-3xl font-black text-gray-900'>{item.number}</div>
                                        <div className='text-sm text-gray-600 font-semibold uppercase tracking-wider'>{item.label}</div>
                                    </div>
                                )).reduce((acc, curr, idx, arr) => 
                                    idx < arr.length - 1 
                                        ? [...acc, curr, <div key={`div-${idx}`} className='w-px h-10 bg-gray-300'></div>] 
                                        : [...acc, curr]
                                , [])}
                            </div>
                        </div>

                        {/* ⚡ Lazy load categories */}
                        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />}>
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
                        </Suspense>

                        <div className='text-center mt-16'>
                            <p className='text-gray-600 font-semibold mb-5 text-lg'>
                                Need something unique?
                            </p>
                            <button className='inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300'>
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

                {/* ⚡ Show skeleton while loading, then lazy load products */}
                {isLoading ? (
                    <ProductsSkeleton />
                ) : (
                    <>
                        {bestSellerProducts.length > 0 && (
                            <section className='mb-12 sm:mb-16 lg:mb-20'>
                                <Suspense fallback={<ProductsSkeleton />}>
                                    <BestSellerProducts bestSellerProducts={bestSellerProducts} />
                                </Suspense>
                            </section>
                        )}

                        {bestSellerProducts.length > 0 && featuredProducts.length > 0 && (
                            <div className='h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-12 sm:mb-16 lg:mb-20'></div>
                        )}

                        {featuredProducts.length > 0 && (
                            <section className='mb-12 sm:mb-16 lg:mb-20'>
                                <Suspense fallback={<ProductsSkeleton />}>
                                    <FeaturedProducts featuredProducts={featuredProducts} />
                                </Suspense>
                            </section>
                        )}
                    </>
                )}

                {/* ⚡ NEW: About Section - Added after Featured Products */}
                <div className='relative mb-12 sm:mb-16 lg:mb-20'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t-2 border-gray-200'></div>
                    </div>
                </div>

                <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-3xl" />}>
                    <About />
                </Suspense>

                {/* Trust Badges - Simplified */}
                <section className='mt-16 sm:mt-20 lg:mt-24 mb-12 sm:mb-16 lg:mb-20'>
                    <div className='bg-gradient-to-br from-blue-50 via-white to-blue-50/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border-2 border-blue-100 shadow-sm'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10'>
                            {[
                                { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Premium Quality", desc: "Only top-tier components and brands" },
                                { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Fast Delivery", desc: "Quick shipping to your doorstep" },
                                { icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", title: "Custom Builds", desc: "Tailored to your exact specifications" },
                                { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "Expert Support", desc: "24/7 technical assistance available" }
                            ].map((badge, idx) => (
                                <div key={idx} className='text-center'>
                                    <div className='w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                                        <svg className='w-7 h-7 sm:w-8 sm:h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.icon} />
                                        </svg>
                                    </div>
                                    <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-2'>{badge.title}</h3>
                                    <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>{badge.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <div className='absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-blue-50/30 to-transparent pointer-events-none' />
        </div>
    );
};

// ⚡ CRITICAL: Export memoized component
export default memo(HomePage);
