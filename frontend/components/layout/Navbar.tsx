import Link from 'next/link';
import { LayoutDashboard, Sun, Target, LogOut } from 'lucide-react';

const Navbar = () => {
	const navItems = [
		{ name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
		{ name: 'My Day', icon: Sun, href: '/my-day' },
		{ name: 'Projects & Goals', icon: Target, href: '/projects-goals' },
	];

	return (
		<nav className='border-b border-gray-200 bg-white'>
			<div className='max0w07xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex'>
						<div className='shrink-0 flex items-center'>
							<span className='font-bold text-2xl text-red-600'>DOIT</span>
						</div>
						<div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
							{navItems.map(item => (
								<Link
									key={item.href}
									href={item.href}
									className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-gray-300'>
									<item.icon className='w-4 h-4 mr-2' />
									{item.name}
								</Link>
							))}
						</div>
					</div>
					<div className='flex items-center'>
						<button className='p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none'>
							<LogOut className='w-6 h-6' />
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
