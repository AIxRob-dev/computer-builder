import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn, Check, MessageCircle, PackageX, Truck, Shield, RotateCcw, Cpu, Monitor, HardDrive, Zap, Box, Fan, Computer } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";
import ProductRecommendations from "../components/ProductRecommendations";

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

	const isInCart = cart.some(item => item._id === product?._id);
	const isOutOfStock = product?.inStock === false;

	useEffect(() => {
		const loadProduct = async () => {
			setLoading(true);
			
			let foundProduct = products.find(p => p._id === id);
			
			if (!foundProduct) {
				foundProduct = await fetchProductById(id);
			}
			
			setProduct(foundProduct);

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
			`Hi! I'm interested in this product:\n${product.name}\nPrice: ₹${product.price}\nLink: ${window.location.href}`
		);
		const phoneNumber = "1234567890";
		window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
	};

	const handleGoBack = () => {
		navigate(-1);
	};

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

	const hasConfigurations = product?.configurations && Object.values(product.configurations).some(value => value && value.trim() !== '');

	const configurationItems = [
		{ key: 'processor', label: 'Processor', icon: Cpu },
		{ key: 'motherboard', label: 'Motherboard', icon: Computer },
		{ key: 'ram', label: 'RAM', icon: Zap },
		{ key: 'storage', label: 'Storage', icon: HardDrive },
		{ key: 'graphicsCard', label: 'Graphics Card', icon: Monitor },
		{ key: 'powerSupply', label: 'Power Supply', icon: Zap },
		{ key: 'caseType', label: 'Case', icon: Box },
		{ key: 'cooling', label: 'Cooling', icon: Fan },
		{ key: 'operatingSystem', label: 'Operating System', icon: Computer },
	];

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4'></div>
					<p className='text-xl text-gray-600'>Loading product...</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-2xl text-gray-900 mb-4'>Product not found</p>
					<button 
						onClick={() => navigate('/')}
						className='text-blue-600 hover:text-blue-700 transition-colors'
					>
						Return to Home
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='py-4 sm:py-6 lg:py-8'>
				<div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-6'>
					<motion.button
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						onClick={handleGoBack}
						className='flex items-center text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 group transition-colors'
					>
						<ArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' size={20} />
						<span className='text-sm sm:text-base'>Back to Products</span>
					</motion.button>

					{isOutOfStock && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='mb-4 sm:mb-6 bg-red-50 border border-red-200 py-3 px-4 sm:px-6 rounded-lg'
						>
							<div className='flex items-center justify-center gap-2'>
								<PackageX className='w-5 h-5 text-red-600' />
								<span className='text-sm sm:text-base font-medium text-red-700'>
									This product is currently out of stock
								</span>
							</div>
						</motion.div>
					)}

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10'
					>
						<div className='space-y-3 sm:space-y-4'>
							<div 
								className='relative overflow-hidden bg-white border border-gray-200 rounded-lg group'
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
										className='relative aspect-square cursor-zoom-in'
										onClick={() => handleOpenLightbox(selectedImageIndex)}
									>
										<img
											src={allImages[selectedImageIndex]}
											alt={`${product.name} - Image ${selectedImageIndex + 1}`}
											className={`w-full h-full object-contain p-4 sm:p-6 transition-transform ${
												isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'
											}`}
										/>
										
										<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all flex items-center justify-center'>
											<ZoomIn 
												size={40} 
												className='text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity' 
											/>
										</div>

										{isOutOfStock && (
											<div className='absolute inset-0 flex items-center justify-center bg-white/80'>
												<div className='text-center'>
													<PackageX className='w-12 h-12 text-gray-400 mx-auto mb-2' strokeWidth={1.5} />
													<p className='text-gray-600 text-sm font-semibold'>Currently Unavailable</p>
												</div>
											</div>
										)}
									</motion.div>
								</AnimatePresence>

								{allImages.length > 1 && (
									<>
										<button
											onClick={handlePreviousImage}
											className='hidden sm:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 
											w-10 h-10 items-center justify-center
											bg-white/90 backdrop-blur-sm border border-gray-300 hover:bg-white
											text-gray-700 transition-all z-10 rounded-full shadow-md'
											aria-label='Previous image'
										>
											<ChevronLeft size={20} />
										</button>
										<button
											onClick={handleNextImage}
											className='hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 
											w-10 h-10 items-center justify-center
											bg-white/90 backdrop-blur-sm border border-gray-300 hover:bg-white
											text-gray-700 transition-all z-10 rounded-full shadow-md'
											aria-label='Next image'
										>
											<ChevronRight size={20} />
										</button>

										<div className='absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-full'>
											{selectedImageIndex + 1} / {allImages.length}
										</div>
									</>
								)}

								{allImages.length > 1 && (
									<div className='sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2'>
										<div className='flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-wider bg-white/90 px-3 py-1 rounded-full'>
											<div className='w-4 h-[1px] bg-gray-300' />
											<span>Swipe</span>
											<div className='w-4 h-[1px] bg-gray-300' />
										</div>
									</div>
								)}
							</div>

							{allImages.length > 1 && (
								<>
									<div className='hidden sm:grid sm:grid-cols-5 lg:grid-cols-4 gap-2'>
										{allImages.map((image, index) => (
											<button
												key={index}
												onClick={() => setSelectedImageIndex(index)}
												className={`relative overflow-hidden border transition-all aspect-square rounded ${
													selectedImageIndex === index
														? 'border-blue-600 ring-2 ring-blue-600'
														: 'border-gray-200 hover:border-gray-300'
												}`}
											>
												<img
													src={image}
													alt={`Thumbnail ${index + 1}`}
													className='w-full h-full object-contain p-2 bg-white'
												/>
												{index === 0 && (
													<span className='absolute top-1 left-1 bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded'>
														Main
													</span>
												)}
											</button>
										))}
									</div>

									<div className='sm:hidden flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-3 px-3'>
										{allImages.map((image, index) => (
											<button
												key={index}
												onClick={() => setSelectedImageIndex(index)}
												className={`relative overflow-hidden border transition-all aspect-square flex-shrink-0 w-20 h-20 snap-start rounded ${
													selectedImageIndex === index
														? 'border-blue-600 ring-2 ring-blue-600'
														: 'border-gray-200'
												}`}
											>
												<img
													src={image}
													alt={`Thumbnail ${index + 1}`}
													className='w-full h-full object-contain p-1.5 bg-white'
												/>
												{index === 0 && (
													<span className='absolute top-0.5 left-0.5 bg-blue-100 text-blue-700 text-[8px] px-1.5 py-0.5 rounded'>
														Main
													</span>
												)}
											</button>
										))}
									</div>
								</>
							)}
						</div>

						<div className='flex flex-col space-y-4 sm:space-y-5'>
							{product.category && (
								<div>
									<span className='text-xs uppercase tracking-wider text-blue-600 font-semibold'>
										{product.category}
									</span>
								</div>
							)}

							<h1 className='text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 leading-tight'>
								{product.name}
							</h1>

							<div className='border-t border-b border-gray-200 py-4 sm:py-5'>
								<div className='flex items-baseline gap-2 mb-2'>
									<span className='text-xs align-super text-gray-900'>₹</span>
									<span className={`text-3xl sm:text-4xl lg:text-5xl font-normal ${
										isOutOfStock ? 'text-gray-400' : 'text-gray-900'
									}`}>
										{product.price.toLocaleString()}
									</span>
								</div>
								<div className='flex items-center gap-2 flex-wrap mb-3'>
									<span className='text-sm text-gray-600'>M.R.P:</span>
									<span className='text-sm text-gray-600 line-through'>
										₹{Math.round(product.price * 1.3).toLocaleString()}
									</span>
									<span className='text-sm text-red-700 font-semibold'>(23% off)</span>
								</div>
								{!isOutOfStock && (
									<div className='inline-block bg-red-100 text-red-700 text-sm font-semibold px-3 py-1.5 rounded'>
										Limited Time Offer - Save ₹{Math.round(product.price * 0.3).toLocaleString()}
									</div>
								)}
							</div>

							{!isOutOfStock ? (
								<div className='bg-green-50 border border-green-200 rounded-lg p-4 sm:p-5'>
									<div className='flex items-start gap-3 mb-4'>
										<div className='flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
											<Check className='w-5 h-5 text-green-700' strokeWidth={2.5} />
										</div>
										<div>
											<p className='text-base font-semibold text-green-900 mb-1'>In Stock - Ready to Ship</p>
											<p className='text-sm text-green-700'>Ships within 24 hours</p>
										</div>
									</div>
									<div className='space-y-2.5 text-sm text-gray-700'>
										<div className='flex items-center gap-2.5'>
											<Truck className='w-4 h-4 text-green-600 flex-shrink-0' strokeWidth={2} />
											<span>Free shipping on this product</span>
										</div>
										<div className='flex items-center gap-2.5'>
											<Shield className='w-4 h-4 text-green-600 flex-shrink-0' strokeWidth={2} />
											<span>1 Year Warranty Included</span>
										</div>
										<div className='flex items-center gap-2.5'>
											<RotateCcw className='w-4 h-4 text-green-600 flex-shrink-0' strokeWidth={2} />
											<span>7-Day Easy Returns</span>
										</div>
									</div>
								</div>
							) : (
								<div className='bg-gray-100 border border-gray-300 rounded-lg p-4 sm:p-5'>
									<div className='flex items-center gap-3'>
										<PackageX className='w-5 h-5 text-gray-500' />
										<span className='text-base font-medium text-gray-700'>Currently Out of Stock</span>
									</div>
								</div>
							)}

							{product.description && (
								<div className='space-y-2 pt-2'>
									<h2 className='text-sm font-semibold uppercase tracking-wide text-gray-700'>
										About this item
									</h2>
									<p className='text-sm text-gray-700 leading-relaxed'>
										{product.description}
									</p>
								</div>
							)}

							<div className='flex flex-col sm:flex-row gap-3 pt-2'>
								<button
									onClick={handleAddToCart}
									disabled={(isInCart && user) || isOutOfStock}
									className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-lg text-base font-medium transition-all
									${isOutOfStock
										? 'bg-gray-200 text-gray-500 cursor-not-allowed'
										: (isInCart && user)
											? 'bg-gray-100 text-gray-700 border-2 border-gray-300'
											: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
									}`}
								>
									{isOutOfStock ? (
										<>
											<PackageX className='w-5 h-5' />
											<span>Out of Stock</span>
										</>
									) : (!isInCart || !user) ? (
										<>
											<ShoppingCart className='w-5 h-5' />
											<span>Add to Cart</span>
										</>
									) : (
										<>
											<Check className='w-5 h-5' />
											<span>In Cart</span>
										</>
									)}
								</button>

								<button
									onClick={handleWhatsApp}
									disabled={isOutOfStock}
									className={`flex-shrink-0 sm:min-w-[180px] flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-lg text-base font-medium transition-all
									${isOutOfStock
										? 'bg-gray-100 text-gray-400 cursor-not-allowed'
										: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg active:scale-95'
									}`}
									title="Chat on WhatsApp"
								>
									<MessageCircle className='w-5 h-5' />
									<span>WhatsApp</span>
								</button>
							</div>
						</div>
					</motion.div>

					{hasConfigurations && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='mt-8 sm:mt-12'
						>
							<div className='bg-white border border-gray-200 rounded-lg p-6 sm:p-8'>
								<div className='flex items-center gap-3 mb-6'>
									<Cpu className='w-6 h-6 text-blue-600' strokeWidth={1.5} />
									<h2 className='text-xl sm:text-2xl font-semibold text-gray-900'>
										Technical Specifications
									</h2>
								</div>
								
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5'>
									{configurationItems.map(({ key, label, icon: Icon }) => {
										const value = product.configurations[key];
										if (!value || value.trim() === '') return null;
										
										return (
											<div 
												key={key}
												className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all'
											>
												<div className='flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200'>
													<Icon className='w-5 h-5 text-blue-600' strokeWidth={1.5} />
												</div>
												<div className='flex-1 min-w-0'>
													<p className='text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1'>
														{label}
													</p>
													<p className='text-sm text-gray-900 font-medium break-words'>
														{value}
													</p>
												</div>
											</div>
										);
									})}
								</div>

								{product.configurations.additionalSpecs && product.configurations.additionalSpecs.trim() !== '' && (
									<div className='mt-5 p-4 bg-blue-50 rounded-lg border border-blue-200'>
										<h3 className='text-xs uppercase tracking-wide text-blue-700 font-semibold mb-2'>
											Additional Notes
										</h3>
										<p className='text-sm text-gray-700 leading-relaxed whitespace-pre-line'>
											{product.configurations.additionalSpecs}
										</p>
									</div>
								)}
							</div>
						</motion.div>
					)}
				</div>
			</div>

			{/* Recommendations Section */}
			<ProductRecommendations currentProductId={id} />

			{/* Lightbox Modal */}
			<AnimatePresence>
				{isLightboxOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center'
						onClick={handleCloseLightbox}
					>
						{allImages.length > 1 && (
							<div className='fixed top-4 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm tracking-wide z-[10002] rounded-full border border-white/20 shadow-2xl'>
								{lightboxImageIndex + 1} / {allImages.length}
							</div>
						)}

						<button
							onClick={(e) => {
								e.stopPropagation();
								handleCloseLightbox();
							}}
							className='fixed top-4 right-4 text-white hover:text-gray-300 transition-colors
							w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-black/90 backdrop-blur-md border border-white/30 hover:bg-white/10 rounded-full shadow-2xl z-[10002]'
							aria-label='Close lightbox'
						>
							<X size={24} className='sm:hidden' strokeWidth={2} />
							<X size={28} className='hidden sm:block' strokeWidth={2} />
						</button>

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

							{allImages.length > 1 && (
								<>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleLightboxPrevious();
										}}
										className='fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 
										w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
										bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full
										text-white transition-all z-[10001]'
										aria-label='Previous image'
									>
										<ChevronLeft size={20} className='sm:hidden' />
										<ChevronLeft size={24} className='hidden sm:block' />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleLightboxNext();
										}}
										className='fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 
										w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
										bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full
										text-white transition-all z-[10001]'
										aria-label='Next image'
									>
										<ChevronRight size={20} className='sm:hidden' />
										<ChevronRight size={24} className='hidden sm:block' />
									</button>
								</>
							)}
						</div>

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
												: 'border-gray-600 hover:border-gray-400'
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
	);
};

export default ProductDetailPage;