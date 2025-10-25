import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn, Check, MessageCircle, PackageX } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";

const ProductDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { addToCart, cart } = useCartStore();
	const { products, fetchProductById } = useProductStore();
	
	const [product, setProduct] = useState(null);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [allImages, setAllImages] = useState([]);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);

	// Check if product is already in cart and stock status
	const isInCart = cart.some(item => item._id === product?._id);
	const isOutOfStock = product?.inStock === false;

	useEffect(() => {
		const loadProduct = async () => {
			setLoading(true);
			
			// First try to find in existing products array
			let foundProduct = products.find(p => p._id === id);
			
			// If not found, fetch from API
			if (!foundProduct) {
				foundProduct = await fetchProductById(id);
			}
			
			setProduct(foundProduct);

			// Combine main image and additional images into one array
			if (foundProduct) {
				const images = [foundProduct.image];
				if (foundProduct.additionalImages && foundProduct.additionalImages.length > 0) {
					images.push(...foundProduct.additionalImages);
				}
				setAllImages(images);
				setSelectedImageIndex(0);
			}
			
			setLoading(false);
		};

		loadProduct();
	}, [id, products, fetchProductById]);

	const handleAddToCart = () => {
		if (isOutOfStock) {
			toast.error("This product is currently out of stock", { id: "out-of-stock" });
			return;
		}

		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			setTimeout(() => {
				navigate("/signup");
			}, 1000);
			return;
		}
		
		if (isInCart) {
			toast.success("Product already in cart!", { id: "already-in-cart" });
			return;
		}
		
		addToCart(product);
		toast.success("Added to cart!");
	};

	const handleWhatsApp = () => {
		const message = encodeURIComponent(
			`Hi! I'm interested in this product:\n${product.name}\nPrice: $${product.price}\nLink: ${window.location.href}`
		);
		const phoneNumber = "1234567890"; // Update with your actual number
		window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	// Touch handlers for mobile swipe on main image
	const handleTouchStart = (e) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (!touchStart || !touchEnd || allImages.length <= 1) return;
		
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > 50;
		const isRightSwipe = distance < -50;

		if (isLeftSwipe) {
			handleNextImage();
		}
		if (isRightSwipe) {
			handlePreviousImage();
		}

		setTouchStart(0);
		setTouchEnd(0);
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
		document.body.style.overflow = 'hidden';
	};

	const handleCloseLightbox = () => {
		setIsLightboxOpen(false);
		document.body.style.overflow = 'unset';
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

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex items-center justify-center'>
				<div className='text-center'>
					<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4'></div>
					<p className='text-xl text-zinc-400 font-light'>Loading product...</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-2xl text-white mb-4 font-light'>Product not found</p>
					<button 
						onClick={() => navigate('/')}
						className='text-zinc-400 hover:text-white transition-colors font-light'
					>
						Return to Home
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 py-8 sm:py-12 lg:py-16'>
			<div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8'>
				{/* Back Button */}
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					onClick={handleGoBack}
					className='flex items-center text-white hover:text-zinc-300 mb-6 sm:mb-8 lg:mb-10 group transition-colors'
				>
					<ArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' size={20} strokeWidth={1.5} />
					<span className='text-sm sm:text-base font-light tracking-wide'>Back</span>
				</motion.button>

				{/* Out of Stock Banner - Full Width */}
				{isOutOfStock && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='mb-6 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 py-3 px-4 sm:px-6'
					>
						<div className='flex items-center justify-center gap-2'>
							<PackageX className='w-5 h-5 text-zinc-500' strokeWidth={1.5} />
							<span className='text-sm sm:text-base font-light uppercase tracking-wider text-zinc-500'>
								This product is currently out of stock
							</span>
						</div>
					</motion.div>
				)}

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12'
				>
					{/* Image Gallery Section */}
					<div className='space-y-3 sm:space-y-4'>
						{/* Main Image Display */}
						<div 
							className='relative overflow-hidden border border-zinc-800/50 bg-zinc-950 group'
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
						>
							<AnimatePresence mode='wait'>
								<motion.div
									key={selectedImageIndex}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className='relative aspect-square sm:aspect-[4/5] cursor-zoom-in'
									onClick={() => handleOpenLightbox(selectedImageIndex)}
								>
									<img
										src={allImages[selectedImageIndex]}
										alt={`${product.name} - Image ${selectedImageIndex + 1}`}
										className='w-full h-full object-contain p-4 sm:p-6 lg:p-8'
									/>
									
									{/* Zoom Icon Overlay */}
									<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center'>
										<ZoomIn 
											size={40} 
											className='text-white opacity-0 group-hover:opacity-100 transition-opacity' 
											strokeWidth={1.5}
										/>
									</div>
								</motion.div>
							</AnimatePresence>

							{/* Navigation Arrows - Desktop only */}
							{allImages.length > 1 && (
								<>
									<button
										onClick={handlePreviousImage}
										className='hidden sm:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 
										w-10 h-10 items-center justify-center
										bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10
										text-white transition-all z-10'
										aria-label='Previous image'
									>
										<ChevronLeft size={20} strokeWidth={1.5} />
									</button>
									<button
										onClick={handleNextImage}
										className='hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 
										w-10 h-10 items-center justify-center
										bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10
										text-white transition-all z-10'
										aria-label='Next image'
									>
										<ChevronRight size={20} strokeWidth={1.5} />
									</button>

									{/* Image Counter */}
									<div className='absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 text-xs font-light tracking-wide'>
										{selectedImageIndex + 1} / {allImages.length}
									</div>
								</>
							)}

							{/* Swipe indicator for mobile */}
							{allImages.length > 1 && (
								<div className='sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2'>
									<div className='flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest'>
										<div className='w-6 h-[1px] bg-white/20' />
										<span>Swipe</span>
										<div className='w-6 h-[1px] bg-white/20' />
									</div>
								</div>
							)}
						</div>

						{/* Thumbnail Gallery - Mobile Friendly Slider */}
						{allImages.length > 1 && (
							<>
								{/* Desktop: Grid View */}
								<div className='hidden sm:grid sm:grid-cols-5 lg:grid-cols-4 gap-2 sm:gap-3'>
									{allImages.map((image, index) => (
										<button
											key={index}
											onClick={() => setSelectedImageIndex(index)}
											className={`relative overflow-hidden border transition-all aspect-square ${
												selectedImageIndex === index
													? 'border-white'
													: 'border-zinc-800/50 hover:border-zinc-700'
											}`}
										>
											<img
												src={image}
												alt={`Thumbnail ${index + 1}`}
												className='w-full h-full object-contain p-2'
											/>
											{index === 0 && (
												<span className='absolute top-1 left-1 bg-white/10 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 border border-white/20'>
													Main
												</span>
											)}
										</button>
									))}
								</div>

								{/* Mobile: Horizontal Scroll */}
								<div className='sm:hidden flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-3 px-3'>
									{allImages.map((image, index) => (
										<button
											key={index}
											onClick={() => setSelectedImageIndex(index)}
											className={`relative overflow-hidden border transition-all aspect-square flex-shrink-0 w-20 h-20 snap-start ${
												selectedImageIndex === index
													? 'border-white scale-105'
													: 'border-zinc-800/50'
											}`}
										>
											<img
												src={image}
												alt={`Thumbnail ${index + 1}`}
												className='w-full h-full object-contain p-1.5'
											/>
											{index === 0 && (
												<span className='absolute top-0.5 left-0.5 bg-white/10 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 border border-white/20'>
													Main
												</span>
											)}
										</button>
									))}
								</div>
							</>
						)}
					</div>

					{/* Product Details */}
					<div className='flex flex-col justify-center space-y-6 sm:space-y-8'>
						{/* Category */}
						{product.category && (
							<div>
								<span className='text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-500 font-light'>
									{product.category}
								</span>
							</div>
						)}

						{/* Product Name */}
						<h1 className='text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight'>
							{product.name}
						</h1>

						{/* Out of Stock Badge - Mobile */}
						{isOutOfStock && (
							<div className='inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2 w-fit'>
								<PackageX className='w-4 h-4 text-zinc-500' strokeWidth={1.5} />
								<span className='text-xs font-light uppercase tracking-wider text-zinc-500'>
									Out of Stock
								</span>
							</div>
						)}

						{/* Price */}
						<div>
							<span className='text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight'>
								${product.price}
							</span>
						</div>

						{/* Description */}
						{product.description && (
							<div className='space-y-2'>
								<h2 className='text-sm uppercase tracking-widest text-zinc-500 font-light'>
									Description
								</h2>
								<p className='text-sm sm:text-base text-zinc-400 leading-relaxed font-light'>
									{product.description}
								</p>
							</div>
						)}

						{/* Image Count Info */}
						{allImages.length > 1 && (
							<div className='text-zinc-500 text-xs sm:text-sm font-light'>
								{allImages.length} images available
							</div>
						)}

						{/* Action Buttons */}
						<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
							{/* Add to Cart Button */}
							<button
								onClick={handleAddToCart}
								disabled={(isInCart && user) || isOutOfStock}
								className={`group relative flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 
								text-sm sm:text-base font-medium uppercase tracking-wide
								transition-all duration-300 overflow-hidden flex-1
								${isOutOfStock
									? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
									: (isInCart && user)
										? 'bg-zinc-900 text-white border border-zinc-800 cursor-default'
										: 'bg-white text-black hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700'
								}`}
							>
								{isOutOfStock ? (
									<>
										<PackageX size={20} className='mr-3' strokeWidth={1.5} />
										<span>Out of Stock</span>
									</>
								) : (!isInCart || !user) ? (
									<>
										<div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
										<ShoppingCart size={20} className='mr-3 relative z-10' strokeWidth={1.5} />
										<span className='relative z-10'>Add to Cart</span>
									</>
								) : (
									<>
										<Check size={20} className='mr-3' strokeWidth={1.5} />
										<span>In Cart</span>
									</>
								)}
							</button>

							{/* WhatsApp Button */}
							<button
								onClick={handleWhatsApp}
								className='group relative flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 
								text-sm sm:text-base font-medium uppercase tracking-wide
								bg-zinc-900 border border-zinc-800 hover:border-green-600 hover:bg-green-600/10
								transition-all duration-300 overflow-hidden sm:flex-shrink-0'
								title="Chat on WhatsApp"
							>
								<MessageCircle size={20} className='mr-3 text-green-500' strokeWidth={1.5} />
								<span className='text-white'>WhatsApp Order</span>
							</button>
						</div>
					</div>
				</motion.div>

				{/* Lightbox Modal - Now works for all products */}
				<AnimatePresence>
					{isLightboxOpen && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center'
							onClick={handleCloseLightbox}
						>
							{/* Image Counter - Top Center */}
							{allImages.length > 1 && (
								<div className='fixed top-4 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-light tracking-wide z-[10002] rounded-full border border-white/20 shadow-2xl'>
									{lightboxImageIndex + 1} / {allImages.length}
								</div>
							)}

							{/* Helper Text and Close Button Group */}
							<div className='fixed top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[10002]'>
								<div className='text-white/60 text-xs sm:text-sm font-light tracking-wide'>
									Click "here" to close
								</div>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleCloseLightbox();
									}}
									className='text-white hover:text-zinc-400 transition-colors
									w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-black/90 backdrop-blur-md border border-white/30 hover:bg-white/10 rounded-full shadow-2xl'
									aria-label='Close lightbox'
								>
									<X size={24} className='sm:hidden' strokeWidth={2} />
									<X size={28} className='hidden sm:block' strokeWidth={2} />
								</button>
							</div>

							{/* Main Lightbox Image */}
							<div 
								className='relative w-full h-full flex items-center justify-center px-4 sm:px-16 py-20'
								onClick={(e) => e.stopPropagation()}
							>
								<AnimatePresence mode='wait'>
									<motion.img
										key={lightboxImageIndex}
										src={allImages[lightboxImageIndex]}
										alt={`${product.name} - Full size ${lightboxImageIndex + 1}`}
										className='max-h-[80vh] max-w-full object-contain'
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
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
											className='fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 
											w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
											bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 rounded-full
											text-white transition-all z-[10001]'
											aria-label='Previous image'
										>
											<ChevronLeft size={20} className='sm:hidden' strokeWidth={1.5} />
											<ChevronLeft size={24} className='hidden sm:block' strokeWidth={1.5} />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleLightboxNext();
											}}
											className='fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 
											w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
											bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 rounded-full
											text-white transition-all z-[10001]'
											aria-label='Next image'
										>
											<ChevronRight size={20} className='sm:hidden' strokeWidth={1.5} />
											<ChevronRight size={24} className='hidden sm:block' strokeWidth={1.5} />
										</button>
									</>
								)}
							</div>

							{/* Thumbnail Strip at Bottom - Mobile Friendly */}
							{allImages.length > 1 && (
								<div className='fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/80 backdrop-blur-sm p-2 sm:p-3 max-w-[90vw] overflow-x-auto z-[10001] rounded-lg snap-x snap-mandatory scrollbar-hide'>
									{allImages.map((image, index) => (
										<button
											key={index}
											onClick={(e) => {
												e.stopPropagation();
												setLightboxImageIndex(index);
											}}
											className={`flex-shrink-0 overflow-hidden border transition-all rounded snap-start ${
												lightboxImageIndex === index
													? 'border-white scale-110'
													: 'border-zinc-700 hover:border-zinc-500'
											}`}
										>
											<img
												src={image}
												alt={`Thumbnail ${index + 1}`}
												className='w-12 h-12 sm:w-16 sm:h-16 object-cover'
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
