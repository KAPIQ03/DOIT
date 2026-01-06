export default function DashboardPage() {
	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-bold text-gray-900'>Witaj User!</h1>

			<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
				{/* Lewa Kolumna */}
				<div className='space-y-6'>
					{/* Sekcja My Day */}
					<div className='bg-white shadow rounded-lg p-6'>
						<h2 className='text-lg font-medium text-gray-900 mb-4'>My Day</h2>
						<div className='space-y-3'>
							{/* Placeholder zadań */}
							<div className='h-8 bg-gray-100 rounded animate-pulse w-3/4'></div>
							<div className='h-8 bg-gray-100 rounded animate-pulse w-1/2'></div>
						</div>
					</div>

					{/* Sekcja Goals */}
					<div className='bg-white shadow rounded-lg p-6'>
						<h2 className='text-lg font-medium text-gray-900 mb-4'>Goals</h2>
						<div className='grid grid-cols-2 gap-4'>
							{[1, 2, 3, 4].map(i => (
								<div
									key={i}
									className='border border-gray-200 rounded p-4 text-center'>
									<div className='font-medium'>Goal {i}</div>
									<div className='text-sm text-gray-500'>3/4</div>
								</div>
							))}
						</div>
					</div>

					{/* Sekcja Projects */}
					<div className='bg-white shadow rounded-lg p-6'>
						<h2 className='text-lg font-medium text-gray-900 mb-4'>Projects</h2>
						<div className='grid grid-cols-2 gap-4'>
							{[1, 2, 3, 4].map(i => (
								<div
									key={i}
									className='border border-gray-200 rounded p-4 text-center'>
									<div className='font-medium'>Project {i}</div>
									<div className='text-sm text-gray-500'>3/4</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Prawa Kolumna - Statystyki */}
				<div className='space-y-6'>
					<div className='bg-white shadow rounded-lg p-6'>
						<h2 className='text-lg font-medium text-gray-900 mb-4'>
							Statistics
						</h2>

						{/* Placeholder Kalendarza */}
						<div className='border border-gray-200 h-48 flex items-center justify-center bg-gray-50 mb-4'>
							<span className='text-gray-400'>
								Calendar Heatmap Placeholder
							</span>
						</div>

						{/* Placeholder Wykresu */}
						<div className='border border-gray-200 h-48 flex items-center justify-center bg-gray-50'>
							<span className='text-gray-400'>Activity Chart Placeholder</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
