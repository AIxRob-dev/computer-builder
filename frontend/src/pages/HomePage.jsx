import { useEffect, useState } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import BestSellerProducts from "../components/BestSellerProducts.jsx";
import HeroSection from "../components/HeroSection";

const categories = [
    { href: "/GTA-Series", name: "GTA", imageUrl: "/gta.jpg" },
    { href: "/Animes-Series", name: "Animes", imageUrl: "/animes.png" },
    { href: "/Valorant", name: "Valorant", imageUrl: "/omen.jpg" },
    { href: "/Maths", name: "Maths", imageUrl: "/mathss.jpg" },
    { href: "/RDR2", name: " Red dead RedemptionII", imageUrl: "/rdr2.jpg" },
    { href: "/Explore", name: "Explore", imageUrl: "/rock.png" }
];

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
        <div className='relative min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white overflow-hidden'>
            {/* Subtle background pattern overlay */}
            <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent pointer-events-none' />
            
            {/* Hero Section */}
            <HeroSection />

            <div className='relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 lg:py-16'>
                {/* Categories Section */}
                <section className='mb-10 sm:mb-14 lg:mb-20'>
                    <div className='text-center mb-6 sm:mb-8 lg:mb-12'>
                        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 px-2 tracking-tight'>
                            Shop by Category
                        </h2>
                        <p className='text-sm sm:text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto px-3'>
                            Discover our curated collection across different styles
                        </p>
                    </div>

                    {/* Responsive grid with better mobile spacing */}
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5'>
                        {categories.map((category) => (
                            <CategoryItem category={category} key={category.name} />
                        ))}
                    </div>
                </section>

                {/* Featured Products Section with subtle divider */}
                {!isLoading && featuredProducts.length > 0 && (
                    <section className='mb-10 sm:mb-14 lg:mb-20'>
                        <div className='h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-10 sm:mb-14 lg:mb-16' />
                        <FeaturedProducts featuredProducts={featuredProducts} />
                    </section>
                )}

                {/* Best Seller Products Section with subtle divider */}
                {!isLoading && bestSellerProducts.length > 0 && (
                    <section className='mb-10 sm:mb-14 lg:mb-20'>
                        <div className='h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-10 sm:mb-14 lg:mb-16' />
                        <BestSellerProducts bestSellerProducts={bestSellerProducts} />
                    </section>
                )}
            </div>

            {/* Bottom fade effect */}
            <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none' />
        </div>
    );
};

export default HomePage
