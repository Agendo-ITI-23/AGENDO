import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Plus, Clock, User, Tag } from 'lucide-react';

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
}

interface Appointment {
  id: number;
  appointment_date: string;
  status: string;
  notes: string;
  customer: Customer;
  service: Service;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

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
    setShowModal(true);
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mis Citas</h1>
                <p className="text-sm lg:text-base text-gray-600">Gestiona tu agenda</p>
              </div>
            </div>
            <button 
              onClick={handleNewAppointment}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Nueva Cita
            </button>
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
              <AppointmentCard key={appointment.id} appointment={appointment} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
            ))}
          </div>
        )}
      </main>

      {/* Modal para nueva cita */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Nueva Cita</h2>
                <button 
                  onClick={() => setShowModal(false)}
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
              <p className="text-gray-600 mb-4">
                Formulario de creación de citas - Próximamente
              </p>
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-500">Esta funcionalidad estará disponible pronto</p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
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
}

function AppointmentCard({ appointment, getStatusColor, getStatusLabel }: AppointmentCardProps) {
  const date = new Date(appointment.appointment_date);
  
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
        <button className="flex-1 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border-2 border-indigo-200 hover:border-indigo-300">
          Ver detalles
        </button>
        <button className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all border-2 border-gray-200 hover:border-gray-300">
          Editar
        </button>
      </div>
    </div>
  );
}
