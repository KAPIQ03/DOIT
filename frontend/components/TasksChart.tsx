'use client';

import {
	ResponsiveContainer,
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Line,
} from 'recharts';

export default function TasksChart({ data }: { data: any[] }) {
	return (
		<div className='h-48 w-full text-gray-700'>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='name' />
					<YAxis allowDecimals={false} />
					<Tooltip />
					<Line
						type='monotone'
						dataKey='completed'
						stroke='#dc2626'
						activeDot={{ r: 8 }}
						name='Ukończone zadania'
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
