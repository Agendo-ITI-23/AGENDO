import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Tag, LogOut, Users, FileText, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MobileMenu from '../components/MobileMenu';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface Appointment {
  id: number;
  appointment_date: string;
  status: string;
  notes: string;
  customer: Customer;
  service: Service;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUpcomingAppointments();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const loadUpcomingAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/upcoming');
      setUpcomingAppointments(response.data.data);
      setLoading(false);
    } catch {
      setError('Error al cargar las citas próximas');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Bienvenido, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto items-center">
              <MobileMenu />
              <Link
                to="/appointments"
                className="hidden xl:flex items-center gap-2 px-5 py-3 text-indigo-600 font-semibold border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Citas
              </Link>
              <Link
                to="/customers"
                className="hidden xl:flex items-center gap-2 px-5 py-3 text-teal-600 font-semibold border-2 border-teal-300 rounded-xl hover:bg-teal-50 transition-all"
              >
                <Users className="w-5 h-5" />
                Clientes
              </Link>
              <Link
                to="/services"
                className="hidden xl:flex items-center gap-2 px-5 py-3 text-purple-600 font-semibold border-2 border-purple-300 rounded-xl hover:bg-purple-50 transition-all"
              >
                <Briefcase className="w-5 h-5" />
                Servicios
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 text-red-600 font-semibold border-2 border-red-300 rounded-xl hover:bg-red-50 transition-all"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden xl:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-10 sm:py-14">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        {/* Próximas Citas Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Clock className="w-7 h-7 text-indigo-600" />
              Próximas Citas
            </h2>
            <Link
              to="/appointments"
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
            >
              Ver todas →
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 lg:p-16 text-center">
              <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No hay citas próximas</h3>
              <p className="text-lg text-gray-600 mb-8">Todas tus citas futuras aparecerán aquí</p>
              <Link
                to="/appointments"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Ir a Citas
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full">
              {upcomingAppointments.slice(0, 8).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

function AppointmentCard({ appointment, getStatusColor, getStatusLabel }: AppointmentCardProps) {
  const navigate = useNavigate();
  
  // Parsear fecha sin conversión de zona horaria de forma segura
  let date: Date;
  try {
    if (appointment.appointment_date && typeof appointment.appointment_date === 'string' && appointment.appointment_date.includes(' ')) {
      const [datePart, timePart] = appointment.appointment_date.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      date = new Date(year, month - 1, day, hours, minutes);
    } else {
      date = new Date();
    }
  } catch {
    date = new Date();
  }
  
  return (
    <div 
      onClick={() => navigate('/appointments')}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 overflow-hidden flex flex-col h-full cursor-pointer"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-5">
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
            {getStatusLabel(appointment.status)}
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-gray-700">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <User className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{appointment.customer.name}</p>
              <p className="text-sm text-gray-500">{appointment.customer.phone}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-gray-700">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{appointment.service.name}</p>
              <p className="text-sm text-gray-500">${appointment.service.price}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-gray-700">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{date.toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
              <p className="text-sm text-gray-500">
                {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
        
        {appointment.notes && (
          <div className="mt-5 pt-5 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{appointment.notes}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-center text-indigo-600 font-semibold">
          Click para ver detalles →
        </p>
      </div>
    </div>
  );
}
