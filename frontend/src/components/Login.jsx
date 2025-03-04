import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUser } from '../context/userData'

const LoginForm = () => {
	const [formData, setFormData] = useState({
		emailOrUsername: '',
		password: '',
	})

	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			navigate('/dashboard')
		}
	}, [navigate])

	const { setUserData } = useUser()

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		toast.dismiss()

		if (!formData.emailOrUsername || !formData.password) {
			toast.error('Proszę wypełnić wszystkie pola')
			return
		}

		try {
			const res = await fetch('/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			if (!res.ok) {
				const errorData = await res.json()
				toast.error(errorData.message || 'Coś poszło nie tak')
				return
			}

			const data = await res.json()
			toast.success(data.message || 'Zalogowano pomyślnie')

			localStorage.setItem('token', data.token)

			setUserData(data.user)
			location.reload()
		} catch (error) {
			console.error('Network error:', error.message)
			toast.error(`Błąd serwera: ${error.message}`)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
			<form
				className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105"
				onSubmit={handleSubmit}>
				<h2 className="text-center text-3xl font-bold mb-8 text-gray-800">Logowanie</h2>

				<div className="mb-6">
					<label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-1">
						Email lub Login
					</label>
					<input
						type="text"
						id="emailOrUsername"
						name="emailOrUsername"
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
						value={formData.emailOrUsername}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-6">
					<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
						Hasło
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>

				<button
					type="submit"
					className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
					Zaloguj się
				</button>
			</form>
			<ToastContainer />
		</div>
	)
}

export default LoginForm
