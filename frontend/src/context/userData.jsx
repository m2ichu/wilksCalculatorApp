import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
	const [userData, setUserData] = useState(null)

	useEffect(() => {
		const storedUser = localStorage.getItem('userData')
		if (storedUser) {
			setUserData(JSON.parse(storedUser))
		}
	}, [])

	const updateUserData = data => {
		setUserData(data)
		localStorage.setItem('userData', JSON.stringify(data))
	}

	return <UserContext.Provider value={{ userData, setUserData: updateUserData }}>{children}</UserContext.Provider>
}

export const useUser = () => {
	return useContext(UserContext)
}
