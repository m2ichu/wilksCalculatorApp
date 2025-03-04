import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BestResults = () => {
	const [users, setUsers] = useState([])
	const [sortBy, setSortBy] = useState('date')
	const [sortOrder, setSortOrder] = useState('desc')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		const user = JSON.parse(localStorage.getItem('userData'))
		if (!token || !user) navigate('/')
		if (!user.isAdmin) navigate('/dashboard')
	}, [navigate])

	const fetchBestResults = async () => {
		setLoading(true)
		setError('')
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/admin/bestResults?sortBy=${sortBy}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Failed to fetch data')
			}

			const data = await response.json()
			if (!Array.isArray(data.users)) throw new Error('Invalid data format')
			setUsers(data.users)
		} catch (err) {
			console.error('API Error:', err.message)
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchBestResults()
	}, [sortBy])

	const sortedUsers = users
		.map(user => {
			const bestResult = user.results?.[0] || {}
			return { ...user, bestResult }
		})
		.sort((a, b) => {
			let valueA = sortBy === 'date' ? new Date(a.bestResult.date || 0) : parseFloat(a.bestResult[sortBy] || 0)
			let valueB = sortBy === 'date' ? new Date(b.bestResult.date || 0) : parseFloat(b.bestResult[sortBy] || 0)
			return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
		})

	const formatDate = dateString => {
		const date = new Date(dateString)
		const day = String(date.getUTCDate()).padStart(2, '0')
		const month = String(date.getUTCMonth() + 1).padStart(2, '0')
		const year = date.getUTCFullYear()
		return `${day}/${month}/${year}`
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Best Results</h1>
				<div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-end">
					<div className="w-full sm:w-auto">
						<label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
							Sort By
						</label>
						<select
							id="sortBy"
							value={sortBy}
							onChange={e => setSortBy(e.target.value)}
							className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
							<option value="weight">Weight</option>
							<option value="powerliftingSumWeight">Powerlifting Sum Weight</option>
							<option value="date">Date</option>
							<option value="points">Points</option>
						</select>
					</div>
					<div className="w-full sm:w-auto">
						<button
							onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
							className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
							{sortOrder === 'asc' ? '▲ Ascending' : '▼ Descending'}
						</button>
					</div>
				</div>
				{loading && <div className="text-center text-blue-600">Loading...</div>}
				{error && <div className="text-center text-red-500">{error}</div>}
				{!loading && !error && (
					<div className="overflow-x-auto bg-white shadow-lg rounded-lg">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-blue-600 text-white">
								<tr>
									{['Username', 'First Name', 'Last Name', 'Email', 'Weight', 'Powerlifting Sum', 'Points', 'Date'].map(
										(header, index) => (
											<th key={index} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
												{header}
											</th>
										)
									)}
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{sortedUsers.map((user, index) => (
									<tr key={index} className="hover:bg-gray-50 transition-colors">
										<td className="px-4 py-4 text-sm text-gray-900">{user.username}</td>
										<td className="px-4 py-4 text-sm text-gray-900">{user.firstName}</td>
										<td className="px-4 py-4 text-sm text-gray-900">{user.lastName}</td>
										<td className="px-4 py-4 text-sm text-gray-900">{user.email}</td>
										<td className="px-4 py-4 text-sm text-gray-900">{user.bestResult.weight || 'N/A'}</td>
										<td className="px-4 py-4 text-sm text-gray-900">
											{user.bestResult.powerliftingSumWeight || 'N/A'}
										</td>
										<td className="px-4 py-4 text-sm text-gray-900">{user.bestResult.points || 'N/A'}</td>
										<td className="px-4 py-4 text-sm text-gray-900">
											{user.bestResult.date ? formatDate(user.bestResult.date) : 'N/A'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}

export default BestResults
