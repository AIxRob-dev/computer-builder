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
		<div className='min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900'>
			<div className='relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16'>
				{/* Back Button */}
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					onClick={() => navigate(-1)}
					className='flex items-center text-white hover:text-zinc-300 mb-8 sm:mb-10 lg:mb-12 group transition-colors'
				>
					<ArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' size={20} strokeWidth={1.5} />
					<span className='text-sm sm:text-base font-light tracking-wide'>Back</span>
				</motion.button>

				{/* Category Title */}
				<motion.div
					className='text-center mb-10 sm:mb-12 lg:mb-16'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-3 sm:mb-4 tracking-tight'>
						{formattedCategory}
					</h1>
					<div className='h-px w-16 sm:w-20 bg-white mx-auto' />
					{products?.length > 0 && (
						<p className='mt-4 text-sm sm:text-base text-zinc-400 font-light'>
							{products.length} {products.length === 1 ? 'product' : 'products'} found
						</p>
					)}
				</motion.div>

				{/* Products Grid */}
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					{products?.length === 0 && (
						<div className='col-span-full text-center py-16 sm:py-20'>
							<p className='text-xl sm:text-2xl font-light text-zinc-400 mb-4'>
								No products found
							</p>
							<button
								onClick={() => navigate('/')}
								className='text-sm text-white hover:text-zinc-300 transition-colors font-light tracking-wide'
							>
								Return to Home
							</button>
						</div>
					)}

					{products?.map((product, index) => (
						<motion.div
							key={product._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: index * 0.05 }}
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
