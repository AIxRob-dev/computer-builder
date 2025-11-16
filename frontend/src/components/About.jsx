import { memo } from "react";
import { Award, Clock, Shield, Wrench, TrendingUp, Users, CheckCircle, Sparkles } from "lucide-react";

// ⚡ OPTIMIZED: Memoized About Section Component
const About = () => {
    return (
        <section className='relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-blue-50/30 to-white overflow-hidden'>
            {/* SEO-optimized structured data would be added via JSON-LD in your page head */}
            
            {/* Decorative Background Elements */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10' />
            <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 -z-10' />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='text-center mb-12 sm:mb-16'>
                    <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest shadow-lg mb-5'>
                        <Sparkles className='w-4 h-4' />
                        About Us
                    </div>
                    
                    <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight'>
                        <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                            Computer Builder
                        </span>
                        <br />
                        <span>Your Trusted PC Partner</span>
                    </h2>
                    
                    <div className='flex items-center justify-center gap-3 mb-6'>
                        <div className='w-20 h-1 bg-gradient-to-r from-transparent via-blue-600 to-blue-600 rounded-full'></div>
                        <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
                        <div className='w-20 h-1 bg-gradient-to-l from-transparent via-blue-600 to-blue-600 rounded-full'></div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16'>
                    {/* Image Section */}
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl transform rotate-3 opacity-20'></div>
                        <div className='relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-1 shadow-2xl'>
                            <div className='bg-white rounded-3xl p-8 sm:p-10'>
                                <img 
                                    src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop"
                                    alt="Professional custom PC building workspace showcasing Computer Builder's 6+ years of expertise in assembling high-performance computers"
                                    className='w-full h-auto rounded-2xl shadow-lg'
                                    loading="lazy"
                                    decoding="async"
                                    width="800"
                                    height="600"
                                />
                                
                                {/* Floating Badge */}
                                <div className='absolute -top-6 -right-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-xl border-4 border-white'>
                                    <div className='text-4xl font-black mb-1'>6+</div>
                                    <div className='text-xs font-bold uppercase tracking-wider'>Years</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className='space-y-6'>
                        <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight'>
                            Building Professional-Grade Computers Since 2018
                        </h3>
                        
                        <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
                            At <strong className='text-gray-900 font-bold'>Computer Builder</strong>, we specialize in crafting custom PCs that deliver exceptional performance without breaking the bank. With over <strong className='text-blue-600 font-bold'>6 years of expertise</strong>, we've helped thousands of customers achieve their perfect computing setup.
                        </p>
                        
                        <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
                            From high-performance gaming rigs to professional workstations for rendering and content creation, our cost-efficient solutions combine premium components with expert assembly to ensure maximum value and reliability.
                        </p>

                        {/* Key Features Grid */}
                        <div className='grid grid-cols-2 gap-4 pt-4'>
                            {[
                                { icon: Clock, text: "6+ Years Experience" },
                                { icon: Shield, text: "Quality Guaranteed" },
                                { icon: TrendingUp, text: "Cost-Efficient Solutions" },
                                { icon: Users, text: "Expert Team" }
                            ].map(({ icon: Icon, text }, idx) => (
                                <div key={idx} className='flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300'>
                                    <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0'>
                                        <Icon className='w-5 h-5 text-white' strokeWidth={2.5} />
                                    </div>
                                    <span className='text-sm font-bold text-gray-900'>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className='bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl mb-16'>
                    <h3 className='text-2xl sm:text-3xl font-black text-white text-center mb-10'>
                        Why Choose Computer Builder?
                    </h3>
                    
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
                        {[
                            {
                                icon: Award,
                                title: "Professional Excellence",
                                desc: "Industry-leading expertise in custom PC building with meticulous attention to detail and quality control"
                            },
                            {
                                icon: Wrench,
                                title: "Expert Assembly",
                                desc: "Every computer is hand-built by certified technicians using best practices for optimal performance and longevity"
                            },
                            {
                                icon: TrendingUp,
                                title: "Maximum Value",
                                desc: "Cost-efficient solutions that deliver premium performance without unnecessary markup or hidden fees"
                            }
                        ].map(({ icon: Icon, title, desc }, idx) => (
                            <div key={idx} className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20 hover:bg-white/15 transition-all duration-300'>
                                <div className='w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4'>
                                    <Icon className='w-7 h-7 text-blue-600' strokeWidth={2.5} />
                                </div>
                                <h4 className='text-lg font-bold text-white mb-3'>{title}</h4>
                                <p className='text-sm text-blue-100 leading-relaxed'>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16'>
                    {[
                        { number: "5000+", label: "PCs Built", sublabel: "Custom Systems Delivered" },
                        { number: "98%", label: "Satisfaction", sublabel: "Customer Approval Rating" },
                        { number: "24/7", label: "Support", sublabel: "Technical Assistance" },
                        { number: "100%", label: "Quality", sublabel: "Tested & Verified" }
                    ].map((stat, idx) => (
                        <div key={idx} className='text-center bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300'>
                            <div className='text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text mb-2'>
                                {stat.number}
                            </div>
                            <div className='text-sm font-bold text-gray-900 mb-1'>{stat.label}</div>
                            <div className='text-xs text-gray-600 font-medium'>{stat.sublabel}</div>
                        </div>
                    ))}
                </div>

                {/* Commitment Section */}
                <div className='bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 sm:p-10 border-2 border-blue-100 mb-12'>
                    <h3 className='text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8'>
                        Our Commitment to Excellence
                    </h3>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {[
                            "Premium components from trusted manufacturers",
                            "Rigorous quality testing on every build",
                            "Transparent pricing with no hidden costs",
                            "Expert consultation for your specific needs",
                            "Comprehensive warranty coverage",
                            "Post-purchase technical support"
                        ].map((item, idx) => (
                            <div key={idx} className='flex items-start gap-3'>
                                <CheckCircle className='w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5' strokeWidth={2.5} />
                                <span className='text-gray-700 font-medium'>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agency Credit Section - SEO Optimized */}
                <div className='text-center py-8 border-t-2 border-blue-200'>
                    <p className='text-sm text-gray-600 mb-3 font-medium'>
                        Website Design & Development
                    </p>
                    <div className='flex items-center justify-center gap-2'>
                        <span className='text-gray-700 font-semibold'>Designed and Built by</span>
                        <a 
                            href="https://www.nafrok.com/" 
                            target="_blank" 
                            rel="noopener noreferrer nofollow"
                            className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors duration-300 group'
                            title="Nafrok - Professional Web Design & Development Agency"
                            aria-label="Visit Nafrok website - Web design and development agency"
                        >
                            <span className='group-hover:underline'>Nafrok</span>
                            <svg className='w-4 h-4 transform group-hover:translate-x-1 transition-transform' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                    <p className='text-xs text-gray-500 mt-2'>
                        Professional e-commerce solutions and custom web development
                    </p>
                </div>
            </div>
        </section>
    );
};

// ⚡ CRITICAL: Export memoized component to prevent unnecessary re-renders
export default memo(About);
