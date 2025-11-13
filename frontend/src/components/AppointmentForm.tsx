import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Tag, Clock, FileText } from 'lucide-react';

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
}

interface AppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  appointmentId?: number;
}

export default function AppointmentForm({ onSuccess, onCancel, appointmentId }: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    status: 'pending',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadServices();
    loadCustomers();
    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  const loadServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const loadAppointment = async () => {
    try {
      const response = await axios.get(`/api/appointments/${appointmentId}`);
      const appointment = response.data.data;
      const dateTime = new Date(appointment.appointment_date);
      setFormData({
        customer_id: appointment.customer_id.toString(),
        service_id: appointment.service_id.toString(),
        appointment_date: dateTime.toISOString().split('T')[0],
        appointment_time: dateTime.toTimeString().slice(0, 5),
        status: appointment.status,
        notes: appointment.notes || ''
      });
    } catch (error) {
      console.error('Error al cargar cita:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const appointmentDateTime = `${formData.appointment_date} ${formData.appointment_time}:00`;
      const payload = {
        customer_id: parseInt(formData.customer_id),
        service_id: parseInt(formData.service_id),
        appointment_date: appointmentDateTime,
        status: formData.status,
        notes: formData.notes
      };

      if (appointmentId) {
        await axios.put(`/api/appointments/${appointmentId}`, payload);
      } else {
        await axios.post('/api/appointments', payload);
      }
      
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Error al guardar la cita' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      {/* Cliente */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <User className="w-4 h-4 text-indigo-600" />
          Cliente
        </label>
        <select
          value={formData.customer_id}
          onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          required
        >
          <option value="">Seleccionar cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.phone}
            </option>
          ))}
        </select>
        {errors.customer_id && <p className="text-red-500 text-sm mt-1">{errors.customer_id}</p>}
      </div>

      {/* Servicio */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Tag className="w-4 h-4 text-purple-600" />
          Servicio
        </label>
        <select
          value={formData.service_id}
          onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          required
        >
          <option value="">Seleccionar servicio</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - ${service.price} ({service.duration_minutes} min)
            </option>
          ))}
        </select>
        {errors.service_id && <p className="text-red-500 text-sm mt-1">{errors.service_id}</p>}
      </div>

      {/* Fecha y Hora */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-green-600" />
            Fecha
          </label>
          <input
            type="date"
            value={formData.appointment_date}
            onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            required
          />
          {errors.appointment_date && <p className="text-red-500 text-sm mt-1">{errors.appointment_date}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            Hora
          </label>
          <input
            type="time"
            value={formData.appointment_time}
            onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Estado */}
      {appointmentId && (
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
            <option value="completed">Completada</option>
          </select>
        </div>
      )}

      {/* Notas */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FileText className="w-4 h-4 text-gray-600" />
          Notas (opcional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          placeholder="Información adicional sobre la cita..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Guardando...' : appointmentId ? 'Actualizar' : 'Crear Cita'}
        </button>
      </div>
    </form>
  );
}
