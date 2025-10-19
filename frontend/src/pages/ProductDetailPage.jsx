import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";

const ProductDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { products } = useProductStore();
	
	const [product, setProduct] = useState(null);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [allImages, setAllImages] = useState([]);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

	useEffect(() => {
		// Find the product from the store
		const foundProduct = products.find(p => p._id === id);
		setProduct(foundProduct);

		// Combine main image and additional images into one array
		if (foundProduct) {
			const images = [foundProduct.image];
			if (foundProduct.additionalImages && foundProduct.additionalImages.length > 0) {
				images.push(...foundProduct.additionalImages);
			}
			setAllImages(images);
			setSelectedImageIndex(0); // Reset to first image
		}
	}, [id, products]);

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		addToCart(product);
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	const handlePreviousImage = () => {
		setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
	};

	const handleNextImage = () => {
		setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
	};

	const handleOpenLightbox = (index) => {
		setLightboxImageIndex(index);
		setIsLightboxOpen(true);
	};

	const handleCloseLightbox = () => {
		setIsLightboxOpen(false);
	};

	const handleLightboxPrevious = () => {
		setLightboxImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
	};

	const handleLightboxNext = () => {
		setLightboxImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
	};

	// Handle keyboard navigation in lightbox
	useEffect(() => {
		if (!isLightboxOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') handleCloseLightbox();
			if (e.key === 'ArrowLeft') handleLightboxPrevious();
			if (e.key === 'ArrowRight') handleLightboxNext();
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isLightboxOpen, allImages.length]);

	if (!product) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<p className='text-2xl text-gray-300'>Loading product...</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen py-12'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Back Button */}
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					onClick={handleGoBack}
					className='flex items-center text-emerald-400 hover:text-emerald-300 mb-8'
				>
					<ArrowLeft className='mr-2' size={24} />
					Back to Products
				</motion.button>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='grid md:grid-cols-2 gap-12'
				>
					{/* Image Gallery Section */}
					<div className='space-y-4'>
						{/* Main Image Display with Navigation Arrows */}
						<div className='relative rounded-lg overflow-hidden border border-gray-700 shadow-lg bg-gray-800 cursor-pointer group'>
							<AnimatePresence mode='wait'>
								<motion.img
									key={selectedImageIndex}
									src={allImages[selectedImageIndex]}
									alt={`${product.name} - Image ${selectedImageIndex + 1}`}
									className='w-full h-[500px] object-cover'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									onClick={() => handleOpenLightbox(selectedImageIndex)}
								/>
							</AnimatePresence>

							{/* Zoom Icon Overlay */}
							<div 
								className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center'
								onClick={() => handleOpenLightbox(selectedImageIndex)}
							>
								<ZoomIn 
									size={48} 
									className='text-white opacity-0 group-hover:opacity-100 transition-opacity' 
								/>
							</div>

							{/* Navigation Arrows - Only show if multiple images */}
							{allImages.length > 1 && (
								<>
									<button
										onClick={handlePreviousImage}
										className='absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all z-10'
										aria-label='Previous image'
									>
										<ChevronLeft size={24} />
									</button>
									<button
										onClick={handleNextImage}
										className='absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all z-10'
										aria-label='Next image'
									>
										<ChevronRight size={24} />
									</button>

									{/* Image Counter */}
									<div className='absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm'>
										{selectedImageIndex + 1} / {allImages.length}
									</div>
								</>
							)}
						</div>

						{/* Thumbnail Gallery - Only show if multiple images */}
						{allImages.length > 1 && (
							<div className='grid grid-cols-4 gap-3'>
								{allImages.map((image, index) => (
									<button
										key={index}
										onClick={() => setSelectedImageIndex(index)}
										className={`relative rounded-lg overflow-hidden border-2 transition-all ${
											selectedImageIndex === index
												? 'border-emerald-500 ring-2 ring-emerald-500'
												: 'border-gray-700 hover:border-gray-500'
										}`}
									>
										<img
											src={image}
											alt={`Thumbnail ${index + 1}`}
											className='w-full h-24 object-cover'
										/>
										{index === 0 && (
											<span className='absolute top-1 left-1 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded'>
												Main
											</span>
										)}
									</button>
								))}
							</div>
						)}
					</div>

					{/* Product Details */}
					<div className='flex flex-col justify-center'>
						<h1 className='text-4xl font-bold text-white mb-4'>
							{product.name}
						</h1>

						<div className='mb-6'>
							<span className='text-5xl font-bold text-emerald-400'>
								${product.price}
							</span>
						</div>

						{product.description && (
							<div className='mb-6'>
								<h2 className='text-xl font-semibold text-gray-300 mb-2'>
									Description
								</h2>
								<p className='text-gray-400 leading-relaxed'>
									{product.description}
								</p>
							</div>
						)}

						{product.category && (
							<div className='mb-6'>
								<span className='text-gray-400'>Category: </span>
								<span className='text-emerald-400 font-semibold capitalize'>
									{product.category}
								</span>
							</div>
						)}

						{/* Image Count Info */}
						{allImages.length > 1 && (
							<div className='mb-6 text-gray-400 text-sm'>
								📸 {allImages.length} images available
							</div>
						)}

						<button
							onClick={handleAddToCart}
							className='flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-4 text-center text-lg font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all'
						>
							<ShoppingCart size={24} className='mr-3' />
							Add to Cart
						</button>
					</div>
				</motion.div>

				{/* Lightbox Modal */}
				<AnimatePresence>
					{isLightboxOpen && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center'
							onClick={handleCloseLightbox}
						>
							{/* Close Button */}
							<button
								onClick={handleCloseLightbox}
								className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10'
								aria-label='Close lightbox'
							>
								<X size={32} />
							</button>

							{/* Image Counter */}
							<div className='absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-lg z-10'>
								{lightboxImageIndex + 1} / {allImages.length}
							</div>

							{/* Main Lightbox Image */}
							<div 
								className='relative w-full h-full flex items-center justify-center px-16'
								onClick={(e) => e.stopPropagation()}
							>
								<AnimatePresence mode='wait'>
									<motion.img
										key={lightboxImageIndex}
										src={allImages[lightboxImageIndex]}
										alt={`${product.name} - Full size ${lightboxImageIndex + 1}`}
										className='max-h-[90vh] max-w-full object-contain'
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{ duration: 0.3 }}
									/>
								</AnimatePresence>

								{/* Navigation Arrows */}
								{allImages.length > 1 && (
									<>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleLightboxPrevious();
											}}
											className='absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all'
											aria-label='Previous image'
										>
											<ChevronLeft size={32} />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleLightboxNext();
											}}
											className='absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all'
											aria-label='Next image'
										>
											<ChevronRight size={32} />
										</button>
									</>
								)}
							</div>

							{/* Thumbnail Strip at Bottom */}
							{allImages.length > 1 && (
								<div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black bg-opacity-70 p-3 rounded-lg max-w-[90vw] overflow-x-auto'>
									{allImages.map((image, index) => (
										<button
											key={index}
											onClick={(e) => {
												e.stopPropagation();
												setLightboxImageIndex(index);
											}}
											className={`flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
												lightboxImageIndex === index
													? 'border-emerald-500 ring-2 ring-emerald-500'
													: 'border-gray-600 hover:border-gray-400'
											}`}
										>
											<img
												src={image}
												alt={`Thumbnail ${index + 1}`}
												className='w-16 h-16 object-cover'
											/>
										</button>
									))}
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default ProductDetailPage;