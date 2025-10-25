import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryItem = ({ category }) => {
    return (
        <a href={"/category" + category.href}>
            <div className='relative overflow-hidden group cursor-pointer aspect-[3/4] bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-900/50'>
                {/* Background Image with enhanced visibility */}
                <div 
                    className='absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-110 opacity-40 group-hover:opacity-50'
                    style={{ backgroundImage: `url(${category.imageUrl})` }}
                />
                
                {/* Enhanced gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80' />
                
                {/* Subtle vignette effect */}
                <div className='absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]' />
                
                {/* Content */}
                <div className='relative h-full flex flex-col justify-end p-4 sm:p-5 lg:p-6'>
                    {/* Category Name at bottom */}
                    <div className='mb-3 sm:mb-4'>
                        <h3 className='text-white text-lg sm:text-xl lg:text-2xl font-light tracking-wide uppercase'>
                            {category.name}
                        </h3>
                    </div>
                    
                    {/* Arrow button */}
                    <div className='flex items-center justify-between'>
                        <span className='text-zinc-400 text-xs sm:text-sm uppercase tracking-widest font-light group-hover:text-zinc-300 transition-colors duration-300'>
                            Explore
                        </span>
                        
                        <div className='w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-zinc-700 group-hover:border-white transition-all duration-300 group-hover:bg-white group-hover:rotate-[-4deg]'>
                            <ArrowRight 
                                className='w-4 h-4 text-zinc-400 group-hover:text-black transition-all duration-300 group-hover:translate-x-1' 
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Hover effect line - animated from left */}
                <div className='absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-white to-zinc-400 group-hover:w-full transition-all duration-700 ease-out' />
                
                {/* Top accent line */}
                <div className='absolute top-0 right-0 h-[1px] w-0 bg-gradient-to-l from-white/60 to-transparent group-hover:w-1/3 transition-all duration-500 delay-100' />
            </div>
        </a>
    );
};

export default CategoryItem;
