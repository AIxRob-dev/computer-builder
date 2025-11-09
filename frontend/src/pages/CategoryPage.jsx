import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchProductsByCategory, products } = useProductStore();
	const { category } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		fetchProductsByCategory(category);
	}, [fetchProductsByCategory, category]);

	// Format category name for display
	const formattedCategory = category
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Hero Section - Blue Background */}
			<div className='bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden'>
				{/* Subtle pattern overlay */}
				<div className='absolute inset-0 opacity-10'>
					<div className='absolute inset-0' style={{
						backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
						backgroundSize: '40px 40px'
					}} />
				</div>

				<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
					{/* Back Button */}
					<motion.button
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						onClick={() => navigate(-1)}
						className='flex items-center text-white/90 hover:text-white mb-8 sm:mb-10 group transition-colors'
					>
						<ArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' size={20} strokeWidth={2} />
						<span className='text-sm sm:text-base font-medium'>Back</span>
					</motion.button>

					{/* Hero Content */}
					<motion.div
						className='text-center max-w-4xl mx-auto'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6'>
							We Build PCs for {formattedCategory}
						</h1>
						<p className='text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-normal leading-relaxed'>
							Choose from professionally configured builds or customize your perfect setup. Every PC is assembled with precision and tested for peak performance.
						</p>
						{products?.length > 0 && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
								className='mt-6 sm:mt-8'
							>
								<span className='inline-block bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium'>
									{products.length} {products.length === 1 ? 'Build' : 'Builds'} Available
								</span>
							</motion.div>
						)}
					</motion.div>
				</div>
			</div>

			{/* Products Section - White Background */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
				{/* Section Header */}
				<motion.div
					className='mb-8 sm:mb-10 lg:mb-12'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
						Available Builds
					</h2>
					<p className='text-sm sm:text-base text-gray-600'>
						Premium {formattedCategory.toLowerCase()} builds handpicked for exceptional performance
					</p>
				</motion.div>

				{/* Products Grid */}
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					{products?.length === 0 && (
						<div className='col-span-full text-center py-16 sm:py-20 bg-white rounded-lg border border-gray-200'>
							<div className='max-w-md mx-auto'>
								<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
									</svg>
								</div>
								<p className='text-xl sm:text-2xl font-semibold text-gray-900 mb-2'>
									No products found
								</p>
								<p className='text-sm text-gray-600 mb-6'>
									We couldn't find any builds in this category right now.
								</p>
								<button
									onClick={() => navigate('/')}
									className='inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200'
								>
									Browse All Products
								</button>
							</div>
						</div>
					)}

					{products?.map((product, index) => (
						<motion.div
							key={product._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.1 + (index * 0.05) }}
						>
							<ProductCard product={product} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default CategoryPage;