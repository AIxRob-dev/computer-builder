import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-black border-t border-gray-800 text-gray-300'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                {/* Main Footer Content */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
                    {/* Company Info */}
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-2'>
                            <ShoppingBag className='w-8 h-8 text-white' />
                            <h3 className='text-2xl font-bold text-white'>E-Commerce</h3>
                        </div>
                        <p className='text-gray-400 text-sm leading-relaxed'>
                            Your premier destination for quality products. 
                            Discover the latest trends and shop with confidence.
                        </p>
                        {/* Social Media Links */}
                        <div className='flex space-x-4 pt-2'>
                            <a 
                                href='https://facebook.com' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300'
                                aria-label='Facebook'
                            >
                                <Facebook className='w-5 h-5' />
                            </a>
                            <a 
                                href='https://twitter.com' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300'
                                aria-label='Twitter'
                            >
                                <Twitter className='w-5 h-5' />
                            </a>
                            <a 
                                href='https://instagram.com' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300'
                                aria-label='Instagram'
                            >
                                <Instagram className='w-5 h-5' />
                            </a>
                            <a 
                                href='https://github.com' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300'
                                aria-label='Github'
                            >
                                <Github className='w-5 h-5' />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className='text-white font-semibold text-lg mb-4'>Quick Links</h4>
                        <ul className='space-y-2'>
                            <li>
                                <Link to='/' className='hover:text-white transition-colors duration-300 text-sm'>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to='/category/t-shirts' className='hover:text-white transition-colors duration-300 text-sm'>
                                    Shop All
                                </Link>
                            </li>
                            <li>
                                <Link to='/cart' className='hover:text-white transition-colors duration-300 text-sm'>
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <a href='#about' className='hover:text-white transition-colors duration-300 text-sm'>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href='#contact' className='hover:text-white transition-colors duration-300 text-sm'>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className='text-white font-semibold text-lg mb-4'>Categories</h4>
                        <ul className='space-y-2'>
                            <li>
                                <Link to='/category/jeans' className='hover:text-white transition-colors duration-300 text-sm'>
                                    Jeans
                                </Link>
                            </li>
                            <li>
                                <Link to='/category/t-shirts' className='hover:text-white transition-colors duration-300 text-sm'>
                                    T-Shirts
                                </Link>
                            </li>
                            <li>
                                <Link to='/category/shoes' className='hover:text-white transition-colors duration-300 text-sm'>
                                    Shoes
                                </Link>
                            </li>
                            <li>
                                <Link to='/category/jackets' className='hover:text-white transition-colors duration-300 text-sm'>
                                    Jackets
                                </Link>
                            </li>
                            <li>
                                <Link to='/category/bags' className='hover:text-white transition-colors duration-300 text-sm'>
                                    Bags
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className='text-white font-semibold text-lg mb-4'>Contact Us</h4>
                        <ul className='space-y-3'>
                            <li className='flex items-start space-x-3'>
                                <MapPin className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0' />
                                <span className='text-sm'>123 E-Commerce Street, Mumbai, Maharashtra, India</span>
                            </li>
                            <li className='flex items-center space-x-3'>
                                <Phone className='w-5 h-5 text-gray-400 flex-shrink-0' />
                                <span className='text-sm'>+91 1234567890</span>
                            </li>
                            <li className='flex items-center space-x-3'>
                                <Mail className='w-5 h-5 text-gray-400 flex-shrink-0' />
                                <a href='mailto:support@ecommerce.com' className='text-sm hover:text-white transition-colors duration-300'>
                                    support@ecommerce.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className='border-t border-gray-800 pt-8'>
                    <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
                        {/* Copyright */}
                        <p className='text-sm text-gray-400'>
                            © {currentYear} E-Commerce. All rights reserved.
                        </p>

                        {/* Legal Links */}
                        <div className='flex space-x-6'>
                            <a href='#privacy' className='text-sm text-gray-400 hover:text-white transition-colors duration-300'>
                                Privacy Policy
                            </a>
                            <a href='#terms' className='text-sm text-gray-400 hover:text-white transition-colors duration-300'>
                                Terms of Service
                            </a>
                            <a href='#cookies' className='text-sm text-gray-400 hover:text-white transition-colors duration-300'>
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;