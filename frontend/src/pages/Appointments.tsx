import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Plus, Clock, User, Tag, LogOut, Home, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentDetails from '../components/AppointmentDetails';
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

type ModalType = 'none' | 'create' | 'edit' | 'details' | 'delete';

export default function Appointments() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalType, setModalType] = useState<ModalType>('none');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const loadAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data.data);
      setLoading(false);
    } catch {
      setError('Error al cargar las citas');
      setLoading(false);
    }
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setModalType('create');
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalType('details');
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalType('edit');
  };

  const confirmDelete = async () => {
    if (!selectedAppointment) return;
    
    try {
      await axios.delete(`/api/appointments/${selectedAppointment.id}`);
      setModalType('none');
      setSelectedAppointment(null);
      loadAppointments();
    } catch {
      setError('Error al eliminar la cita');
    }
  };

  const handleFormSuccess = () => {
    setModalType('none');
    setSelectedAppointment(null);
    loadAppointments();
  };

  const closeModal = () => {
    setModalType('none');
    setSelectedAppointment(null);
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
          <p className="text-lg text-gray-600">Cargando citas...</p>
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mis Citas</h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Bienvenido, <span className="font-semibold text-indigo-600">{user?.name}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto items-center">
              <MobileMenu />
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex-1 lg:flex-initial justify-center"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              <Link
                to="/services"
                className="hidden xl:flex items-center gap-2 px-5 py-3 text-purple-600 font-semibold border-2 border-purple-300 rounded-xl hover:bg-purple-50 transition-all"
              >
                <Tag className="w-5 h-5" />
                Servicios
              </Link>
              <Link
                to="/customers"
                className="hidden xl:flex items-center gap-2 px-5 py-3 text-teal-600 font-semibold border-2 border-teal-300 rounded-xl hover:bg-teal-50 transition-all"
              >
                <Users className="w-5 h-5" />
                Clientes
              </Link>
              <button 
                onClick={handleNewAppointment}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex-1 lg:flex-initial justify-center"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nueva Cita</span>
                <span className="sm:hidden">Nueva</span>
              </button>
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

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 lg:p-16 text-center max-w-3xl mx-auto mt-8">
            <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">No hay citas programadas</h3>
            <p className="text-lg text-gray-600 mb-8">Comienza creando tu primera cita</p>
            <button 
              onClick={handleNewAppointment}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Crear primera cita
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full">
            {appointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                getStatusColor={getStatusColor} 
                getStatusLabel={getStatusLabel}
                onViewDetails={() => handleViewDetails(appointment)}
                onEdit={() => handleEdit(appointment)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal para crear/editar cita */}
      {(modalType === 'create' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalType === 'create' ? 'Nueva Cita' : 'Editar Cita'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <AppointmentForm
                onSuccess={handleFormSuccess}
                onCancel={closeModal}
                appointmentId={selectedAppointment?.id}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {modalType === 'details' && selectedAppointment && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <AppointmentDetails
                appointment={selectedAppointment}
                onClose={closeModal}
                onEdit={() => {
                  setModalType('edit');
                }}
                onDelete={() => {
                  setModalType('delete');
                }}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {modalType === 'delete' && selectedAppointment && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                ¿Eliminar cita?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Esta acción no se puede deshacer. La cita con {selectedAppointment.customer.name} será eliminada permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  onViewDetails: () => void;
  onEdit: () => void;
}

function AppointmentCard({ appointment, getStatusColor, getStatusLabel, onViewDetails, onEdit }: AppointmentCardProps) {
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 overflow-hidden flex flex-col h-full">
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
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{appointment.notes}</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
        <button 
          onClick={onViewDetails}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border-2 border-indigo-200 hover:border-indigo-300"
        >
          Ver detalles
        </button>
        <button 
          onClick={onEdit}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all border-2 border-gray-200 hover:border-gray-300"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
