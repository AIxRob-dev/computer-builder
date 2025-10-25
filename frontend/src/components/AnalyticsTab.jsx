import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-20'>
				<div className='text-center space-y-4'>
					<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
					<p className='text-zinc-400 font-light tracking-wide'>Loading analytics...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-8 sm:space-y-10 lg:space-y-12'>
			{/* Stats Cards Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					trend={12.5}
					trendLabel='vs last month'
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					trend={8.2}
					trendLabel='vs last month'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					trend={-3.1}
					trendLabel='vs last month'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
					trend={15.8}
					trendLabel='vs last month'
				/>
			</div>

			{/* Sales Chart Section */}
			<motion.div
				className='bg-zinc-950/50 border border-zinc-800/50 p-4 sm:p-6 lg:p-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
			>
				{/* Chart Header */}
				<div className='mb-6 sm:mb-8'>
					<div className='flex items-center gap-3 mb-2'>
						<div className='h-[1px] w-8 bg-zinc-700' />
						<h3 className='text-xs uppercase tracking-[0.3em] text-zinc-500 font-light'>
							Performance
						</h3>
					</div>
					<h2 className='text-xl sm:text-2xl font-light text-white tracking-tight'>
						Sales & Revenue Overview
					</h2>
				</div>

				{/* Chart */}
				<div className='w-full overflow-x-auto'>
					<ResponsiveContainer width='100%' height={400} minWidth={300}>
						<LineChart data={dailySalesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
							<CartesianGrid strokeDasharray='3 3' stroke='#27272a' strokeOpacity={0.5} />
							<XAxis 
								dataKey='name' 
								stroke='#71717a' 
								style={{ fontSize: '12px', fontWeight: '300' }}
								tick={{ fill: '#71717a' }}
							/>
							<YAxis 
								yAxisId='left' 
								stroke='#71717a'
								style={{ fontSize: '12px', fontWeight: '300' }}
								tick={{ fill: '#71717a' }}
							/>
							<YAxis 
								yAxisId='right' 
								orientation='right' 
								stroke='#71717a'
								style={{ fontSize: '12px', fontWeight: '300' }}
								tick={{ fill: '#71717a' }}
							/>
							<Tooltip 
								contentStyle={{ 
									backgroundColor: '#18181b', 
									border: '1px solid #3f3f46',
									borderRadius: '0',
									color: '#fff',
									fontWeight: '300'
								}}
								labelStyle={{ color: '#a1a1aa', fontSize: '12px', fontWeight: '300' }}
								itemStyle={{ color: '#fff', fontSize: '12px' }}
							/>
							<Legend 
								wrapperStyle={{ 
									paddingTop: '20px',
									fontSize: '12px',
									fontWeight: '300'
								}}
							/>
							<Line
								yAxisId='left'
								type='monotone'
								dataKey='sales'
								stroke='#ffffff'
								strokeWidth={2}
								activeDot={{ r: 6, fill: '#ffffff' }}
								name='Sales'
								dot={{ fill: '#ffffff', r: 3 }}
							/>
							<Line
								yAxisId='right'
								type='monotone'
								dataKey='revenue'
								stroke='#71717a'
								strokeWidth={2}
								activeDot={{ r: 6, fill: '#71717a' }}
								name='Revenue ($)'
								dot={{ fill: '#71717a', r: 3 }}
								strokeDasharray='5 5'
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</motion.div>
		</div>
	);
};

const AnalyticsCard = ({ title, value, icon: Icon, trend, trendLabel }) => {
	const isPositive = trend > 0;
	
	return (
		<motion.div
			className='group bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 p-4 sm:p-5 lg:p-6 
			transition-all duration-300 relative overflow-hidden'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			whileHover={{ y: -4 }}
		>
			{/* Background Icon - Subtle */}
			<div className='absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300'>
				<Icon className='w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40' strokeWidth={1} />
			</div>

			{/* Content */}
			<div className='relative z-10 space-y-3 sm:space-y-4'>
				{/* Icon & Title */}
				<div className='flex items-start justify-between'>
					<div className='space-y-1'>
						<div className='flex items-center gap-2'>
							<Icon className='w-4 h-4 text-zinc-500' strokeWidth={1.5} />
							<p className='text-xs uppercase tracking-wider text-zinc-500 font-light'>
								{title}
							</p>
						</div>
					</div>
				</div>

				{/* Value */}
				<div>
					<h3 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight'>
						{value}
					</h3>
				</div>

				{/* Trend Indicator */}
				<div className='flex items-center gap-2 pt-2 border-t border-zinc-800/50'>
					<div className={`flex items-center gap-1 text-xs font-light ${
						isPositive ? 'text-white' : 'text-zinc-500'
					}`}>
						{isPositive ? (
							<TrendingUp className='w-3 h-3' strokeWidth={1.5} />
						) : (
							<TrendingDown className='w-3 h-3' strokeWidth={1.5} />
						)}
						<span>{isPositive ? '+' : ''}{trend}%</span>
					</div>
					<span className='text-xs text-zinc-600 font-light'>{trendLabel}</span>
				</div>
			</div>

			{/* Hover Bottom Accent */}
			<div className='absolute bottom-0 left-0 right-0 h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300' />
		</motion.div>
	);
};

export default AnalyticsTab;
