import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryItem = ({ category }) => {
    return (
        <Link to={"/category" + category.href}>
            <div className='relative overflow-hidden group cursor-pointer h-32 sm:h-36 md:h-40 lg:h-44 bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-500'>
                {/* Background Image with better visibility */}
                <div 
                    className='absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-700 ease-out group-hover:scale-110 opacity-30 group-hover:opacity-40'
                    style={{ backgroundImage: `url(${category.imageUrl})` }}
                />
                
                {/* Subtle gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40' />
                
                {/* Content */}
                <div className='relative h-full flex flex-col justify-between p-4 sm:p-5 lg:p-6'>
                    {/* Category Name */}
                    <div className='flex-1 flex items-center'>
                        <h3 className='text-white text-lg sm:text-xl lg:text-2xl font-light tracking-wide'>
                           
                        </h3>
                    </div>
                    
                    {/* Bottom section with arrow */}
                    <div className='flex items-center justify-between'>
                        <span className='text-white  text-[10px] sm:text-xs uppercase tracking-widest font-light'>
                             {category.name}
                        </span>
                        
                        <div className='w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border border-zinc-700 group-hover:border-white transition-all duration-300 group-hover:bg-white'>
                            <ArrowRight 
                                className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 group-hover:text-black transition-all duration-300 group-hover:translate-x-0.5' 
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Hover effect line */}
                <div className='absolute bottom-0 left-0 h-[1px] w-0 bg-white group-hover:w-full transition-all duration-500' />
            </div>
        </Link>
    );
};

export default CategoryItem;
