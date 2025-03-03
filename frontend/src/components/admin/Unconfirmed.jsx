import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UnconfirmedUsers = () => {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const formatDate = dateString => {
		const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
		return new Date(dateString).toLocaleDateString('pl-PL', options)
	}

	const navigate = useNavigate() // Hook do przekierowania

	useEffect(() => {
		const token = localStorage.getItem('token')
		const user = JSON.parse(localStorage.getItem('userData'))

		if (!token || !user) {
			navigate('/')
		}

		const isUserAdmin = user.isAdmin

		if (!isUserAdmin) {
			navigate('/dashboard')
		}
	}, [navigate])

	useEffect(() => {
		const fetchUnconfirmedUsers = async () => {
			try {
				const token = localStorage.getItem('token') // Pobierz token z localStorage
				const response = await axios.get('api/admin/unconfirmed', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (response.data.users.length === 0) {
					setError('Brak niepotwierdzonych użytkowników')
				} else {
					setUsers(response.data.users)
				}
			} catch (err) {
				setError('Błąd serwera: Nie udało się pobrać danych')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchUnconfirmedUsers()
	}, [])

	// Funkcja do potwierdzania użytkownika
	const handleConfirmUser = async id => {
		try {
			const token = localStorage.getItem('token')
			const response = await axios.put(
				'api/admin/confirmUser',
				{ id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (response.status === 200) {
				// Aktualizuj listę użytkowników po potwierdzeniu
				setUsers(prevUsers => prevUsers.filter(user => user._id !== id))
				alert('Użytkownik został pomyślnie zatwierdzony')
			}
		} catch (err) {
			console.error('Błąd podczas potwierdzania użytkownika:', err)
			alert('Wystąpił błąd podczas potwierdzania użytkownika')
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-blue-500 text-lg">Ładowanie...</p>
			</div>
		)
	}

	return (
		<div className="p-6 max-w-6xl mx-auto w-full ">
			<h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Niepotwierdzeni użytkownicy</h1>
			{error ? (
				<p className="text-red-500 text-center text-lg">{'brak niepotwierdzonych użytkowników'}</p>
			) : (
				<>
					<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
						<thead className="bg-gray-100">
							<tr>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">Nazwa użytkownika</th>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">Imię i nazwisko</th>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">Data założenia konta</th>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">Potwierdzenie</th>
							</tr>
						</thead>
						<tbody>
							{users.map(user => (
								<tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
									<td className="py-3 px-4 text-gray-700">{user.username}</td>
									<td className="py-3 px-4 text-gray-700">
										{user.firstName} {user.lastName}
									</td>
									<td className="py-3 px-4 text-gray-700">{formatDate(user.createdAt)}</td>
									<td className="py-3 px-4 text-gray-700">{user.email}</td>
									<td className="py-3 px-4">
										<button
											className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-200"
											onClick={() => handleConfirmUser(user._id)}>
											Potwierdź
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			)}
		</div>
	)
}

export default UnconfirmedUsers
