import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('userData')) || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: user.weight || '',
    powerliftingSumWeight: '',
    points: '',
  });
  const [wilksScore, setWilksScore] = useState(0);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState('male'); // Default to male if no gender is set
  const [results, setResults] = useState([]); // Stan do przechowywania wyników
  const [sortBy, setSortBy] = useState('date'); // Pole do sortowania
  const [sortOrder, setSortOrder] = useState('desc'); // Kolejność sortowania

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user || !user.firstName) {
      navigate('/');
    } else {
      fetchResults(); // Pobierz wyniki po zalogowaniu
    }
  }, [navigate, user]);

  // Funkcja do pobierania wyników z API
  const fetchResults = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/getResults?userId=${user._id}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać wyników');
      }

      const data = await response.json();
      setResults(data.results); // Ustaw wyniki w stanie
    } catch (error) {
      setError(error.message);
      console.error('Błąd pobierania wyników:', error);
    }
  };

  // Efekt do ponownego pobierania wyników przy zmianie sortowania
  useEffect(() => {
    fetchResults();
  }, [sortBy, sortOrder]);

  const calculateWilksScore = (weight, total, gender) => {
    if (!weight || !total) return 0;

    let a, b, c, d, e, f;

    if (gender === 'male') {
      a = -216.0475144;
      b = 16.2606339;
      c = -0.002388645;
      d = -0.00113732;
      e = 7.01863e-6;
      f = -1.291e-8;
    } else {
      a = -198.5170296;
      b = 13.4127346;
      c = -0.002256158;
      d = -0.000190058;
      e = 8.056e-6;
      f = -1.707e-8;
    }

    const wilksCoefficient =
      500 /
      (a + b * weight + c * Math.pow(weight, 2) + d * Math.pow(weight, 3) + e * Math.pow(weight, 4) + f * Math.pow(weight, 5));

    return (total * wilksCoefficient).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (name === 'weight' || name === 'powerliftingSumWeight') {
      const weight = parseFloat(newFormData.weight) || 0;
      const total = parseFloat(newFormData.powerliftingSumWeight) || 0;
      const wilks = calculateWilksScore(weight, total, gender);
      setWilksScore(wilks);
    }
  };

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setGender(selectedGender);

    // Recalculate Wilks score when gender changes
    const weight = parseFloat(formData.weight) || 0;
    const total = parseFloat(formData.powerliftingSumWeight) || 0;
    const wilks = calculateWilksScore(weight, total, selectedGender);
    setWilksScore(wilks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dane formularza:', formData, 'Wilks:', wilksScore);

    try {
      const response = await fetch('http://localhost:3000/api/users/addResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: user._id,
          weight: parseInt(formData.weight) || 0,
          powerliftingSumWeight: parseInt(formData.powerliftingSumWeight) || 0,
          points: parseFloat(wilksScore) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się dodać wyniku');
      }

      const data = await response.json();
      console.log('Wynik dodany pomyślnie:', data);

      setFormData({ weight: user.weight, powerliftingSumWeight: '', points: '' });
      setWilksScore(0);
      setError(null);
      fetchResults(); // Odśwież wyniki po dodaniu nowego
    } catch (error) {
      setError(error.message);
      console.error('Błąd dodawania wyniku:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-800 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Witaj, {user.firstName}</h1>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">Dodaj nowy wynik</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Płeć:</label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={handleGenderChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Mężczyzna</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={handleGenderChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Kobieta</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Waga (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Suma trójboju (kg):</label>
            <input
              type="number"
              name="powerliftingSumWeight"
              value={formData.powerliftingSumWeight}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Punktacja Wilksa:</label>
            <input
              type="text"
              value={wilksScore}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
          >
            Dodaj do bazy
          </button>
        </form>

        {/* Sekcja wyświetlająca wyniki w tabeli */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Twoje wyniki</h2>
          <div className="flex space-x-4 mb-4">
            <label className="block text-sm font-medium text-gray-700">Sortuj według:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Data</option>
              <option value="weight">Waga</option>
              <option value="powerliftingSumWeight">Suma trójboju</option>
              <option value="points">Punkty Wilksa</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="asc">Rosnąco</option>
              <option value="desc">Malejąco</option>
            </select>
          </div>
          {results.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>Brak wyników do wyświetlenia. Dodaj pierwszy wynik!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Data</th>
                    <th className="px-4 py-2 border">Waga (kg)</th>
                    <th className="px-4 py-2 border">Suma trójboju (kg)</th>
                    <th className="px-4 py-2 border">Punkty Wilksa</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{new Date(result.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">{result.weight}</td>
                      <td className="px-4 py-2 border">{result.powerliftingSumWeight}</td>
                      <td className="px-4 py-2 border">{result.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;