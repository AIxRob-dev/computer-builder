import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, X, Image, Star, TrendingUp, Package } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["GTA-Series", "Animes-Series", "Valorant", "Maths", "RDR2", "Explore"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
		additionalImages: [],
		isFeatured: false,
		isBestSeller: false,
		inStock: true,
	});

	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createProduct(newProduct);
			setNewProduct({ 
				name: "", 
				description: "", 
				price: "", 
				category: "", 
				image: "",
				additionalImages: [],
				isFeatured: false,
				isBestSeller: false,
				inStock: true,
			});
		} catch {
			console.log("error creating a product");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAdditionalImagesChange = (e) => {
		const files = Array.from(e.target.files);
		const currentAdditionalImages = newProduct.additionalImages.length;
		const remainingSlots = 3 - currentAdditionalImages;

		if (remainingSlots <= 0) {
			alert("You can only upload maximum 3 additional images!");
			return;
		}

		const filesToProcess = files.slice(0, remainingSlots);

		filesToProcess.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewProduct((prev) => ({
					...prev,
					additionalImages: [...prev.additionalImages, reader.result],
				}));
			};
			reader.readAsDataURL(file);
		});

		e.target.value = "";
	};

	const removeAdditionalImage = (indexToRemove) => {
		setNewProduct((prev) => ({
			...prev,
			additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove),
		}));
	};

	const removeMainImage = () => {
		setNewProduct({ ...newProduct, image: "" });
	};

	return (
		<motion.div
			className='bg-zinc-950/50 border border-zinc-800/50 p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			{/* Header */}
			<div className='mb-8 sm:mb-10'>
				<div className='flex items-center gap-3 mb-2'>
					<div className='h-[1px] w-8 bg-zinc-700' />
					<h2 className='text-xs uppercase tracking-[0.3em] text-zinc-500 font-light'>
						New Product
					</h2>
				</div>
				<p className='text-xl sm:text-2xl font-light text-white tracking-tight'>
					Create Product
				</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-6 sm:space-y-8'>
				{/* Basic Information Section */}
				<div className='space-y-5'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='h-[1px] w-4 bg-zinc-800' />
						<span className='text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-light'>
							Basic Information
						</span>
					</div>

					{/* Product Name */}
					<div>
						<label htmlFor='name' className='block text-xs uppercase tracking-wider text-zinc-500 font-light mb-2'>
							Product Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={newProduct.name}
							onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
							className='w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white font-light
							focus:outline-none focus:border-white transition-colors duration-200
							placeholder:text-zinc-700'
							placeholder='Enter product name'
							required
						/>
					</div>

					{/* Description */}
					<div>
						<label htmlFor='description' className='block text-xs uppercase tracking-wider text-zinc-500 font-light mb-2'>
							Description
						</label>
						<textarea
							id='description'
							name='description'
							value={newProduct.description}
							onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
							rows='4'
							className='w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white font-light
							focus:outline-none focus:border-white transition-colors duration-200
							placeholder:text-zinc-700 resize-none'
							placeholder='Enter product description'
							required
						/>
					</div>

					{/* Price & Category Grid */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
						{/* Price */}
						<div>
							<label htmlFor='price' className='block text-xs uppercase tracking-wider text-zinc-500 font-light mb-2'>
								Price
							</label>
							<input
								type='number'
								id='price'
								name='price'
								value={newProduct.price}
								onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
								step='0.01'
								className='w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white font-light
								focus:outline-none focus:border-white transition-colors duration-200
								placeholder:text-zinc-700'
								placeholder='0.00'
								required
							/>
						</div>

						{/* Category */}
						<div>
							<label htmlFor='category' className='block text-xs uppercase tracking-wider text-zinc-500 font-light mb-2'>
								Category
							</label>
							<select
								id='category'
								name='category'
								value={newProduct.category}
								onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
								className='w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white font-light
								focus:outline-none focus:border-white transition-colors duration-200
								appearance-none cursor-pointer'
								required
							>
								<option value='' className='bg-zinc-900'>Select category</option>
								{categories.map((category) => (
									<option key={category} value={category} className='bg-zinc-900'>
										{category}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* Images Section */}
				<div className='space-y-5 pt-6 border-t border-zinc-800/50'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='h-[1px] w-4 bg-zinc-800' />
						<span className='text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-light'>
							Product Images
						</span>
					</div>

					{/* Main Image Upload */}
					<div>
						<label className='block text-xs uppercase tracking-wider text-zinc-500 font-light mb-3'>
							Main Image <span className='text-white'>*</span>
						</label>
						
						{!newProduct.image ? (
							<label
								htmlFor='image'
								className='group relative block w-full h-48 sm:h-56 border-2 border-dashed border-zinc-800 
								hover:border-zinc-700 transition-colors cursor-pointer overflow-hidden'
							>
								<input 
									type='file' 
									id='image' 
									className='sr-only' 
									accept='image/*' 
									onChange={handleImageChange} 
								/>
								<div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900/30 
								group-hover:bg-zinc-900/50 transition-colors'>
									<Upload className='w-8 h-8 text-zinc-700 group-hover:text-zinc-600' strokeWidth={1.5} />
									<div className='text-center'>
										<p className='text-sm text-zinc-600 font-light'>Click to upload main image</p>
										<p className='text-xs text-zinc-700 mt-1'>PNG, JPG, WEBP up to 10MB</p>
									</div>
								</div>
							</label>
						) : (
							<div className='relative group'>
								<div className='relative w-full h-48 sm:h-56 border border-zinc-800 overflow-hidden'>
									<img
										src={newProduct.image}
										alt='Main product'
										className='w-full h-full object-cover'
									/>
									<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity' />
								</div>
								<button
									type='button'
									onClick={removeMainImage}
									className='absolute top-2 right-2 p-1.5 bg-zinc-900/90 border border-zinc-700 text-white 
									hover:bg-red-600 hover:border-red-600 transition-colors'
								>
									<X className='h-4 w-4' strokeWidth={1.5} />
								</button>
								<div className='absolute bottom-2 left-2 px-2 py-1 bg-white text-black text-[10px] 
								uppercase tracking-uppercase tracking-wider font-light'>
									Main Image
								</div>
							</div>
						)}
					</div>

					{/* Additional Images Upload */}
					<div>
						<label className='block text-xs uppercase tracking-wider text-zinc-500 font-light mb-3'>
							Additional Images (Max 3)
						</label>
						
						<div className='space-y-3'>
							{/* Upload Button */}
							{newProduct.additionalImages.length < 3 && (
								<label
									htmlFor='additionalImages'
									className={`group relative block w-full h-32 border-2 border-dashed border-zinc-800 
									hover:border-zinc-700 transition-colors cursor-pointer overflow-hidden
									${newProduct.additionalImages.length >= 3 ? 'opacity-50 pointer-events-none' : ''}`}
								>
									<input 
										type='file' 
										id='additionalImages' 
										className='sr-only' 
										accept='image/*' 
										onChange={handleAdditionalImagesChange}
										multiple
										disabled={newProduct.additionalImages.length >= 3}
									/>
									<div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-900/30 
									group-hover:bg-zinc-900/50 transition-colors'>
										<Image className='w-6 h-6 text-zinc-700 group-hover:text-zinc-600' strokeWidth={1.5} />
										<p className='text-xs text-zinc-600 font-light'>
											Add more ({newProduct.additionalImages.length}/3)
										</p>
									</div>
								</label>
							)}

							{/* Additional Images Grid */}
							{newProduct.additionalImages.length > 0 && (
								<div className='grid grid-cols-3 gap-3'>
									{newProduct.additionalImages.map((img, index) => (
										<div key={index} className='relative group'>
											<div className='relative w-full aspect-square border border-zinc-800 overflow-hidden'>
												<img
													src={img}
													alt={`Additional ${index + 1}`}
													className='w-full h-full object-cover'
												/>
												<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity' />
											</div>
											<button
												type='button'
												onClick={() => removeAdditionalImage(index)}
												className='absolute top-1 right-1 p-1 bg-zinc-900/90 border border-zinc-700 text-white 
												hover:bg-red-600 hover:border-red-600 transition-colors'
											>
												<X className='h-3 w-3' strokeWidth={1.5} />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Display Options Section */}
				<div className='space-y-4 pt-6 border-t border-zinc-800/50'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='h-[1px] w-4 bg-zinc-800' />
						<span className='text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-light'>
							Display Options
						</span>
					</div>
					
					<div className='space-y-3'>
						{/* Stock Status Toggle */}
						<div className='flex items-center justify-between bg-zinc-900/30 border border-zinc-800 p-4 
						hover:bg-zinc-900/50 transition-colors group'>
							<div className='flex items-center gap-3'>
								<div className={`p-2 border transition-colors ${
									newProduct.inStock 
										? 'bg-zinc-900 border-zinc-700 text-white' 
										: 'bg-zinc-900 border-zinc-800 text-zinc-600'
								}`}>
									<Package className='h-5 w-5' strokeWidth={1.5} />
								</div>
								<div>
									<p className='text-sm font-light text-white tracking-wide'>In Stock</p>
									<p className='text-xs text-zinc-600 font-light mt-0.5'>Available for purchase</p>
								</div>
							</div>
							<button
								type='button'
								onClick={() => setNewProduct({ ...newProduct, inStock: !newProduct.inStock })}
								className={`relative inline-flex h-6 w-11 items-center transition-colors border
								focus:outline-none focus:border-white ${
									newProduct.inStock 
										? 'bg-white border-white' 
										: 'bg-zinc-900 border-zinc-800'
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform transition-transform ${
										newProduct.inStock 
											? 'translate-x-6 bg-black' 
											: 'translate-x-1 bg-zinc-700'
									}`}
								/>
							</button>
						</div>

						{/* Featured Product Toggle */}
						<div className='flex items-center justify-between bg-zinc-900/30 border border-zinc-800 p-4 
						hover:bg-zinc-900/50 transition-colors group'>
							<div className='flex items-center gap-3'>
								<div className={`p-2 border transition-colors ${
									newProduct.isFeatured 
										? 'bg-white border-white text-black' 
										: 'bg-zinc-900 border-zinc-800 text-zinc-600'
								}`}>
									<Star className='h-5 w-5' strokeWidth={1.5} fill={newProduct.isFeatured ? 'currentColor' : 'none'} />
								</div>
								<div>
									<p className='text-sm font-light text-white tracking-wide'>Featured Product</p>
									<p className='text-xs text-zinc-600 font-light mt-0.5'>Show on homepage hero</p>
								</div>
							</div>
							<button
								type='button'
								onClick={() => setNewProduct({ ...newProduct, isFeatured: !newProduct.isFeatured })}
								className={`relative inline-flex h-6 w-11 items-center transition-colors border
								focus:outline-none focus:border-white ${
									newProduct.isFeatured 
										? 'bg-white border-white' 
										: 'bg-zinc-900 border-zinc-800'
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform transition-transform ${
										newProduct.isFeatured 
											? 'translate-x-6 bg-black' 
											: 'translate-x-1 bg-zinc-700'
									}`}
								/>
							</button>
						</div>

						{/* Best Seller Toggle */}
						<div className='flex items-center justify-between bg-zinc-900/30 border border-zinc-800 p-4 
						hover:bg-zinc-900/50 transition-colors group'>
							<div className='flex items-center gap-3'>
								<div className={`p-2 border transition-colors ${
									newProduct.isBestSeller 
										? 'bg-white border-white text-black' 
										: 'bg-zinc-900 border-zinc-800 text-zinc-600'
								}`}>
									<TrendingUp className='h-5 w-5' strokeWidth={1.5} />
								</div>
								<div>
									<p className='text-sm font-light text-white tracking-wide'>Best Seller</p>
									<p className='text-xs text-zinc-600 font-light mt-0.5'>Show in best sellers</p>
								</div>
							</div>
							<button
								type='button'
								onClick={() => setNewProduct({ ...newProduct, isBestSeller: !newProduct.isBestSeller })}
								className={`relative inline-flex h-6 w-11 items-center transition-colors border
								focus:outline-none focus:border-white ${
									newProduct.isBestSeller 
										? 'bg-white border-white' 
										: 'bg-zinc-900 border-zinc-800'
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform transition-transform ${
										newProduct.isBestSeller 
											? 'translate-x-6 bg-black' 
											: 'translate-x-1 bg-zinc-700'
									}`}
								/>
							</button>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<button
					type='submit'
					className='group relative w-full flex items-center justify-center px-8 py-4 text-sm uppercase tracking-wide
					font-light overflow-hidden border transition-all duration-300
					disabled:opacity-50 disabled:cursor-not-allowed
					bg-white border-white text-black hover:bg-zinc-900 hover:text-white'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' strokeWidth={1.5} />
							<span>Creating...</span>
						</>
					) : (
						<>
							<div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
							<PlusCircle className='mr-2 h-5 w-5 relative z-10' strokeWidth={1.5} />
							<span className='relative z-10'>Create Product</span>
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};

export default CreateProductForm;
