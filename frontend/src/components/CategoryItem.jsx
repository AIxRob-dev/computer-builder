import { ArrowRight } from "lucide-react";

const CategoryItem = ({ category }) => {
    return (
        <a href={"/category" + category.href}>
            <div className='relative overflow-hidden group cursor-pointer aspect-[3/4] bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-[border-color,box-shadow] duration-500 hover:shadow-2xl hover:shadow-zinc-900/50 will-change-transform'>
                {/* Background Image with optimized loading */}
                <div 
                    className='absolute inset-0 bg-cover bg-center transition-[transform,opacity] duration-700 ease-out group-hover:scale-110 opacity-40 group-hover:opacity-50 will-change-transform'
                    style={{ backgroundImage: `url(${category.imageUrl})` }}
                    role="img"
                    aria-label={`${category.name} category background`}
                />
                
                {/* Enhanced gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80' />
                
                {/* Subtle vignette effect */}
                <div className='absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]' />
                
                {/* Content - More Compact */}
                <div className='relative h-full flex flex-col justify-end p-3 sm:p-4 lg:p-5'>
                    {/* Category Name at bottom */}
                    <div className='mb-2 sm:mb-3'>
                        <h3 className='text-white text-base sm:text-lg lg:text-xl font-light tracking-wide uppercase transition-colors duration-300 group-hover:text-zinc-100'>
                            {category.name}
                        </h3>
                    </div>
                    
                    {/* Arrow button - More Compact */}
                    <div className='flex items-center justify-between'>
                        <span className='text-zinc-400 text-[10px] sm:text-xs uppercase tracking-widest font-light group-hover:text-zinc-300 transition-colors duration-300'>
                            Explore
                        </span>
                        
                        <div className='w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-zinc-700 group-hover:border-white transition-[border-color,background-color,transform] duration-300 group-hover:bg-white group-hover:rotate-[-4deg] will-change-transform'>
                            <ArrowRight 
                                className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-black transition-[color,transform] duration-300 group-hover:translate-x-1 will-change-transform' 
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Hover effect line - animated from left */}
                <div className='absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-white to-zinc-400 group-hover:w-full transition-[width] duration-700 ease-out will-change-[width]' />
                
                {/* Top accent line */}
                <div className='absolute top-0 right-0 h-[1px] w-0 bg-gradient-to-l from-white/60 to-transparent group-hover:w-1/3 transition-[width] duration-500 delay-100 will-change-[width]' />
            </div>
        </a>
    );
};

export default CategoryItem;
