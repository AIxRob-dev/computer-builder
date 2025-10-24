import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { signup, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8'>
			{/* Header Section */}
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<h2 className='text-center text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-2 tracking-tight'>
					Create Account
				</h2>
				<p className='text-center text-sm sm:text-base text-zinc-400 font-light'>
					Join us today and get started
				</p>
			</motion.div>

			{/* Form Section */}
			<motion.div
				className='mt-8 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<div className='bg-zinc-950 border border-zinc-800/50 py-8 sm:py-10 px-6 sm:px-10'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Name Field */}
						<div>
							<label htmlFor='name' className='block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2'>
								Full Name
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
									<User className='h-4 w-4 text-zinc-500' strokeWidth={1.5} />
								</div>
								<input
									id='name'
									type='text'
									required
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className='block w-full px-4 py-3 pl-11 bg-black/50 border border-zinc-800 
									text-white placeholder-zinc-600 
									focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
									transition-all duration-300 font-light'
									placeholder='John Doe'
								/>
							</div>
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor='email' className='block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2'>
								Email Address
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
									<Mail className='h-4 w-4 text-zinc-500' strokeWidth={1.5} />
								</div>
								<input
									id='email'
									type='email'
									required
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className='block w-full px-4 py-3 pl-11 bg-black/50 border border-zinc-800 
									text-white placeholder-zinc-600 
									focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
									transition-all duration-300 font-light'
									placeholder='you@example.com'
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor='password' className='block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
									<Lock className='h-4 w-4 text-zinc-500' strokeWidth={1.5} />
								</div>
								<input
									id='password'
									type='password'
									required
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className='block w-full px-4 py-3 pl-11 bg-black/50 border border-zinc-800 
									text-white placeholder-zinc-600
									focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
									transition-all duration-300 font-light'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* Confirm Password Field */}
						<div>
							<label htmlFor='confirmPassword' className='block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2'>
								Confirm Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
									<Lock className='h-4 w-4 text-zinc-500' strokeWidth={1.5} />
								</div>
								<input
									id='confirmPassword'
									type='password'
									required
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									className='block w-full px-4 py-3 pl-11 bg-black/50 border border-zinc-800 
									text-white placeholder-zinc-600
									focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
									transition-all duration-300 font-light'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							className='group relative w-full flex justify-center items-center py-3 px-4 
							bg-white text-black text-sm font-medium uppercase tracking-wide
							hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700
							transition-all duration-300 overflow-hidden
							disabled:opacity-50 disabled:cursor-not-allowed mt-8'
							disabled={loading}
						>
							<div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
							{loading ? (
								<>
									<Loader className='mr-2 h-4 w-4 animate-spin relative z-10' strokeWidth={1.5} />
									<span className='relative z-10'>Creating Account...</span>
								</>
							) : (
								<>
									<UserPlus className='mr-2 h-4 w-4 relative z-10' strokeWidth={1.5} />
									<span className='relative z-10'>Create Account</span>
								</>
							)}
						</button>
					</form>

					{/* Divider */}
					<div className='mt-8 mb-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-zinc-800'></div>
							</div>
							<div className='relative flex justify-center text-xs uppercase tracking-widest'>
								<span className='px-4 bg-zinc-950 text-zinc-600 font-light'>Already a Member?</span>
							</div>
						</div>
					</div>

					{/* Login Link */}
					<div className='text-center'>
						<p className='text-sm text-zinc-400 font-light mb-3'>
							Already have an account?
						</p>
						<Link 
							to='/login' 
							className='inline-flex items-center text-sm text-white hover:text-zinc-300 transition-colors group font-light tracking-wide'
						>
							<span>Sign In</span>
							<ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' strokeWidth={1.5} />
						</Link>
					</div>
				</div>

				{/* Additional Help Text */}
				<p className='mt-6 text-center text-xs text-zinc-600 font-light'>
					By creating an account, you agree to our Terms of Service and Privacy Policy
				</p>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
