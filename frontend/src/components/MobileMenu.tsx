import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Users, Briefcase, Home } from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Botón del menú - Solo visible en móviles */}
      <button
        onClick={toggleMenu}
        className="xl:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Menú de navegación"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40 xl:hidden"
        />
      )}

      {/* Panel del menú */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out xl:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header del menú */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Menú</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Enlaces del menú */}
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>

            <Link
              to="/appointments"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/appointments')
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Citas
            </Link>

            <Link
              to="/customers"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/customers')
                  ? 'bg-teal-50 text-teal-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Clientes
            </Link>

            <Link
              to="/services"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/services')
                  ? 'bg-purple-50 text-purple-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Servicios
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
