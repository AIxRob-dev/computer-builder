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
            className='bg-zinc-950/50 border border-zinc-800/50 overflow-hidden'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Header */}
            <div className='px-4 sm:px-6 py-4 border-b border-zinc-800/50'>
                <div className='flex items-center gap-3'>
                    <div className='h-[1px] w-8 bg-zinc-700' />
                    <h2 className='text-xs uppercase tracking-[0.3em] text-zinc-500 font-light'>
                        Product Inventory
                    </h2>
                </div>
                <p className='text-sm text-zinc-600 mt-2 font-light'>
                    {products?.length || 0} products total
                </p>
            </div>

            {/* Desktop Table View */}
            <div className='hidden lg:block overflow-x-auto'>
                <table className='min-w-full divide-y divide-zinc-800/50'>
                    <thead>
                        <tr className='bg-zinc-900/30'>
                            <th className='px-6 py-4 text-left text-[10px] font-light text-zinc-500 uppercase tracking-[0.2em]'>
                                Product
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-light text-zinc-500 uppercase tracking-[0.2em]'>
                                Price
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-light text-zinc-500 uppercase tracking-[0.2em]'>
                                Category
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-light text-zinc-500 uppercase tracking-[0.2em]'>
                                Stock
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-light text-zinc-500 uppercase tracking-[0.2em]'>
                                Featured
                            </th>
                            <th className='px-6 py-4 text-left text-[10px] font-light text-zinc-500 uppercase tracking-[0.2em]'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-zinc-800/50'>
                        {products?.map((product) => (
                            <motion.tr 
                                key={product._id}
                                className={`group hover:bg-zinc-900/20 transition-colors duration-200 ${
                                    !product.inStock ? 'opacity-60' : ''
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center gap-4'>
                                        <div className='relative flex-shrink-0'>
                                            <div className='h-12 w-12 border border-zinc-800 bg-zinc-900/30 overflow-hidden'>
                                                <img
                                                    className={`h-full w-full object-cover transition-all duration-300 ${
                                                        !product.inStock ? 'grayscale opacity-40' : 'group-hover:scale-110'
                                                    }`}
                                                    src={product.image}
                                                    alt={product.name}
                                                />
                                            </div>
                                            {!product.inStock && (
                                                <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
                                                    <PackageX className='w-5 h-5 text-zinc-600' strokeWidth={1.5} />
                                                </div>
                                            )}
                                        </div>
                                        <div className='min-w-0'>
                                            <div className={`text-sm font-light tracking-wide truncate ${
                                                product.inStock ? 'text-white' : 'text-zinc-600'
                                            }`}>
                                                {product.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className={`text-sm font-light ${
                                        product.inStock ? 'text-zinc-300' : 'text-zinc-600'
                                    }`}>
                                        ${product.price.toFixed(2)}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className={`text-xs uppercase tracking-wider font-light ${
                                        product.inStock ? 'text-zinc-400' : 'text-zinc-600'
                                    }`}>
                                        {product.category}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center gap-3'>
                                        <button
                                            onClick={() => handleToggleStock(product._id)}
                                            className={`p-1.5 border transition-all duration-200 ${
                                                product.inStock 
                                                    ? "bg-zinc-900 border-zinc-700 text-white hover:border-white" 
                                                    : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-600"
                                            }`}
                                            aria-label={product.inStock ? "Mark as out of stock" : "Mark as in stock"}
                                        >
                                            <Package className='h-4 w-4' strokeWidth={1.5} />
                                        </button>
                                        <span className={`text-xs uppercase tracking-wider font-light ${
                                            product.inStock ? 'text-white' : 'text-zinc-600'
                                        }`}>
                                            {product.inStock ? 'In Stock' : 'Out'}
                                        </span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => handleToggleFeatured(product._id)}
                                        className={`p-1.5 border transition-all duration-200 ${
                                            product.isFeatured 
                                                ? "bg-white border-white text-black" 
                                                : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-600"
                                        }`}
                                        aria-label={product.isFeatured ? "Remove from featured" : "Add to featured"}
                                    >
                                        <Star className='h-4 w-4' strokeWidth={1.5} fill={product.isFeatured ? "currentColor" : "none"} />
                                    </button>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className='p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-red-600 hover:text-red-500 transition-all duration-200'
                                        aria-label='Delete product'
                                    >
                                        <Trash className='h-4 w-4' strokeWidth={1.5} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className='lg:hidden divide-y divide-zinc-800/50'>
                {products?.map((product) => (
                    <motion.div
                        key={product._id}
                        className={`group p-4 sm:p-5 hover:bg-zinc-900/20 transition-all ${
                            !product.inStock ? 'opacity-60' : ''
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className='flex gap-4'>
                            {/* Product Image */}
                            <div className='relative flex-shrink-0'>
                                <div className='h-20 w-20 sm:h-24 sm:w-24 border border-zinc-800 bg-zinc-900/30 overflow-hidden'>
                                    <img
                                        className={`h-full w-full object-cover transition-all duration-300 ${
                                            !product.inStock ? 'grayscale opacity-40' : 'group-hover:scale-110'
                                        }`}
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </div>
                                {!product.inStock && (
                                    <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
                                        <PackageX className='w-6 h-6 sm:w-8 sm:h-8 text-zinc-600' strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className='flex-1 min-w-0 space-y-2'>
                                <h3 className={`text-sm sm:text-base font-light tracking-wide line-clamp-2 ${
                                    product.inStock ? 'text-white' : 'text-zinc-600'
                                }`}>
                                    {product.name}
                                </h3>
                                
                                <div className='flex items-baseline gap-3'>
                                    <span className={`text-lg sm:text-xl font-light ${
                                        product.inStock ? 'text-white' : 'text-zinc-600'
                                    }`}>
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className={`text-xs uppercase tracking-wider font-light ${
                                        product.inStock ? 'text-zinc-500' : 'text-zinc-700'
                                    }`}>
                                        {product.category}
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div className='flex items-center gap-2'>
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-light px-2 py-1 border ${
                                        product.inStock 
                                            ? 'bg-zinc-900 border-zinc-700 text-white' 
                                            : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                                    }`}>
                                        <Package className='w-3 h-3' strokeWidth={1.5} />
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    {product.isFeatured && (
                                        <span className='inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-light px-2 py-1 bg-white border border-white text-black'>
                                            <Star className='w-3 h-3' strokeWidth={1.5} fill="currentColor" />
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col gap-2'>
                                <button
                                    onClick={() => handleToggleStock(product._id)}
                                    className={`p-2 border transition-all duration-200 ${
                                        product.inStock 
                                            ? "bg-zinc-900 border-zinc-700 text-white hover:border-white" 
                                            : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-600"
                                    }`}
                                    aria-label={product.inStock ? "Mark as out of stock" : "Mark as in stock"}
                                >
                                    <Package className='h-4 w-4' strokeWidth={1.5} />
                                </button>
                                <button
                                    onClick={() => handleToggleFeatured(product._id)}
                                    className={`p-2 border transition-all duration-200 ${
                                        product.isFeatured 
                                            ? "bg-white border-white text-black" 
                                            : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-600"
                                    }`}
                                    aria-label={product.isFeatured ? "Remove from featured" : "Add to featured"}
                                >
                                    <Star className='h-4 w-4' strokeWidth={1.5} fill={product.isFeatured ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className='p-2 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-red-600 hover:text-red-500 transition-all duration-200'
                                    aria-label='Delete product'
                                >
                                    <Trash className='h-4 w-4' strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {(!products || products.length === 0) && (
                <div className='text-center py-16 sm:py-20 px-4'>
                    <Package className='w-12 h-12 sm:w-16 sm:h-16 text-zinc-800 mx-auto mb-4' strokeWidth={1} />
                    <p className='text-zinc-500 text-base sm:text-lg font-light tracking-wide'>No products yet</p>
                    <p className='text-zinc-700 text-xs sm:text-sm mt-2 font-light'>
                        Create your first product to get started
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default ProductsList;
