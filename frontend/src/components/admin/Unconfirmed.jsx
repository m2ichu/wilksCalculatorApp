import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UnconfirmedUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
		return new Date(dateString).toLocaleDateString('pl-PL', options);
	};

	const navigate = useNavigate(); // Hook do przekierowania

	useEffect(() => {
		const token = localStorage.getItem('token');
		const user = JSON.parse(localStorage.getItem('userData'));

		if (!token || !user) {
			navigate('/');
		}

		const isUserAdmin = user.isAdmin;

		if (!isUserAdmin) {
			navigate('/dashboard');
		}
	}, [navigate]);

	useEffect(() => {
		const fetchUnconfirmedUsers = async () => {
			try {
				const token = localStorage.getItem('token'); // Pobierz token z localStorage
				const response = await axios.get('/api/admin/unconfirmed', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.data.users.length === 0) {
					setError('Brak niepotwierdzonych użytkowników');
				} else {
					setUsers(response.data.users);
				}
			} catch (err) {
				setError('Błąd serwera: Nie udało się pobrać danych');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchUnconfirmedUsers();
	}, []);

	// Funkcja do potwierdzania użytkownika
	const handleConfirmUser = async (id) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.put(
				'api/admin/confirmUser',
				{ id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				// Aktualizuj listę użytkowników po potwierdzeniu
				setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
				alert('Użytkownik został pomyślnie zatwierdzony');
			}
		} catch (err) {
			console.error('Błąd podczas potwierdzania użytkownika:', err);
			alert('Wystąpił błąd podczas potwierdzania użytkownika');
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Niepotwierdzeni użytkownicy</h1>
				{error ? (
					<p className="text-center text-gray-600 bg-gray-100 p-4 rounded-lg shadow-sm">{error}</p>
				) : (
					<div className="overflow-x-auto bg-white shadow-lg rounded-lg">
						<table className="min-w-full">
							<thead className="bg-gradient-to-r from-blue-600 to-purple-600">
								<tr>
									{['Nazwa użytkownika', 'Imię i nazwisko', 'Data założenia konta', 'Email', 'Potwierdzenie'].map(
										(header, index) => (
											<th
												key={index}
												className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
												{header}
											</th>
										)
									)}
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{users.map((user) => (
									<tr key={user._id} className="hover:bg-gray-50 transition-colors">
										<td className="py-4 px-6 text-sm text-gray-900">{user.username}</td>
										<td className="py-4 px-6 text-sm text-gray-900">
											{user.firstName} {user.lastName}
										</td>
										<td className="py-4 px-6 text-sm text-gray-900">{formatDate(user.createdAt)}</td>
										<td className="py-4 px-6 text-sm text-gray-900">{user.email}</td>
										<td className="py-4 px-6">
											<button
												className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
												onClick={() => handleConfirmUser(user._id)}>
												Potwierdź
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default UnconfirmedUsers;