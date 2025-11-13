import { memo } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin, Monitor, Cpu, HardDrive, Zap } from "lucide-react";

// ⚡ OPTIMIZED: Memoized footer to prevent unnecessary re-renders
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='relative bg-gradient-to-br from-gray-50 via-white to-blue-50 border-t-2 border-blue-200 text-gray-600'>
            {/* Top Accent Bar */}
            <div className='h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400' />
            
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
                {/* Main Footer Content */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12'>
                    {/* Company Info */}
                    <div className='space-y-5'>
                        <div className='flex items-center'>
                            {/* ⚡ CRITICAL: Optimize image loading */}
                            <img 
                                src="/fontbol.png" 
                                alt="ComputerBuilder" 
                                className='h-6 w-auto'
                                loading="lazy"
                                decoding="async"
                                width="120"
                                height="24"
                            />
                        </div>
                        <p className='text-gray-600 text-sm font-medium leading-relaxed max-w-xs'>
                            Your trusted partner for custom PC builds. 
                            Premium components, expert assembly, unmatched performance.
                        </p>
                        
                        {/* Tech Features */}
                        <div className='space-y-2 pt-2'>
                            <div className='flex items-center gap-2 text-xs text-gray-700'>
                                <Cpu className='w-4 h-4 text-blue-600' strokeWidth={2} />
                                <span className='font-medium'>Latest Generation Components</span>
                            </div>
                            <div className='flex items-center gap-2 text-xs text-gray-700'>
                                <Zap className='w-4 h-4 text-blue-600' strokeWidth={2} />
                                <span className='font-medium'>Expert PC Building Service</span>
                            </div>
                        </div>
                        
                        {/* Social Media Links */}
                        <div className='flex space-x-2 pt-3'>
                            {[
                                { href: 'https://facebook.com', Icon: Facebook, label: 'Facebook' },
                                { href: 'https://twitter.com', Icon: Twitter, label: 'Twitter' },
                                { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
                                { href: 'https://github.com', Icon: Github, label: 'Github' }
                            ].map(({ href, Icon, label }) => (
                                <a 
                                    key={label}
                                    href={href}
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                    className='group p-2.5 bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-600 transition-all duration-300 rounded-lg shadow-sm'
                                    aria-label={label}
                                >
                                    <Icon className='w-4 h-4 text-blue-600 group-hover:text-white transition-colors' strokeWidth={2} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className='text-gray-900 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2'>
                            <Monitor className='w-4 h-4 text-blue-600' strokeWidth={2} />
                            Quick Links
                        </h4>
                        <ul className='space-y-3'>
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/category/Gaming-Pc', label: 'Gaming PCs' },
                                { to: '/cart', label: 'Shopping Cart' },
                                { to: '#about', label: 'About Us' },
                                { to: '#contact', label: 'Contact' }
                            ].map(({ to, label }) => (
                                <li key={label}>
                                    {to.startsWith('#') ? (
                                        <a 
                                            href={to}
                                            className='text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm font-medium inline-block hover:translate-x-1 transition-transform'
                                        >
                                            {label}
                                        </a>
                                    ) : (
                                        <Link 
                                            to={to}
                                            className='text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm font-medium inline-block hover:translate-x-1 transition-transform'
                                        >
                                            {label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* PC Categories */}
                    <div>
                        <h4 className='text-gray-900 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2'>
                            <HardDrive className='w-4 h-4 text-blue-600' strokeWidth={2} />
                            PC Categories
                        </h4>
                        <ul className='space-y-3'>
                            {[
                                { to: '/category/Office-Pc', label: 'Office PCs' },
                                { to: '/category/Gaming-Pc', label: 'Gaming PCs' },
                                { to: '/category/Rendering-Pc', label: 'Rendering PCs' },
                                { to: '/category/Exclusives', label: 'Exclusive Builds' },
                                { to: '/Explore', label: 'Explore All' }
                            ].map(({ to, label }) => (
                                <li key={label}>
                                    <Link 
                                        to={to}
                                        className='text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm font-medium inline-block hover:translate-x-1 transition-transform'
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className='text-gray-900 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2'>
                            <Mail className='w-4 h-4 text-blue-600' strokeWidth={2} />
                            Contact Us
                        </h4>
                        <ul className='space-y-4'>
                            <li className='flex items-start space-x-3'>
                                <MapPin className='w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0' strokeWidth={2} />
                                <span className='text-sm text-gray-600 font-medium leading-relaxed'>
                                    Bengaluru, Karnataka, India
                                </span>
                            </li>
                            <li className='flex items-center space-x-3'>
                                <Phone className='w-4 h-4 text-blue-600 flex-shrink-0' strokeWidth={2} />
                                <a 
                                    href='tel:+911234567890' 
                                    className='text-sm text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300'
                                >
                                    +91 1234567890
                                </a>
                            </li>
                            <li className='flex items-center space-x-3'>
                                <Mail className='w-4 h-4 text-blue-600 flex-shrink-0' strokeWidth={2} />
                                <a 
                                    href='mailto:support@computerbuilder.com' 
                                    className='text-sm text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300'
                                >
                                    support@computerbuilder.com
                                </a>
                            </li>
                        </ul>
                        
                        {/* Trust Badges */}
                        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                            <p className='text-xs text-gray-700 font-bold mb-2'>✓ Secure Payments</p>
                            <p className='text-xs text-gray-600'>SSL Encrypted Checkout</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className='h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-8' />

                {/* Bottom Section */}
                <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
                    {/* Copyright */}
                    <p className='text-xs text-gray-600 font-medium tracking-wide'>
                        © {currentYear} ComputerBuilder. All rights reserved.
                    </p>

                    {/* Legal Links */}
                    <div className='flex flex-wrap justify-center gap-6'>
                        {[
                            { href: '#privacy', label: 'Privacy Policy' },
                            { href: '#terms', label: 'Terms of Service' },
                            { href: '#warranty', label: 'Warranty Info' }
                        ].map(({ href, label }) => (
                            <a 
                                key={label}
                                href={href}
                                className='text-xs text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium tracking-wide'
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

// ⚡ CRITICAL: Memoize footer since it never changes
export default memo(Footer);
