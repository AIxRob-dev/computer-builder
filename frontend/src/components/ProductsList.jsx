import { motion } from "framer-motion";
import { Trash, Star, Package, PackageX } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, toggleStockStatus, products } = useProductStore();

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
            className='bg-white border-2 border-blue-100 rounded-lg overflow-hidden shadow-sm'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Header */}
            <div className='px-4 sm:px-6 py-4 border-b-2 border-blue-100 bg-blue-50'>
                <div className='flex items-center gap-3'>
                    <div className='h-[2px] w-8 bg-blue-600' />
                    <h2 className='text-xs uppercase tracking-[0.3em] text-blue-600 font-bold'>
                        Product Inventory
                    </h2>
                </div>
                <p className='text-sm text-gray-600 mt-2 font-semibold'>
                    {products?.length || 0} products total
                </p>
            </div>

            {/* Desktop Table View */}
            <div className='hidden lg:block overflow-x-auto'>
                <table className='min-w-full divide-y divide-blue-100'>
                    <thead>
                        <tr className='bg-gray-50'>
                            <th className='px-6 py-4 text-left text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]'>
                                Product
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]'>
                                Price
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]'>
                                Category
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]'>
                                Stock
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]'>
                                Featured
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-blue-100'>
                        {products?.map((product) => (
                            <motion.tr 
                                key={product._id}
                                className={`group hover:bg-blue-50 transition-colors duration-200 ${
                                    !product.inStock ? 'opacity-60' : ''
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center gap-4'>
                                        <div className='relative flex-shrink-0'>
                                            <div className='h-12 w-12 border-2 border-blue-100 bg-gray-50 rounded overflow-hidden'>
                                                <img
                                                    className={`h-full w-full object-cover transition-all duration-300 ${
                                                        !product.inStock ? 'grayscale opacity-40' : 'group-hover:scale-110'
                                                    }`}
                                                    src={product.image}
                                                    alt={product.name}
                                                />
                                            </div>
                                            {!product.inStock && (
                                                <div className='absolute inset-0 flex items-center justify-center bg-gray-500/60 rounded'>
                                                    <PackageX className='w-5 h-5 text-gray-300' strokeWidth={2} />
                                                </div>
                                            )}
                                        </div>
                                        <div className='min-w-0'>
                                            <div className={`text-sm font-semibold tracking-wide truncate ${
                                                product.inStock ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                                {product.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className={`text-sm font-semibold ${
                                        product.inStock ? 'text-gray-900' : 'text-gray-400'
                                    }`}>
                                        ${product.price.toFixed(2)}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className={`text-xs uppercase tracking-wider font-bold ${
                                        product.inStock ? 'text-gray-600' : 'text-gray-400'
                                    }`}>
                                        {product.category}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center gap-3'>
                                        <button
                                            onClick={() => handleToggleStock(product._id)}
                                            className={`p-1.5 border-2 rounded transition-all duration-200 ${
                                                product.inStock 
                                                    ? "bg-green-50 border-green-600 text-green-600 hover:bg-green-100" 
                                                    : "bg-gray-50 border-gray-300 text-gray-400 hover:border-gray-400"
                                            }`}
                                            aria-label={product.inStock ? "Mark as out of stock" : "Mark as in stock"}
                                        >
                                            <Package className='h-4 w-4' strokeWidth={2} />
                                        </button>
                                        <span className={`text-xs uppercase tracking-wider font-bold ${
                                            product.inStock ? 'text-green-600' : 'text-gray-400'
                                        }`}>
                                            {product.inStock ? 'In Stock' : 'Out'}
                                        </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => handleToggleFeatured(product._id)}
                                        className={`p-1.5 border-2 rounded transition-all duration-200 ${
                                            product.isFeatured 
                                                ? "bg-yellow-50 border-yellow-500 text-yellow-500 hover:bg-yellow-100" 
                                                : "bg-gray-50 border-gray-300 text-gray-400 hover:border-gray-400"
                                        }`}
                                        aria-label={product.isFeatured ? "Remove from featured" : "Add to featured"}
                                    >
                                        <Star className='h-4 w-4' strokeWidth={2} fill={product.isFeatured ? "currentColor" : "none"} />
                                    </button>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className='p-1.5 bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-600 rounded transition-all duration-200'
                                        aria-label='Delete product'
                                    >
                                        <Trash className='h-4 w-4' strokeWidth={2} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className='lg:hidden divide-y divide-blue-100'>
                {products?.map((product) => (
                    <motion.div
                        key={product._id}
                        className={`group p-4 sm:p-5 hover:bg-blue-50 transition-all ${
                            !product.inStock ? 'opacity-60' : ''
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className='flex gap-4'>
                            {/* Product Image */}
                            <div className='relative flex-shrink-0'>
                                <div className='h-20 w-20 sm:h-24 sm:w-24 border-2 border-blue-100 bg-gray-50 rounded overflow-hidden'>
                                    <img
                                        className={`h-full w-full object-cover transition-all duration-300 ${
                                            !product.inStock ? 'grayscale opacity-40' : 'group-hover:scale-110'
                                        }`}
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </div>
                                {!product.inStock && (
                                    <div className='absolute inset-0 flex items-center justify-center bg-gray-500/60 rounded'>
                                        <PackageX className='w-6 h-6 sm:w-8 sm:h-8 text-gray-300' strokeWidth={2} />
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className='flex-1 min-w-0 space-y-2'>
                                <h3 className={`text-sm sm:text-base font-semibold tracking-wide line-clamp-2 ${
                                    product.inStock ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                    {product.name}
                                </h3>
                                
                                <div className='flex items-baseline gap-3'>
                                    <span className={`text-lg sm:text-xl font-bold ${
                                        product.inStock ? 'text-gray-900' : 'text-gray-400'
                                    }`}>
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className={`text-xs uppercase tracking-wider font-bold ${
                                        product.inStock ? 'text-gray-600' : 'text-gray-400'
                                    }`}>
                                        {product.category}
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div className='flex items-center gap-2'>
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2 py-1 border-2 rounded ${
                                        product.inStock 
                                            ? 'bg-green-50 border-green-600 text-green-600' 
                                            : 'bg-gray-50 border-gray-300 text-gray-400'
                                    }`}>
                                        <Package className='w-3 h-3' strokeWidth={2} />
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    {product.isFeatured && (
                                        <span className='inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-yellow-50 border-2 border-yellow-500 text-yellow-600 rounded'>
                                            <Star className='w-3 h-3' strokeWidth={2} fill="currentColor" />
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col gap-2'>
                                <button
                                    onClick={() => handleToggleStock(product._id)}
                                    className={`p-2 border-2 rounded transition-all duration-200 ${
                                        product.inStock 
                                            ? "bg-green-50 border-green-600 text-green-600 hover:bg-green-100" 
                                            : "bg-gray-50 border-gray-300 text-gray-400 hover:border-gray-400"
                                    }`}
                                    aria-label={product.inStock ? "Mark as out of stock" : "Mark as in stock"}
                                >
                                    <Package className='h-4 w-4' strokeWidth={2} />
                                </button>
                                <button
                                    onClick={() => handleToggleFeatured(product._id)}
                                    className={`p-2 border-2 rounded transition-all duration-200 ${
                                        product.isFeatured 
                                            ? "bg-yellow-50 border-yellow-500 text-yellow-500 hover:bg-yellow-100" 
                                            : "bg-gray-50 border-gray-300 text-gray-400 hover:border-gray-400"
                                    }`}
                                    aria-label={product.isFeatured ? "Remove from featured" : "Add to featured"}
                                >
                                    <Star className='h-4 w-4' strokeWidth={2} fill={product.isFeatured ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className='p-2 bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-600 rounded transition-all duration-200'
                                    aria-label='Delete product'
                                >
                                    <Trash className='h-4 w-4' strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {(!products || products.length === 0) && (
                <div className='text-center py-16 sm:py-20 px-4'>
                    <Package className='w-12 h-12 sm:w-16 sm:h-16 text-blue-200 mx-auto mb-4' strokeWidth={1.5} />
                    <p className='text-gray-600 text-base sm:text-lg font-semibold tracking-wide'>No products yet</p>
                    <p className='text-gray-500 text-xs sm:text-sm mt-2 font-semibold'>
                        Create your first product to get started
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default ProductsList;