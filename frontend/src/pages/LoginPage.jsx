import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader, AlertCircle } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { debugAuth } from "../utils/debugAuth";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [debugInfo, setDebugInfo] = useState(null);

	const { login, loading, error } = useUserStore();

	// Run debug on mount in development
	useEffect(() => {
		if (import.meta.env.MODE === "development") {
			debugAuth.fullDebug(
				import.meta.env.MODE === "development"
					? "http://localhost:5000/api"
					: "https://computerbuilders-in.onrender.com/api"
			).then(setDebugInfo);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		console.log("🔐 Login attempt:", { email });
		
		// Check cookies before login
		debugAuth.checkCookies();
		
		try {
			await login(email, password);
			
			// Check cookies after login
			setTimeout(() => {
				const cookieStatus = debugAuth.checkCookies();
				if (!cookieStatus.hasAccessToken) {
					console.error("⚠️ WARNING: Login succeeded but no cookies were set!");
				}
			}, 1000);
		} catch (err) {
			console.error("❌ Login failed:", err);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8'>
			{/* Debug Info Banner - Development Only */}
			{import.meta.env.MODE === "development" && debugInfo && (
				<div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-xs p-2 z-50">
					<strong>DEBUG:</strong> {debugInfo.deviceInfo.isMobile ? "📱 Mobile" : "💻 Desktop"} | 
					Cookies: {debugInfo.cookieStatus.hasAccessToken ? "✅" : "❌"} | 
					Connection: {debugInfo.connectionTest.success ? "✅" : "❌"}
				</div>
			)}

			{/* Header Section */}
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<h2 className='text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight'>
					Welcome Back
				</h2>
				<p className='text-center text-sm sm:text-base text-blue-100 font-semibold'>
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
				<div className='bg-white rounded-xl shadow-2xl py-8 sm:py-10 px-6 sm:px-10'>
					{/* Error Message */}
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'
						>
							<AlertCircle className='h-5 w-5 text-red-600 flex-shrink-0 mt-0.5' />
							<div>
								<p className='text-sm font-semibold text-red-800'>Login Failed</p>
								<p className='text-xs text-red-600 mt-1'>{error}</p>
							</div>
						</motion.div>
					)}

					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Email Field */}
						<div>
							<label htmlFor='email' className='block text-xs uppercase tracking-widest text-gray-700 font-bold mb-2'>
								Email Address
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
									<Mail className='h-4 w-4 text-blue-600' strokeWidth={2} />
								</div>
								<input
									id='email'
									type='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='block w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-lg
									text-gray-900 placeholder-gray-400 font-medium
									focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
									transition-all duration-300'
									placeholder='you@example.com'
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor='password' className='block text-xs uppercase tracking-widest text-gray-700 font-bold mb-2'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
									<Lock className='h-4 w-4 text-blue-600' strokeWidth={2} />
								</div>
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='block w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-lg
									text-gray-900 placeholder-gray-400 font-medium
									focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
									transition-all duration-300'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							className='group relative w-full flex justify-center items-center py-3 px-4 
							bg-blue-600 text-white text-sm font-bold uppercase tracking-wide rounded-lg
							hover:bg-blue-700 shadow-lg hover:shadow-xl
							transition-all duration-300
							disabled:opacity-50 disabled:cursor-not-allowed mt-8'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-4 w-4 animate-spin relative z-10' strokeWidth={2} />
									<span className='relative z-10'>Signing In...</span>
								</>
							) : (
								<>
									<LogIn className='mr-2 h-4 w-4 relative z-10' strokeWidth={2} />
									<span className='relative z-10'>Sign In</span>
								</>
							)}
						</button>
					</form>

					{/* Divider */}
					<div className='mt-8 mb-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t-2 border-gray-200'></div>
							</div>
							<div className='relative flex justify-center text-xs uppercase tracking-widest'>
								<span className='px-4 bg-white text-gray-500 font-bold'>New Here?</span>
							</div>
						</div>
					</div>

					{/* Sign Up Link */}
					<div className='text-center'>
						<p className='text-sm text-gray-600 font-semibold mb-3'>
							Don't have an account yet?
						</p>
						<Link 
							to='/signup' 
							className='inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors group font-bold tracking-wide'
						>
							<span>Create Account</span>
							<ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' strokeWidth={2} />
						</Link>
					</div>
				</div>

				{/* Additional Help Text */}
				<p className='mt-6 text-center text-xs text-blue-100 font-semibold'>
					By signing in, you agree to our Terms of Service and Privacy Policy
				</p>
			</motion.div>
		</div>
	);
};

export default LoginPage;
