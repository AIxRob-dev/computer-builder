import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, X, Image, Star, TrendingUp, Package, Cpu, Check } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["Office-Pc", "Gaming-Pc", "Rendering-Pc", "Exclusives", "Explore"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: [], // CHANGED: Now an array for multiple categories
		image: "",
		additionalImages: [],
		isFeatured: false,
		isBestSeller: false,
		inStock: true,
		configurations: {
			processor: "",
			motherboard: "",
			ram: "",
			storage: "",
			graphicsCard: "",
			powerSupply: "",
			caseType: "",
			cooling: "",
			operatingSystem: "",
			additionalSpecs: ""
		}
	});

	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Validation: At least one category must be selected
		if (newProduct.category.length === 0) {
			alert("Please select at least one category");
			return;
		}
		
		try {
			await createProduct(newProduct);
			setNewProduct({ 
				name: "", 
				description: "", 
				price: "", 
				category: [], // Reset to empty array
				image: "",
				additionalImages: [],
				isFeatured: false,
				isBestSeller: false,
				inStock: true,
				configurations: {
					processor: "",
					motherboard: "",
					ram: "",
					storage: "",
					graphicsCard: "",
					powerSupply: "",
					caseType: "",
					cooling: "",
					operatingSystem: "",
					additionalSpecs: ""
				}
			});
		} catch {
			console.log("error creating a product");
		}
	};

	// NEW: Handle multiple category selection
	const handleCategoryToggle = (categoryName) => {
		setNewProduct((prev) => {
			const isSelected = prev.category.includes(categoryName);
			if (isSelected) {
				// Remove category
				return {
					...prev,
					category: prev.category.filter((cat) => cat !== categoryName)
				};
			} else {
				// Add category
				return {
					...prev,
					category: [...prev.category, categoryName]
				};
			}
		});
	};

	const handleConfigurationChange = (field, value) => {
		setNewProduct({
			...newProduct,
			configurations: {
				...newProduct.configurations,
				[field]: value
			}
		});
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
			className='bg-white border-2 border-blue-100 rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			{/* Header */}
			<div className='mb-8 sm:mb-10'>
				<div className='flex items-center gap-3 mb-2'>
					<div className='h-[2px] w-8 bg-blue-300' />
					<h2 className='text-xs uppercase tracking-[0.3em] text-blue-600 font-bold'>
						New Product
					</h2>
				</div>
				<p className='text-xl sm:text-2xl font-bold text-gray-900 tracking-tight'>
					Create Product
				</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-6 sm:space-y-8'>
				{/* Basic Information Section */}
				<div className='space-y-5'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='h-[2px] w-4 bg-blue-200' />
						<span className='text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold'>
							Basic Information
						</span>
					</div>

					{/* Product Name */}
					<div>
						<label htmlFor='name' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
							Product Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={newProduct.name}
							onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
							className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
							focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
							placeholder:text-gray-400'
							placeholder='Enter product name'
							required
						/>
					</div>

					{/* Description */}
					<div>
						<label htmlFor='description' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
							Description
						</label>
						<textarea
							id='description'
							name='description'
							value={newProduct.description}
							onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
							rows='4'
							className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
							focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
							placeholder:text-gray-400 resize-none'
							placeholder='Enter product description'
							required
						/>
					</div>

					{/* Price */}
					<div>
						<label htmlFor='price' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
							Price
						</label>
						<input
							type='number'
							id='price'
							name='price'
							value={newProduct.price}
							onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
							step='0.01'
							className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
							focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
							placeholder:text-gray-400'
							placeholder='0.00'
							required
						/>
					</div>

					{/* UPDATED: Multiple Categories Selection */}
					<div>
						<label className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-3'>
							Categories <span className='text-blue-600'>*</span>
							<span className='ml-2 text-[10px] text-gray-500 font-semibold normal-case tracking-normal'>
								(Select at least one)
							</span>
						</label>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
							{categories.map((category) => {
								const isSelected = newProduct.category.includes(category);
								return (
									<button
										key={category}
										type='button'
										onClick={() => handleCategoryToggle(category)}
										className={`relative flex items-center justify-between p-4 border-2 rounded-lg transition-all duration-200
										${isSelected 
											? 'bg-blue-50 border-blue-500 shadow-sm' 
											: 'bg-gray-50 border-gray-200 hover:border-blue-300'
										}`}
									>
										<span className={`text-sm font-bold tracking-wide ${
											isSelected ? 'text-blue-700' : 'text-gray-700'
										}`}>
											{category.replace('-', ' ')}
										</span>
										<div className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all ${
											isSelected 
												? 'bg-blue-600 border-blue-600' 
												: 'bg-white border-gray-300'
										}`}>
											{isSelected && (
												<Check className='w-3 h-3 text-white' strokeWidth={3} />
											)}
										</div>
									</button>
								);
							})}
						</div>
						{newProduct.category.length > 0 && (
							<div className='mt-3 flex flex-wrap gap-2'>
								<span className='text-[10px] uppercase tracking-wider text-gray-500 font-bold'>Selected:</span>
								{newProduct.category.map((cat) => (
									<span 
										key={cat}
										className='inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded'
									>
										{cat.replace('-', ' ')}
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* PC Configurations Section */}
				<div className='space-y-5 pt-6 border-t-2 border-blue-100'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='h-[2px] w-4 bg-blue-200' />
						<span className='text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold flex items-center gap-2'>
							<Cpu className='w-3 h-3' strokeWidth={2} />
							PC Specifications
						</span>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
						{/* Processor */}
						<div>
							<label htmlFor='processor' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								Processor
							</label>
							<input
								type='text'
								id='processor'
								value={newProduct.configurations.processor}
								onChange={(e) => handleConfigurationChange('processor', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., Intel Core i7-13700K'
							/>
						</div>

						{/* Motherboard */}
						<div>
							<label htmlFor='motherboard' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								Motherboard
							</label>
							<input
								type='text'
								id='motherboard'
								value={newProduct.configurations.motherboard}
								onChange={(e) => handleConfigurationChange('motherboard', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., ASUS ROG Strix B650-E'
							/>
						</div>

						{/* RAM */}
						<div>
							<label htmlFor='ram' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								RAM
							</label>
							<input
								type='text'
								id='ram'
								value={newProduct.configurations.ram}
								onChange={(e) => handleConfigurationChange('ram', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., 32GB DDR5 5600MHz'
							/>
						</div>

						{/* Storage */}
						<div>
							<label htmlFor='storage' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								Storage
							</label>
							<input
								type='text'
								id='storage'
								value={newProduct.configurations.storage}
								onChange={(e) => handleConfigurationChange('storage', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., 1TB NVMe SSD + 2TB HDD'
							/>
						</div>

						{/* Graphics Card */}
						<div>
							<label htmlFor='graphicsCard' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								Graphics Card
							</label>
							<input
								type='text'
								id='graphicsCard'
								value={newProduct.configurations.graphicsCard}
								onChange={(e) => handleConfigurationChange('graphicsCard', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., NVIDIA RTX 4070 Ti 12GB'
							/>
						</div>

						{/* Power Supply */}
						<div>
							<label htmlFor='powerSupply' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								Power Supply
							</label>
							<input
								type='text'
								id='powerSupply'
								value={newProduct.configurations.powerSupply}
								onChange={(e) => handleConfigurationChange('powerSupply', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., 750W 80+ Gold'
							/>
						</div>

						{/* Case Type */}
						<div>
							<label htmlFor='caseType' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								Case
							</label>
							<input
								type='text'
								id='caseType'
								value={newProduct.configurations.caseType}
								onChange={(e) => handleConfigurationChange('caseType', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., NZXT H7 Flow'
							/>
						</div>

						{/* Cooling */}
						<div>
							<label htmlFor='cooling' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								Cooling
							</label>
							<input
								type='text'
								id='cooling'
								value={newProduct.configurations.cooling}
								onChange={(e) => handleConfigurationChange('cooling', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., AIO Liquid Cooler 240mm'
							/>
						</div>

						{/* Operating System */}
						<div>
							<label htmlFor='operatingSystem' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
								Operating System
							</label>
							<input
								type='text'
								id='operatingSystem'
								value={newProduct.configurations.operatingSystem}
								onChange={(e) => handleConfigurationChange('operatingSystem', e.target.value)}
								className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
								focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
								placeholder:text-gray-400'
								placeholder='e.g., Windows 11 Pro'
							/>
						</div>
					</div>

					{/* Additional Specs - Full Width */}
					<div>
						<label htmlFor='additionalSpecs' className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-2'>
							Additional Specifications
						</label>
						<textarea
							id='additionalSpecs'
							value={newProduct.configurations.additionalSpecs}
							onChange={(e) => handleConfigurationChange('additionalSpecs', e.target.value)}
							rows='3'
							className='w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-medium
							focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
							placeholder:text-gray-400 resize-none'
							placeholder='Any other specifications or notes...'
						/>
					</div>
				</div>

				{/* Images Section */}
				<div className='space-y-5 pt-6 border-t-2 border-blue-100'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='h-[2px] w-4 bg-blue-200' />
						<span className='text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold'>
							Product Images
						</span>
					</div>

					{/* Main Image Upload */}
					<div>
						<label className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-3'>
							Main Image <span className='text-blue-600'>*</span>
						</label>
						
						{!newProduct.image ? (
							<label
								htmlFor='image'
								className='group relative block w-full h-48 sm:h-56 border-2 border-dashed border-blue-200 rounded-lg
								hover:border-blue-400 transition-colors cursor-pointer overflow-hidden'
							>
								<input 
									type='file' 
									id='image' 
									className='sr-only' 
									accept='image/*' 
									onChange={handleImageChange} 
								/>
								<div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-blue-50/30 
								group-hover:bg-blue-50/50 transition-colors'>
									<Upload className='w-8 h-8 text-blue-400 group-hover:text-blue-500' strokeWidth={2} />
									<div className='text-center'>
										<p className='text-sm text-gray-600 font-semibold'>Click to upload main image</p>
										<p className='text-xs text-gray-500 font-medium mt-1'>PNG, JPG, WEBP up to 10MB</p>
									</div>
								</div>
							</label>
						) : (
							<div className='relative group'>
								<div className='relative w-full h-48 sm:h-56 border-2 border-blue-200 rounded-lg overflow-hidden'>
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
									className='absolute top-2 right-2 p-1.5 bg-white border-2 border-blue-200 text-gray-700 rounded
									hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors'
								>
									<X className='h-4 w-4' strokeWidth={2} />
								</button>
								<div className='absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-[10px] rounded
								uppercase tracking-wider font-bold'>
									Main Image
								</div>
							</div>
						)}
					</div>

					{/* Additional Images Upload */}
					<div>
						<label className='block text-xs uppercase tracking-wider text-gray-700 font-bold mb-3'>
							Additional Images (Max 3)
						</label>
						
						<div className='space-y-3'>
							{/* Upload Button */}
							{newProduct.additionalImages.length < 3 && (
								<label
									htmlFor='additionalImages'
									className={`group relative block w-full h-32 border-2 border-dashed border-blue-200 rounded-lg
									hover:border-blue-400 transition-colors cursor-pointer overflow-hidden
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
									<div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-blue-50/30 
									group-hover:bg-blue-50/50 transition-colors'>
										<Image className='w-6 h-6 text-blue-400 group-hover:text-blue-500' strokeWidth={2} />
										<p className='text-xs text-gray-600 font-semibold'>
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
											<div className='relative w-full aspect-square border-2 border-blue-200 rounded-lg overflow-hidden'>
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
												className='absolute top-1 right-1 p-1 bg-white border-2 border-blue-200 text-gray-700 rounded
												hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors'
											>
												<X className='h-3 w-3' strokeWidth={2} />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Display Options Section */}
				<div className='space-y-4 pt-6 border-t-2 border-blue-100'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='h-[2px] w-4 bg-blue-200' />
						<span className='text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold'>
							Display Options
						</span>
					</div>
					
					<div className='space-y-3'>
						{/* Stock Status Toggle */}
						<div className='flex items-center justify-between bg-blue-50 border-2 border-blue-100 rounded-lg p-4 
						hover:bg-blue-100/50 transition-colors group'>
							<div className='flex items-center gap-3'>
								<div className={`p-2 border-2 rounded transition-colors ${
									newProduct.inStock 
										? 'bg-blue-600 border-blue-600 text-white' 
										: 'bg-white border-gray-200 text-gray-400'
								}`}>
									<Package className='h-5 w-5' strokeWidth={2} />
								</div>
								<div>
									<p className='text-sm font-bold text-gray-900 tracking-wide'>In Stock</p>
									<p className='text-xs text-gray-600 font-semibold mt-0.5'>Available for purchase</p>
								</div>
							</div>
							<button
								type='button'
								onClick={() => setNewProduct({ ...newProduct, inStock: !newProduct.inStock })}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2
								focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
									newProduct.inStock 
										? 'bg-blue-600 border-blue-600' 
										: 'bg-gray-200 border-gray-300'
								}`}
							>
								<span
									className={`inline-block h-4 w-4 rounded-full transform transition-transform ${
										newProduct.inStock 
											? 'translate-x-6 bg-white' 
											: 'translate-x-1 bg-white'
									}`}
								/>
							</button>
						</div>

						{/* Featured Product Toggle */}
						<div className='flex items-center justify-between bg-blue-50 border-2 border-blue-100 rounded-lg p-4 
						hover:bg-blue-100/50 transition-colors group'>
							<div className='flex items-center gap-3'>
								<div className={`p-2 border-2 rounded transition-colors ${
									newProduct.isFeatured 
										? 'bg-blue-600 border-blue-600 text-white' 
										: 'bg-white border-gray-200 text-gray-400'
								}`}>
									<Star className='h-5 w-5' strokeWidth={2} fill={newProduct.isFeatured ? 'currentColor' : 'none'} />
								</div>
								<div>
									<p className='text-sm font-bold text-gray-900 tracking-wide'>Featured Product</p>
									<p className='text-xs text-gray-600 font-semibold mt-0.5'>Show on homepage hero</p>
								</div>
							</div>
							<button
								type='button'
								onClick={() => setNewProduct({ ...newProduct, isFeatured: !newProduct.isFeatured })}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2
								focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
									newProduct.isFeatured 
										? 'bg-blue-600 border-blue-600' 
										: 'bg-gray-200 border-gray-300'
								}`}
							>
								<span
									className={`inline-block h-4 w-4 rounded-full transform transition-transform ${
										newProduct.isFeatured 
											? 'translate-x-6 bg-white' 
											: 'translate-x-1 bg-white'
									}`}
								/>
							</button>
						</div>

						{/* Best Seller Toggle */}
						<div className='flex items-center justify-between bg-blue-50 border-2 border-blue-100 rounded-lg p-4 
						hover:bg-blue-100/50 transition-colors group'>
							<div className='flex items-center gap-3'>
								<div className={`p-2 border-2 rounded transition-colors ${
									newProduct.isBestSeller 
										? 'bg-blue-600 border-blue-600 text-white' 
										: 'bg-white border-gray-200 text-gray-400'
								}`}>
									<TrendingUp className='h-5 w-5' strokeWidth={2} />
								</div>
								<div>
									<p className='text-sm font-bold text-gray-900 tracking-wide'>Best Seller</p>
									<p className='text-xs text-gray-600 font-semibold mt-0.5'>Show in best sellers</p>
								</div>
							</div>
							<button
								type='button'
								onClick={() => setNewProduct({ ...newProduct, isBestSeller: !newProduct.isBestSeller })}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2
								focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
									newProduct.isBestSeller 
										? 'bg-blue-600 border-blue-600' 
										: 'bg-gray-200 border-gray-300'
								}`}
							>
								<span
									className={`inline-block h-4 w-4 rounded-full transform transition-transform ${
										newProduct.isBestSeller 
											? 'translate-x-6 bg-white' 
											: 'translate-x-1 bg-white'
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
					font-bold rounded-lg overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl
					disabled:opacity-50 disabled:cursor-not-allowed
					bg-blue-600 text-white hover:bg-blue-700'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' strokeWidth={2} />
							<span>Creating...</span>
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5 relative z-10' strokeWidth={2} />
							<span className='relative z-10'>Create Product</span>
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};

export default CreateProductForm;