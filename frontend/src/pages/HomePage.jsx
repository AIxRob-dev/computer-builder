import { useEffect, useState } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import BestSellerProducts from "../components/BestSellerProducts.jsx";
import HeroSection from "../components/HeroSection";

const categories = [
    { href: "/GTA-Series", name: "GTA", imageUrl: "/rock.png" },
    { href: "/Animes-Series", name: "Animes", imageUrl: "/aNIMESseRIES.png" },
    { href: "/Valorant", name: "Shoes", imageUrl: "/vite.svg" },
    { href: "/Maths", name: "Glasses", imageUrl: "/Classic-product.png" },
    { href: "/RDR2", name: "Jackets", imageUrl: "/jackets.jpg" },
    { href: "/Explore", name: "Suits", imageUrl: "/suits.jpg" }
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
        <div className='relative min-h-screen bg-black text-white overflow-hidden'>
            {/* Hero Section */}
            <HeroSection />

            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
                {/* Categories Section */}
                <div className='mb-12 sm:mb-16 lg:mb-20'>
                    <div className='text-center mb-8 sm:mb-10 lg:mb-12'>
                        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-4'>
                            Shop by Category
                        </h2>
                        <p className='text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4'>
                            Discover our curated collection across different styles
                        </p>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
                        {categories.map((category) => (
                            <CategoryItem category={category} key={category.name} />
                        ))}
                    </div>
                </div>

                {/* Featured Products Section */}
                {!isLoading && featuredProducts.length > 0 && (
                    <FeaturedProducts featuredProducts={featuredProducts} />
                )}

                {/* Best Seller Products Section */}
                {!isLoading && bestSellerProducts.length > 0 && (
                    <BestSellerProducts bestSellerProducts={bestSellerProducts} />
                )}
            </div>
        </div>
    );
};

export default HomePage;