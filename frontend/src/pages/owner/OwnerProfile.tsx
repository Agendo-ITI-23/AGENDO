import { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, Briefcase, Calendar, Users, Settings, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import { useAuth } from '../../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/owner/dashboard',    label: 'Mi Negocio', Icon: LayoutDashboard, activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/services',     label: 'Servicios',  Icon: Briefcase,       activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/appointments', label: 'Reservas',   Icon: Calendar,        activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/customers',    label: 'Clientes',   Icon: Users,           activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/profile',      label: 'Perfil',     Icon: Settings,        activeClass: 'bg-violet-50 text-violet-600' },
];

export default function OwnerProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', business_name: '', business_description: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get('/api/owner/profile')
      .then((res) => {
        const d = res.data.data;
        setFormData({ name: d.name ?? '', business_name: d.business_name ?? '', business_description: d.business_description ?? '' });
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
      await axios.patch('/api/owner/profile', formData);
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
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageLayout
      gradient="from-violet-50 via-purple-50 to-fuchsia-50"
      title="Perfil del Negocio"
      subtitle={user?.email}
      HeaderIcon={Settings}
      iconBg="bg-violet-100"
      iconColor="text-violet-600"
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
            <div className="w-20 h-20 rounded-2xl bg-violet-100 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-violet-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{formData.business_name || 'Mi Negocio'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del propietario</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Tu nombre completo"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del negocio</label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Ej: Salón de belleza Ana"
              />
              {errors.business_name && <p className="text-red-500 text-sm mt-1">{errors.business_name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción del negocio</label>
              <textarea
                value={formData.business_description}
                onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-violet-500 transition-colors resize-none"
                placeholder="Describe tu negocio y los servicios que ofreces..."
              />
              {errors.business_description && <p className="text-red-500 text-sm mt-1">{errors.business_description[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
