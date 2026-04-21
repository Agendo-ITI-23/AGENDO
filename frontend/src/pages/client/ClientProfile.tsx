import { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Search, Calendar, User, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import { useAuth } from '../../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/client/dashboard',    label: 'Inicio',    Icon: Home,     activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/services',     label: 'Explorar',  Icon: Search,   activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/appointments', label: 'Mis Citas', Icon: Calendar, activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/profile',      label: 'Mi Perfil', Icon: User,     activeClass: 'bg-emerald-50 text-emerald-600' },
];

export default function ClientProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get('/api/client/profile')
      .then((res) => {
        const d = res.data.data;
        setFormData({ name: d.name ?? '', phone: d.phone ?? '', address: d.address ?? '' });
      })
      .catch(() => setError('Error al cargar el perfil'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setSuccess(false);
    setSaving(true);
    try {
      await axios.patch('/api/client/profile', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else setError(err.response?.data?.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageLayout
      gradient="from-emerald-50 via-teal-50 to-cyan-50"
      title="Mi Perfil"
      subtitle={user?.email}
      HeaderIcon={User}
      iconBg="bg-emerald-100"
      iconColor="text-emerald-600"
      navLinks={NAV_LINKS}
    >
      <div className="max-w-xl">
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 font-semibold">Perfil actualizado correctamente</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-3xl">
              {(formData.name || user?.name || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{formData.name || user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 text-gray-500" />Nombre completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Tu nombre"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 text-gray-500" />Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="+52 55 1234 5678"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />Dirección (opcional)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Tu dirección"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
