import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Stan do zarządzania otwartym/zamkniętym menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Przełączanie stanu menu
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-xl">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo / Brand Name */}
        <div className="text-white text-3xl font-extrabold tracking-wider hover:text-blue-200 transition duration-300">
          <Link to="/">WilksApp</Link>
        </div>

        {/* Burger Menu Icon (visible on small screens) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links (visible on medium and larger screens) */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/login"
            className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-semibold py-2 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-800 hover:to-indigo-700 text-white font-semibold py-2 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Full-screen Mobile Menu (visible on small screens when menu is open) */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-50 flex flex-col items-center justify-center">
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-white focus:outline-none"
            aria-label="Close menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <ul className="flex flex-col space-y-6">
            <li>
              <Link
                to="/login"
                className="block bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
                onClick={toggleMenu} // Zamknij menu po kliknięciu
              >
                Log In
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="block bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-800 hover:to-indigo-700 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
                onClick={toggleMenu} // Zamknij menu po kliknięciu
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;