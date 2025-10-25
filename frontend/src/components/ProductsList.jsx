import { motion } from "framer-motion";
import { Trash, Star, Package } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, toggleStockStatus, products } = useProductStore();
    console.log("products", products);

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(productId);
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    const handleToggleFeatured = async (productId) => {
        try {
            await toggleFeaturedProduct(productId);
        } catch (error) {
            console.error("Error toggling featured status:", error);
            alert("Failed to update featured status. Please try again.");
        }
    };

    const handleToggleStock = async (productId) => {
        try {
            await toggleStockStatus(productId);
        } catch (error) {
            console.error("Error toggling stock status:", error);
            alert("Failed to update stock status. Please try again.");
        }
    };

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead className='bg-gray-700'>
                        <tr>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Product
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Price
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Category
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Stock
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Featured
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-800 divide-y divide-gray-700'>
                        {products?.map((product) => (
                            <tr 
                                key={product._id} 
                                className={`hover:bg-gray-700 transition-all ${
                                    !product.inStock ? 'opacity-50' : ''
                                }`}
                            >
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0 h-10 w-10 relative'>
                                            <img
                                                className={`h-10 w-10 rounded-full object-cover ${
                                                    !product.inStock ? 'grayscale' : ''
                                                }`}
                                                src={product.image}
                                                alt={product.name}
                                            />
                                            {!product.inStock && (
                                                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full'>
                                                    <span className='text-[8px] font-bold text-red-400'>OUT</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className='ml-4'>
                                            <div className={`text-sm font-medium ${
                                                product.inStock ? 'text-white' : 'text-gray-500'
                                            }`}>
                                                {product.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className={`text-sm ${
                                        product.inStock ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        ${product.price.toFixed(2)}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className={`text-sm ${
                                        product.inStock ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        {product.category}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => handleToggleStock(product._id)}
                                        className={`p-1 rounded-full ${
                                            product.inStock 
                                                ? "bg-green-500 text-white" 
                                                : "bg-red-500 text-white"
                                        } hover:opacity-80 transition-all duration-200`}
                                        aria-label={product.inStock ? "Mark as out of stock" : "Mark as in stock"}
                                    >
                                        <Package className='h-5 w-5' />
                                    </button>
                                    <span className={`ml-2 text-xs font-medium ${
                                        product.inStock ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => handleToggleFeatured(product._id)}
                                        className={`p-1 rounded-full ${
                                            product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                                        } hover:bg-yellow-500 transition-colors duration-200`}
                                        aria-label={product.isFeatured ? "Remove from featured" : "Add to featured"}
                                    >
                                        <Star className='h-5 w-5' fill={product.isFeatured ? "currentColor" : "none"} />
                                    </button>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className='text-red-400 hover:text-red-300'
                                        aria-label='Delete product'
                                    >
                                        <Trash className='h-5 w-5' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden'>
                {products?.map((product) => (
                    <motion.div
                        key={product._id}
                        className={`bg-gray-750 p-4 border-b border-gray-700 hover:bg-gray-700 transition-all ${
                            !product.inStock ? 'opacity-60' : ''
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className='flex items-start space-x-4'>
                            <div className='relative'>
                                <img
                                    className={`h-16 w-16 rounded-lg object-cover flex-shrink-0 ${
                                        !product.inStock ? 'grayscale' : ''
                                    }`}
                                    src={product.image}
                                    alt={product.name}
                                />
                                {!product.inStock && (
                                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg'>
                                        <span className='text-xs font-bold text-red-400'>OUT</span>
                                    </div>
                                )}
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className={`text-sm font-medium truncate ${
                                    product.inStock ? 'text-white' : 'text-gray-500'
                                }`}>
                                    {product.name}
                                </h3>
                                <p className={`text-lg font-semibold mt-1 ${
                                    product.inStock ? 'text-emerald-400' : 'text-gray-500'
                                }`}>
                                    ${product.price.toFixed(2)}
                                </p>
                                <p className={`text-xs mt-1 ${
                                    product.inStock ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {product.category}
                                </p>
                                <div className='mt-2'>
                                    <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                                        product.inStock 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-2'>
                                <button
                                    onClick={() => handleToggleStock(product._id)}
                                    className={`p-2 rounded-full ${
                                        product.inStock 
                                            ? "bg-green-500 text-white" 
                                            : "bg-red-500 text-white"
                                    } hover:opacity-80 transition-all duration-200`}
                                    aria-label={product.inStock ? "Mark as out of stock" : "Mark as in stock"}
                                >
                                    <Package className='h-4 w-4' />
                                </button>
                                <button
                                    onClick={() => handleToggleFeatured(product._id)}
                                    className={`p-2 rounded-full ${
                                        product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                                    } hover:bg-yellow-500 transition-colors duration-200`}
                                    aria-label={product.isFeatured ? "Remove from featured" : "Add to featured"}
                                >
                                    <Star className='h-4 w-4' fill={product.isFeatured ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className='p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200'
                                    aria-label='Delete product'
                                >
                                    <Trash className='h-4 w-4' />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {(!products || products.length === 0) && (
                <div className='text-center py-12'>
                    <p className='text-gray-400 text-lg'>No products found</p>
                    <p className='text-gray-500 text-sm mt-2'>Create your first product to get started</p>
                </div>
            )}
        </motion.div>
    );
};

export default ProductsList;
