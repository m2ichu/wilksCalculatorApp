import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BestResults = () => {
  const [users, setUsers] = useState([]); // Oryginalne dane
  const [sortBy, setSortBy] = useState('date'); // Domyślnie sortowanie po dacie
  const [sortOrder, setSortOrder] = useState('desc'); // Domyślny kierunek sortowania
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // Pobieranie danych z API
  const fetchBestResults = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/bestResults`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error('API Error:', err.message);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestResults();
  }, []);

  // Funkcja sortowania
  const sortedUsers = [...users].sort((a, b) => {
    if (!a.bestResult || !b.bestResult) return 0; // Ignoruj użytkowników bez wyników

    let valueA = sortBy === 'date' ? new Date(a.bestResult.date) : parseFloat(a.bestResult[sortBy]);
    let valueB = sortBy === 'date' ? new Date(b.bestResult.date) : parseFloat(b.bestResult[sortBy]);

    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Best Results</h1>

        {/* Sortowanie */}
        <div className="mb-8 flex gap-4 justify-center">
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
            <select
              id="sortBy"
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weight">Weight</option>
              <option value="powerliftingSumWeight">Powerlifting Sum Weight</option>
              <option value="date">Date</option>
              <option value="points">Points</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOrder === "asc" ? <span>▲ Ascending</span> : <span>▼ Descending</span>}
            </button>
          </div>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="text-center">
            <p className="text-red-500 bg-red-100 px-4 py-2 rounded-md">{error}</p>
          </div>
        )}

        {/* Tabela */}
        {!loading && !error && (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                <tr>
                  {["Username", "First Name", "Last Name", "Email", "Weight", "Powerlifting Sum", "Points", "Date"].map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.firstName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.bestResult ? user.bestResult.weight : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.bestResult ? user.bestResult.powerliftingSumWeight : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.bestResult ? user.bestResult.points : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.bestResult ? user.bestResult.date : 'N/A'}</td>
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

export default BestResults;