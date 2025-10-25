import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='relative bg-black border-t border-zinc-800/50 text-zinc-400'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
                {/* Main Footer Content */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12'>
                    {/* Company Info */}
                    <div className='space-y-5'>
                        <div className='flex items-center'>
                            <img 
                                src="/fontbol.png" 
                                alt="SLATEBOOKS" 
                                className='h-5 w-auto opacity-90'
                            />
                        </div>
                        <p className='text-zinc-500 text-sm font-light leading-relaxed max-w-xs'>
                            Your premier destination for quality products. 
                            Discover the latest trends and shop with confidence.
                        </p>
                        {/* Social Media Links */}
                        <div className='flex space-x-2 pt-2'>
                            <a 
                                href='https://facebook.com' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='group p-2.5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300'
                                aria-label='Facebook'
                            >
                                <Facebook className='w-4 h-4 text-zinc-600 group-hover:text-white transition-colors' strokeWidth={1.5} />
                            </a>
                            <a 
                                href='https://twitter.com' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='group p-2.5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300'
                                aria-label='Twitter'
                            >
                                <Twitter className='w-4 h-4 text-zinc-600 group-hover:text-white transition-colors' strokeWidth={1.5} />
                            </a>
                            <a 
                                href='https://instagram.com' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='group p-2.5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300'
                                aria-label='Instagram'
                            >
                                <Instagram className='w-4 h-4 text-zinc-600 group-hover:text-white transition-colors' strokeWidth={1.5} />
                            </a>
                            <a 
                                href='https://github.com' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='group p-2.5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300'
                                aria-label='Github'
                            >
                                <Github className='w-4 h-4 text-zinc-600 group-hover:text-white transition-colors' strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className='text-white font-light text-xs uppercase tracking-widest mb-5'>
                            Quick Links
                        </h4>
                        <ul className='space-y-3'>
                            <li>
                                <Link 
                                    to='/' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/category/t-shirts' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    Shop All
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/cart' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <a 
                                    href='#about' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a 
                                    href='#contact' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className='text-white font-light text-xs uppercase tracking-widest mb-5'>
                            Categories
                        </h4>
                        <ul className='space-y-3'>
                            <li>
                                <Link 
                                    to='/category/jeans' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    Jeans
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/category/t-shirts' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    T-Shirts
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/category/shoes' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    Shoes
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/category/jackets' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    Jackets
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/category/bags' 
                                    className='text-zinc-500 hover:text-white transition-colors duration-300 text-sm font-light inline-block'
                                >
                                    Bags
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className='text-white font-light text-xs uppercase tracking-widest mb-5'>
                            Contact Us
                        </h4>
                        <ul className='space-y-4'>
                            <li className='flex items-start space-x-3 group'>
                                <MapPin className='w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0 group-hover:text-white transition-colors' strokeWidth={1.5} />
                                <span className='text-sm text-zinc-500 font-light leading-relaxed'>
                                    123 E-Commerce Street, Mumbai, Maharashtra
                                </span>
                            </li>
                            <li className='flex items-center space-x-3 group'>
                                <Phone className='w-4 h-4 text-zinc-600 flex-shrink-0 group-hover:text-white transition-colors' strokeWidth={1.5} />
                                <a 
                                    href='tel:+911234567890' 
                                    className='text-sm text-zinc-500 font-light hover:text-white transition-colors duration-300'
                                >
                                    +91 1234567890
                                </a>
                            </li>
                            <li className='flex items-center space-x-3 group'>
                                <Mail className='w-4 h-4 text-zinc-600 flex-shrink-0 group-hover:text-white transition-colors' strokeWidth={1.5} />
                                <a 
                                    href='mailto:support@slatebooks.com' 
                                    className='text-sm text-zinc-500 font-light hover:text-white transition-colors duration-300'
                                >
                                    support@slatebooks.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className='h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-8' />

                {/* Bottom Section */}
                <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
                    {/* Copyright */}
                    <p className='text-xs text-zinc-600 font-light tracking-wide'>
                        © {currentYear} SLATEBOOKS. All rights reserved.
                    </p>

                    {/* Legal Links */}
                    <div className='flex flex-wrap justify-center gap-6'>
                        <a 
                            href='#privacy' 
                            className='text-xs text-zinc-600 hover:text-white transition-colors duration-300 font-light tracking-wide'
                        >
                            Privacy Policy
                        </a>
                        <a 
                            href='#terms' 
                            className='text-xs text-zinc-600 hover:text-white transition-colors duration-300 font-light tracking-wide'
                        >
                            Terms of Service
                        </a>
                        <a 
                            href='#cookies' 
                            className='text-xs text-zinc-600 hover:text-white transition-colors duration-300 font-light tracking-wide'
                        >
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
