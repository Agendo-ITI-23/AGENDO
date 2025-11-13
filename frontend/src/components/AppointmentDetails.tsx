import { Calendar, Clock, User, Tag, Phone, Mail, FileText, MapPin } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
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

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export default function AppointmentDetails({ 
  appointment, 
  onClose, 
  onEdit, 
  onDelete,
  getStatusColor,
  getStatusLabel 
}: AppointmentDetailsProps) {
  const date = new Date(appointment.appointment_date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Detalles de la Cita</h3>
          <p className="text-sm text-gray-500 mt-1">ID: #{appointment.id}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      {/* Información del Cliente */}
      <div className="bg-indigo-50 rounded-xl p-6">
        <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          Información del Cliente
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="font-semibold text-gray-900">{appointment.customer.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="font-semibold text-gray-900">{appointment.customer.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{appointment.customer.email}</p>
            </div>
          </div>
          {appointment.customer.address && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-semibold text-gray-900">{appointment.customer.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información del Servicio */}
      <div className="bg-purple-50 rounded-xl p-6">
        <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Tag className="w-5 h-5 text-purple-600" />
          </div>
          Servicio
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Nombre del Servicio</p>
            <p className="font-semibold text-gray-900 text-lg">{appointment.service.name}</p>
          </div>
          {appointment.service.description && (
            <div>
              <p className="text-sm text-gray-600">Descripción</p>
              <p className="text-gray-700">{appointment.service.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-gray-600">Precio</p>
              <p className="font-semibold text-gray-900 text-xl">${appointment.service.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duración</p>
              <p className="font-semibold text-gray-900 text-xl">{appointment.service.duration_minutes} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fecha y Hora */}
      <div className="bg-green-50 rounded-xl p-6">
        <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          Fecha y Hora
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="font-semibold text-gray-900 text-lg">
                {date.toLocaleDateString('es-ES', { 
                  weekday: 'long',
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Hora</p>
              <p className="font-semibold text-gray-900 text-lg">
                {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      {appointment.notes && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
            <FileText className="w-5 h-5 text-gray-600" />
            Notas
          </h4>
          <p className="text-gray-700 leading-relaxed">{appointment.notes}</p>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cerrar
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
