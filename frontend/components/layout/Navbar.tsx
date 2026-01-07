'use client';
import Link from 'next/link';
import {
	LayoutDashboard,
	LayoutList,
	Target,
	LogOut,
	User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/auth';

export default function Navbar() {
	const { user, logout } = useAuth();

	const navItems = [
		{ name: 'Panel Główny', href: '/dashboard', icon: LayoutDashboard },
		{ name: 'Mój Dzień', href: '/my-day', icon: LayoutList },
		{ name: 'Projekty i Cele', href: '/projects-goals', icon: Target },
	];

	return (
		<nav className='border-b border-gray-200 bg-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex'>
						<div className='shrink-0 flex items-center'>
							<span className='text-2xl font-bold text-red-600'>Doit</span>
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

					<div className='flex items-center space-x-4'>
						{user && (
							<div className='flex items-center text-sm font-medium text-gray-700'>
								<UserIcon className='w-4 h-4 mr-1' />
								{user.name}
							</div>
						)}
						<button
							onClick={logout}
							className='p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none'>
							<LogOut className='w-6 h-6' />
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
