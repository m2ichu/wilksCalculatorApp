import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const navigate = useNavigate()
	const user = JSON.parse(localStorage.getItem('userData')) || {}

	useEffect(() => {
		const token = localStorage.getItem('token')
		setIsLoggedIn(!!token)
	}, [])

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('userData')
		setIsLoggedIn(false)
		navigate('/')
	}

	return (
		<nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-xl">
			<div className="max-w-screen-xl mx-auto flex justify-between items-center">
				<div className="text-white text-3xl font-extrabold tracking-wider hover:text-blue-200 transition duration-300">
					<Link to="/">WilksApp</Link>
				</div>

				<div className="md:hidden">
					<button onClick={toggleMenu} className="text-white focus:outline-none" aria-label="Toggle menu">
						<svg
							className="w-8 h-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							{isMenuOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
							)}
						</svg>
					</button>
				</div>

				<div className="hidden md:flex space-x-6">
					{isLoggedIn ? (
						<>
							{user.isAdmin && (
								<>
									<Link
										to="/allUsers"
										className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
										Users
									</Link>
									<Link
										to="/bestResults"
										className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
										Best
									</Link>
									<Link
										to="/dashboard"
										className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
										Dashboard
									</Link>
									<Link
										to="/unconfirmed"
										className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
										New user
									</Link>
								</>
							)}
							<button
								onClick={handleLogout}
								className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-semibold py-2 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
								Log In
							</Link>
							<Link
								to="/signup"
								className="bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-800 hover:to-indigo-700 text-white font-semibold py-2 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>

			{isMenuOpen && (
				<div className="md:hidden fixed inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-50 flex flex-col items-center justify-center">
					<button
						onClick={toggleMenu}
						className="absolute top-4 right-4 text-white focus:outline-none"
						aria-label="Close menu">
						<svg
							className="w-8 h-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
					<ul className="flex flex-col items-center space-y-6">
						{isLoggedIn ? (
							<>
								{user.isAdmin && (
									<>
										<li>
											<Link
												to="/allUsers"
												className="block bg-gradient-to-b from-blue-900 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
												onClick={toggleMenu}>
												Users
											</Link>
										</li>
										<li>
											<Link
												to="/bestResults"
												className="block bg-gradient-to-b from-blue-900 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
												onClick={toggleMenu}>
												Best results
											</Link>
										</li>
										<li>
											<Link
												to="/dashboard"
												className="block bg-gradient-to-b from-blue-700 to-green-500 hover:from-blue-800 hover:to-green-600 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
												onClick={toggleMenu}>
												Dashboard
											</Link>
										</li>
										<li>
											<Link
												to="/unconfirmed"
												className="block bg-gradient-to-b from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
												onClick={toggleMenu}>
												Accept new
											</Link>
										</li>
									</>
								)}
								<li>
									<button
										onClick={() => {
											handleLogout()
											toggleMenu()
										}}
										className="block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center">
										Logout
									</button>
								</li>
							</>
						) : (
							<>
								<li>
									<Link
										to="/login"
										className="block bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
										onClick={toggleMenu}>
										Log In
									</Link>
								</li>
								<li>
									<Link
										to="/signup"
										className="block bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-800 hover:to-indigo-700 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
										onClick={toggleMenu}>
										Sign Up
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			)}
		</nav>
	)
}

export default Navbar
