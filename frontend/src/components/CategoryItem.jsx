import { useEffect, useState } from "react";
import { Sparkles, Zap, Shield, Award, TrendingUp, Package, Headphones, Settings } from "lucide-react";

// Mock CategoryItem component (replace with your actual import)
const CategoryItem = ({ category }) => {
    const getCategoryTheme = (name) => {
        const lowerName = name.toLowerCase();
        
        if (lowerName.includes('gaming')) {
            return {
                image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
                gradient: 'from-purple-600 via-pink-600 to-red-600',
                accentColor: 'purple',
                title: 'Ultimate Gaming Arsenal',
                tagline: 'Dominate Every Frame',
                description: 'Experience uncompromising performance with battle-tested gaming rigs engineered for competitive edge and immersive gameplay',
                specs: ['240+ FPS', 'RTX ON', '1ms Response'],
                badge: 'Esports Ready'
            };
        }
        if (lowerName.includes('office')) {
            return {
                image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
                gradient: 'from-blue-600 via-cyan-600 to-teal-600',
                accentColor: 'blue',
                title: 'Professional Workstations',
                tagline: 'Enterprise-Grade Power',
                description: 'Precision-engineered systems built for data analytics, complex simulations, and mission-critical business applications',
                specs: ['64-Core Ready', 'ECC Memory', '24/7 Reliable'],
                badge: 'Certified Pro'
            };
        }
        if (lowerName.includes('rendering')) {
            return {
                image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
                gradient: 'from-orange-600 via-amber-600 to-yellow-600',
                accentColor: 'orange',
                title: 'Creator Powerhouse',
                tagline: 'Unleash Creativity',
                description: 'Studio-grade workstations optimized for 3D rendering, video production, and professional content creation workflows',
                specs: ['GPU Cluster', 'NVMe RAID', '10-bit Color'],
                badge: 'Creator Pro'
            };
        }
        if (lowerName.includes('exclusive')) {
            return {
                image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800&q=80',
                gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
                accentColor: 'emerald',
                title: 'Liquid Cooled Legends',
                tagline: 'Art Meets Engineering',
                description: 'Hand-crafted luxury systems featuring bespoke liquid cooling loops, premium components, and show-stopping aesthetics',
                specs: ['Custom Loop', 'Whisper Quiet', 'Hand-Built'],
                badge: 'Exclusive'
            };
        }
        if (lowerName.includes('explore')) {
            return {
                image: 'https://images.unsplash.com/photo-1623639522011-d10af4f09d68?w=800&q=80',
                gradient: 'from-indigo-600 via-blue-600 to-purple-600',
                accentColor: 'indigo',
                title: 'Specialized Solutions',
                tagline: 'Built For Purpose',
                description: 'From ultra-compact mini-ITX builds to multi-monitor trading rigs—discover purpose-engineered systems for unique workflows',
                specs: ['Custom Configs', 'Space Efficient', 'Specialized'],
                badge: 'Versatile'
            };
        }
        
        return {
            image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',
            gradient: 'from-gray-700 via-gray-800 to-gray-900',
            accentColor: 'gray',
            title: 'Premium Collection',
            tagline: 'Excellence Standard',
            description: 'Explore our curated selection of high-performance systems',
            specs: ['Premium', 'Quality', 'Performance'],
            badge: 'Featured'
        };
    };

    const theme = getCategoryTheme(category.name);
    
    return (
        <a href={"/category" + category.href} className="block h-full group">
            <div className='relative bg-white rounded-3xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-700 overflow-hidden h-full flex flex-col hover:-translate-y-3'>
                <div className='relative h-64 sm:h-72 md:h-80 overflow-hidden'>
                    <img 
                        src={theme.image}
                        alt={category.name}
                        className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000'
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-60 group-hover:opacity-50 transition-opacity duration-700`}></div>
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'></div>
                    
                    <div className='absolute top-5 right-5'>
                        <div className='bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border-2 border-white/60 shadow-2xl'>
                            <span className='text-xs font-black text-gray-900 uppercase tracking-widest'>
                                {theme.badge}
                            </span>
                        </div>
                    </div>
                    
                    <div className='absolute bottom-0 left-0 right-0 p-6 sm:p-8'>
                        <p className='text-white/90 text-sm sm:text-base font-bold uppercase tracking-widest mb-1'>
                            {theme.tagline}
                        </p>
                        <h3 className='text-white text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-2xl leading-tight'>
                            {theme.title}
                        </h3>
                        
                        <div className='flex flex-wrap gap-2 mt-4'>
                            {theme.specs.map((spec, index) => (
                                <span 
                                    key={index}
                                    className='bg-black/40 backdrop-blur-lg border-2 border-white/40 text-white text-xs sm:text-sm px-4 py-1.5 rounded-full font-bold uppercase tracking-wide'
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex-1 p-6 sm:p-8 bg-gradient-to-b from-gray-50 via-white to-gray-50'>
                    <p className='text-gray-700 text-sm sm:text-base leading-relaxed font-medium mb-6'>
                        {theme.description}
                    </p>
                    <button className='w-full bg-blue-600 hover:opacity-90 text-white px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-500 hover:scale-[1.03]'>
                        Explore Builds
                    </button>
                </div>
            </div>
        </a>
    );
};

export default CategoryItem;

