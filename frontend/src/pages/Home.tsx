import { Calendar, Clock, Users, Sparkles, ArrowRight, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-4">
          <nav className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AGENDO
              </span>
            </Link>
            <div className="flex gap-3 items-center">
              {user ? (
                <>
                  <span className="text-gray-600 hidden sm:inline">Hola, {user.name}</span>
                  <Link 
                    to="/dashboard" 
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Ir al Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 text-gray-700 font-medium hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Salir</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-5 py-2.5 text-gray-700 font-medium hover:text-indigo-600 transition-colors">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-20 sm:py-24 lg:py-32">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20">
          <div className="w-full max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-sm rounded-full mb-8 shadow-sm border border-gray-200">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Sistema de gestión de citas inteligente</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Gestiona tus citas de forma
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                simple y eficiente
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              AGENDO te ayuda a organizar tu agenda, gestionar clientes y optimizar tu tiempo. 
              Todo en una plataforma intuitiva y moderna.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-xl mx-auto">
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto justify-center"
                >
                  Ir al Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto justify-center"
                  >
                    Comenzar ahora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/about" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center border-2 border-gray-200"
                  >
                    Conocer más
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 sm:py-24 lg:py-28 bg-white mt-8 sm:mt-12 lg:mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Todo lo que necesitas
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas poderosas para gestionar tu negocio de forma eficiente
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Calendar className="w-10 h-10" />}
              title="Agenda Inteligente"
              description="Organiza y visualiza todas tus citas en un calendario interactivo y fácil de usar."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Gestión de Clientes"
              description="Mantén toda la información de tus clientes organizada y accesible en un solo lugar."
              gradient="from-indigo-500 to-purple-500"
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Ahorro de Tiempo"
              description="Automatiza recordatorios y reduce el tiempo dedicado a tareas administrativas."
              gradient="from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 sm:py-24 lg:py-28 mt-8 sm:mt-12 lg:mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20">
          <div className="w-full max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 lg:p-16 xl:p-20 text-center text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              ¿Listo para optimizar tu agenda?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl mb-10 text-indigo-100 max-w-3xl mx-auto">
              Únete a cientos de profesionales que ya confían en AGENDO
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 text-lg rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white mt-20 sm:mt-24 lg:mt-28">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-8 sm:py-12">
          <div className="text-center text-gray-600">
            <p className="text-sm sm:text-base">&copy; 2025 AGENDO. Sistema de gestión de citas profesional.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-8 lg:p-10 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 h-full">
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-base lg:text-lg text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
