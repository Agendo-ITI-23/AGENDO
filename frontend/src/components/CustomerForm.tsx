import { useState } from 'react';
import { User, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface CustomerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  customer?: Customer;
}

export default function CustomerForm({ onSuccess, onCancel, customer }: CustomerFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || ''
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};
    
    // Validar nombre: solo letras y espacios
    if (!formData.name.trim()) {
      newErrors.name = ['El nombre es requerido'];
    } else if (!/^[\p{L}\s]+$/u.test(formData.name)) {
      newErrors.name = ['El nombre solo debe contener letras y espacios'];
    } else if (formData.name.length > 255) {
      newErrors.name = ['El nombre no debe exceder 255 caracteres'];
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = ['El email es requerido'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ['El formato del email no es válido'];
    } else if (formData.email.length > 255) {
      newErrors.email = ['El email no debe exceder 255 caracteres'];
    }
    
    // Validar teléfono: números, espacios, guiones, paréntesis y +
    if (!formData.phone.trim()) {
      newErrors.phone = ['El teléfono es requerido'];
    } else if (!/^[0-9\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = ['El teléfono solo debe contener números, espacios, guiones, paréntesis y +'];
    } else if (formData.phone.replace(/[\s\-+()]/g, '').length < 10) {
      newErrors.phone = ['El teléfono debe tener al menos 10 dígitos'];
    } else if (formData.phone.length > 20) {
      newErrors.phone = ['El teléfono no debe exceder 20 caracteres'];
    }
    
    // Validar dirección (opcional)
    if (formData.address && formData.address.length > 500) {
      newErrors.address = ['La dirección no debe exceder 500 caracteres'];
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

      if (customer?.id) {
        await axios.put(`/api/customers/${customer.id}`, formData);
      } else {
        await axios.post('/api/customers', formData);
      }
      
      onSuccess();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      if (axiosError.response?.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else {
        setError(axiosError.response?.data?.message || 'Error al guardar el cliente');
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
          <User className="w-4 h-4 text-indigo-600" />
          Nombre completo
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="Nombre del cliente"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Mail className="w-4 h-4 text-blue-600" />
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="correo@ejemplo.com"
          required
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
      </div>

      {/* Teléfono */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Phone className="w-4 h-4 text-green-600" />
          Teléfono
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="+52 123 456 7890"
          required
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
      </div>

      {/* Dirección */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <MapPin className="w-4 h-4 text-red-600" />
          Dirección (opcional)
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          placeholder="Dirección del cliente"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
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
          {loading ? 'Guardando...' : customer ? 'Actualizar' : 'Crear Cliente'}
        </button>
      </div>
    </form>
  );
}
