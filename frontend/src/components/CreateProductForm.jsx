import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, X, Image, Star, TrendingUp } from "lucide-react";
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
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				{/* Main Image Upload */}
				<div>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						Main Product Image <span className='text-red-400'>*</span>
					</label>
					<div className='mt-1 flex items-center gap-4'>
						<input 
							type='file' 
							id='image' 
							className='sr-only' 
							accept='image/*' 
							onChange={handleImageChange} 
						/>
						<label
							htmlFor='image'
							className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
						>
							<Upload className='h-5 w-5 inline-block mr-2' />
							Upload Main Image
						</label>
					</div>

					{newProduct.image && (
						<div className='mt-3 relative inline-block'>
							<img
								src={newProduct.image}
								alt='Main product'
								className='w-32 h-32 object-cover rounded-lg border-2 border-emerald-500'
							/>
							<button
								type='button'
								onClick={removeMainImage}
								className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
							>
								<X className='h-4 w-4' />
							</button>
							<span className='absolute bottom-0 left-0 right-0 bg-emerald-600 bg-opacity-90 text-white text-xs text-center py-1 rounded-b-lg'>
								Main Image
							</span>
						</div>
					)}
				</div>

				{/* Additional Images Upload */}
				<div>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						Additional Images (Optional - Max 3)
					</label>
					<div className='mt-1 flex items-center gap-4'>
						<input 
							type='file' 
							id='additionalImages' 
							className='sr-only' 
							accept='image/*' 
							onChange={handleAdditionalImagesChange}
							multiple
							disabled={newProduct.additionalImages.length >= 3}
						/>
						<label
							htmlFor='additionalImages'
							className={`cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
								newProduct.additionalImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
							}`}
						>
							<Image className='h-5 w-5 inline-block mr-2' />
							Add More Images ({newProduct.additionalImages.length}/3)
						</label>
					</div>

					{newProduct.additionalImages.length > 0 && (
						<div className='mt-3 grid grid-cols-3 gap-3'>
							{newProduct.additionalImages.map((img, index) => (
								<div key={index} className='relative'>
									<img
										src={img}
										alt={`Additional ${index + 1}`}
										className='w-full h-32 object-cover rounded-lg border-2 border-gray-600'
									/>
									<button
										type='button'
										onClick={() => removeAdditionalImage(index)}
										className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
									>
										<X className='h-4 w-4' />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* NEW: Display Options Section */}
				<div className='border-t border-gray-700 pt-4'>
					<label className='block text-sm font-medium text-gray-300 mb-3'>
						Product Display Options
					</label>
					
					<div className='space-y-3'>
						{/* Featured Product Toggle */}
						<div className='flex items-center justify-between bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors'>
							<div className='flex items-center space-x-3'>
								<div className='p-2 bg-yellow-500/10 rounded-lg'>
									<Star className='h-5 w-5 text-yellow-400' />
								</div>
								<div>
									<p className='text-sm font-medium text-white'>Featured Product</p>
									<p className='text-xs text-gray-400'>Show on homepage hero section</p>
								</div>
							</div>
							<button
								type='button'
								onClick={() => setNewProduct({ ...newProduct, isFeatured: !newProduct.isFeatured })}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
									newProduct.isFeatured ? 'bg-emerald-500' : 'bg-gray-600'
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										newProduct.isFeatured ? 'translate-x-6' : 'translate-x-1'
									}`}
								/>
							</button>
						</div>

						{/* Best Seller Toggle */}
						<div className='flex items-center justify-between bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors'>
							<div className='flex items-center space-x-3'>
								<div className='p-2 bg-blue-500/10 rounded-lg'>
									<TrendingUp className='h-5 w-5 text-blue-400' />
								</div>
								<div>
									<p className='text-sm font-medium text-white'>Best Seller</p>
									<p className='text-xs text-gray-400'>Show in best sellers section</p>
								</div>
							</div>
							<button
								type='button'
								onClick={() => setNewProduct({ ...newProduct, isBestSeller: !newProduct.isBestSeller })}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
									newProduct.isBestSeller ? 'bg-blue-500' : 'bg-gray-600'
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										newProduct.isBestSeller ? 'translate-x-6' : 'translate-x-1'
									}`}
								/>
							</button>
						</div>
					</div>
				</div>

				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};

export default CreateProductForm;