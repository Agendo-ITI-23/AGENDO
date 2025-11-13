import { useState } from 'react';
import { Tag, DollarSign, Clock, FileText, AlertCircle } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
}

interface ServiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  service?: Service;
}

export default function ServiceForm({ onSuccess, onCancel, service }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || '',
    duration_minutes: service?.duration_minutes?.toString() || '',
    is_active: service?.is_active ?? true
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};
    
    // Validar nombre: letras, números y espacios
    if (!formData.name.trim()) {
      newErrors.name = ['El nombre es requerido'];
    } else if (!/^[\p{L}\s\d]+$/u.test(formData.name)) {
      newErrors.name = ['El nombre solo debe contener letras, números y espacios'];
    } else if (formData.name.length > 255) {
      newErrors.name = ['El nombre no debe exceder 255 caracteres'];
    }
    
    // Validar descripción (opcional)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = ['La descripción no debe exceder 1000 caracteres'];
    }
    
    // Validar precio
    if (!formData.price) {
      newErrors.price = ['El precio es requerido'];
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = ['El precio debe ser un número positivo'];
      } else if (price > 999999.99) {
        newErrors.price = ['El precio no debe exceder 999,999.99'];
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) {
        newErrors.price = ['El precio debe tener máximo 2 decimales'];
      }
    }
    
    // Validar duración
    if (!formData.duration_minutes) {
      newErrors.duration_minutes = ['La duración es requerida'];
    } else {
      const duration = parseInt(formData.duration_minutes);
      if (isNaN(duration) || duration < 1) {
        newErrors.duration_minutes = ['La duración debe ser al menos 1 minuto'];
      } else if (duration > 1440) {
        newErrors.duration_minutes = ['La duración no debe exceder 1440 minutos (24 horas)'];
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setError('');

    // Validación del lado del cliente
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const { default: axios } = await import('axios');
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes)
      };

      if (service?.id) {
        await axios.put(`/api/services/${service.id}`, payload);
      } else {
        await axios.post('/api/services', payload);
      }
      
      onSuccess();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      if (axiosError.response?.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else {
        setError(axiosError.response?.data?.message || 'Error al guardar el servicio');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Tag className="w-4 h-4 text-purple-600" />
          Nombre del servicio
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="Ej: Corte de cabello"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FileText className="w-4 h-4 text-gray-600" />
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          placeholder="Describe el servicio..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
      </div>

      {/* Precio y Duración */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="0.00"
            required
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Duración (minutos)
          </label>
          <input
            type="number"
            min="1"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="30"
            required
          />
          {errors.duration_minutes && <p className="text-red-500 text-sm mt-1">{errors.duration_minutes[0]}</p>}
        </div>
      </div>

      {/* Estado */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
          Servicio activo (disponible para reservas)
        </label>
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
          {loading ? 'Guardando...' : service ? 'Actualizar' : 'Crear Servicio'}
        </button>
      </div>
    </form>
  );
}
