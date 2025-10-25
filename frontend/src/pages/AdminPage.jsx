import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900'>
			<div className='relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16'>
				{/* Header Section */}
				<motion.div
					className='mb-8 sm:mb-12 lg:mb-16'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{/* Top Accent Line */}
					<div className='flex items-center gap-3 mb-4'>
						<div className='h-[1px] w-8 sm:w-12 bg-zinc-700' />
						<span className='text-[10px] sm:text-xs uppercase tracking-[0.3em] text-zinc-600 font-light'>
							Administration
						</span>
					</div>

					{/* Main Title */}
					<h1 className='text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight'>
						Dashboard
					</h1>
				</motion.div>

				{/* Tab Navigation - Desktop */}
				<motion.div 
					className='hidden sm:flex items-center justify-start gap-2 mb-8 lg:mb-12 border-b border-zinc-800/50 pb-0.5'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					{tabs.map((tab, index) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`group relative flex items-center gap-2 px-4 lg:px-6 py-3 text-sm lg:text-base font-light uppercase tracking-wide
							transition-all duration-300 border-b-2
							${activeTab === tab.id
								? 'text-white border-white'
								: 'text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700'
							}`}
						>
							<tab.icon className='w-4 h-4 lg:w-5 lg:h-5' strokeWidth={1.5} />
							<span>{tab.label}</span>
							
							{/* Subtle background on active */}
							{activeTab === tab.id && (
								<motion.div
									layoutId="activeTab"
									className='absolute inset-0 bg-zinc-900/30 -z-10'
									transition={{ type: "spring", duration: 0.6 }}
								/>
							)}
						</button>
					))}
				</motion.div>

				{/* Tab Navigation - Mobile */}
				<motion.div 
					className='sm:hidden mb-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div className='grid grid-cols-3 gap-2'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2
								border transition-all duration-300
								${activeTab === tab.id
									? 'bg-zinc-900 border-zinc-700 text-white'
									: 'bg-zinc-950 border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
								}`}
							>
								<tab.icon className='w-5 h-5' strokeWidth={1.5} />
								<span className='text-[10px] uppercase tracking-wider font-light'>
									{tab.label}
								</span>
								
								{/* Active indicator */}
								{activeTab === tab.id && (
									<div className='absolute bottom-0 left-0 right-0 h-[2px] bg-white' />
								)}
							</button>
						))}
					</div>
				</motion.div>

				{/* Tab Content */}
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.4 }}
					className='relative'
				>
					{/* Content Background */}
					<div className='bg-zinc-950/50 border border-zinc-800/50 p-4 sm:p-6 lg:p-8'>
						{activeTab === "create" && <CreateProductForm />}
						{activeTab === "products" && <ProductsList />}
						{activeTab === "analytics" && <AnalyticsTab />}
					</div>
				</motion.div>

				{/* Bottom Accent Line */}
				<div className='mt-12 sm:mt-16 flex items-center gap-3'>
					<div className='h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent' />
				</div>
			</div>
		</div>
	);
};

export default AdminPage;
