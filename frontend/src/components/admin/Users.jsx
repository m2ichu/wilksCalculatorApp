import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Users = () => {
	const [users, setUsers] = useState([])
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		const user = JSON.parse(localStorage.getItem('userData'))
		if (!token || !user) navigate('/')
		if (!user.isAdmin) navigate('/dashboard')
	}, [navigate])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get('/api/admin/confirmedUsers', {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				})

				if (response.data && Array.isArray(response.data.users)) {
					setUsers(response.data.users)
				} else {
					setError('Invalid data format received.')
				}
			} catch (err) {
				setError('Error fetching users.', err)
			}
		}

		fetchUsers()
	}, [])

	const handleDelete = async userId => {
		// Potwierdzenie przed usunięciem
		const confirmDelete = window.confirm('Are you sure you want to delete this user?')
		if (!confirmDelete) return // Anuluj, jeśli użytkownik nie potwierdzi

		try {
			await axios.delete('/api/admin/deleteUser', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				data: { id: userId },
			})
			setUsers(users.filter(user => user._id !== userId))
		} catch (err) {
			setError('Error deleting user.', err)
		}
	}

	return (
		<div className="container mx-auto my-8 p-4 bg-gray-50 rounded-lg shadow-md">
			<h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Users List</h1>
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">{error}</div>
			)}
			<div className="overflow-x-auto bg-white rounded-lg shadow">
				<table className="min-w-full">
					<thead className="bg-gray-200">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
								First Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
								Last Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
								Username
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
								Confirmed At
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{users.length > 0 ? (
							users.map(user => (
								<tr key={user._id} className="hover:bg-gray-50 transition-colors">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.firstName}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.lastName}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.username}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
										{new Date(user.confirmedAt).toLocaleString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<button
											onClick={() => handleDelete(user._id)}
											className="text-red-500 hover:text-red-700 font-semibold hover:underline">
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="6" className="px-6 py-4 text-center text-gray-500">
									No users found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Users
