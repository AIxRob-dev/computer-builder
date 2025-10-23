import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryItem = ({ category }) => {
    return (
        <Link to={"/category" + category.href}>
            <div className='relative overflow-hidden rounded-lg group cursor-pointer'>
                {/* Image */}
                <img
                    src={category.imageUrl}
                    alt={category.name}
                    className='w-full h-auto transition-transform duration-700 ease-out group-hover:scale-110'
                    loading='lazy'
                />
                
                {/* Overlay gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300' />
                
                {/* Text Content Overlay */}
                <div className='absolute inset-0 flex flex-col justify-end p-6'>
                    <div className='transform transition-transform duration-300 group-hover:-translate-y-2'>
                        <h3 className='text-white text-2xl font-bold mb-2'>{category.name}</h3>
                        <p className='text-gray-300 text-sm mb-3'>Explore {category.name}</p>
                        
                        {/* Shop Now button */}
                        <div className='flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <span>Shop Now</span>
                            <ArrowRight className='w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300' />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CategoryItem;