import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, password);
		login(email, password);
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
					Welcome Back
				</h2>
				<p className='text-center text-sm sm:text-base text-zinc-400 font-light'>
					Sign in to your account
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
									value={email}
									onChange={(e) => setEmail(e.target.value)}
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
									value={password}
									onChange={(e) => setPassword(e.target.value)}
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
									<span className='relative z-10'>Signing In...</span>
								</>
							) : (
								<>
									<LogIn className='mr-2 h-4 w-4 relative z-10' strokeWidth={1.5} />
									<span className='relative z-10'>Sign In</span>
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
								<span className='px-4 bg-zinc-950 text-zinc-600 font-light'>New Here?</span>
							</div>
						</div>
					</div>

					{/* Sign Up Link */}
					<div className='text-center'>
						<p className='text-sm text-zinc-400 font-light mb-3'>
							Don't have an account yet?
						</p>
						<Link 
							to='/signup' 
							className='inline-flex items-center text-sm text-white hover:text-zinc-300 transition-colors group font-light tracking-wide'
						>
							<span>Create Account</span>
							<ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' strokeWidth={1.5} />
						</Link>
					</div>
				</div>

				{/* Additional Help Text */}
				<p className='mt-6 text-center text-xs text-zinc-600 font-light'>
					By signing in, you agree to our Terms of Service and Privacy Policy
				</p>
			</motion.div>
		</div>
	);
};

export default LoginPage;
