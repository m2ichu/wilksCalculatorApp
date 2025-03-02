import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook do przekierowania

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      navigate('/dashboard'); 
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-6 md:py-8 shadow-xl">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white animate-fade-in">
            Witaj w aplikacji WilksApp!
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex mt-8 sm:mt-12 md:mt-16 justify-center p-4 sm:p-6 md:p-8">
        {!isLoggedIn && (
          <div className="text-center max-w-2xl md:max-w-3xl text-white animate-slide-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-white bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
              Czym jest WilksApp?
            </h2>
            <p className="text-lg sm:text-xl mb-6 md:mb-8 leading-relaxed">
              WilksApp to aplikacja zaprojektowana z myślą o miłośnikach trójboju siłowego. Umożliwia łatwe obliczanie
              wyników na podstawie wagi ciała oraz wyników w trójboju, umożliwiając użytkownikom monitorowanie swoich
              postępów w czasie.
            </p>
            <p className="text-base sm:text-lg mb-8 md:mb-12 text-blue-100">
              Zaloguj się, aby skorzystać z pełnej funkcjonalności aplikacji i śledzić swoje wyniki.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-12 sm:py-4 sm:px-16 rounded-full transition-all duration-300 transform hover:scale-110"
            >
              Zaloguj się
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;