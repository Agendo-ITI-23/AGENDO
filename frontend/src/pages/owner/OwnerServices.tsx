import { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, Briefcase, Calendar, Users, Settings, Plus, Pencil, Trash2, Clock, DollarSign, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import ServiceForm from '../../components/ServiceForm';

const NAV_LINKS = [
  { to: '/owner/dashboard',    label: 'Mi Negocio', Icon: LayoutDashboard, activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/services',     label: 'Servicios',  Icon: Briefcase,       activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/appointments', label: 'Reservas',   Icon: Calendar,        activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/customers',    label: 'Clientes',   Icon: Users,           activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/profile',      label: 'Perfil',     Icon: Settings,        activeClass: 'bg-violet-50 text-violet-600' },
];

interface Service {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
}

export default function OwnerServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      const res = await axios.get('/api/owner/services');
      setServices(res.data.data);
    } catch { setError('Error al cargar los servicios'); }
    finally { setLoading(false); }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    loadServices();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/owner/services/${deleteTarget.id}`);
      setDeleteTarget(null);
      loadServices();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al eliminar el servicio');
      setDeleteTarget(null);
    }
  };

  return (
    <PageLayout
      gradient="from-violet-50 via-purple-50 to-fuchsia-50"
      title="Mis Servicios"
      subtitle="Gestiona los servicios que ofreces"
      HeaderIcon={Briefcase}
      iconBg="bg-violet-100"
      iconColor="text-violet-600"
      navLinks={NAV_LINKS}
    >
      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-600">{services.length} servicio{services.length !== 1 ? 's' : ''} publicado{services.length !== 1 ? 's' : ''}</p>
        <button
          type="button"
          onClick={() => { setEditingService(null); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nuevo servicio
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20"><Briefcase className="w-16 h-16 text-violet-300 animate-pulse mx-auto mb-4" /></div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin servicios publicados</h3>
          <p className="text-gray-500 mb-6">Crea tu primer servicio para que los clientes puedan reservar</p>
          <button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all shadow-lg">
            <Plus className="w-5 h-5" />Crear servicio
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((svc) => (
            <div key={svc.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-violet-300 overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{svc.name}</h3>
                  <span className={`ml-2 shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${svc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {svc.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {svc.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{svc.description}</p>}
                <div className="flex gap-4 text-sm text-gray-700">
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-violet-500" />${svc.price}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-purple-500" />{svc.duration_minutes} min</span>
                </div>
              </div>
              <div className="flex border-t border-gray-200">
                <button type="button" onClick={() => { setEditingService(svc); setShowForm(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-violet-600 font-semibold hover:bg-violet-50 transition-colors">
                  <Pencil className="w-4 h-4" />Editar
                </button>
                <div className="w-px bg-gray-200" />
                <button type="button" onClick={() => setDeleteTarget(svc)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-red-600 font-semibold hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ServiceForm */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editingService ? 'Editar servicio' : 'Nuevo servicio'}</h2>
              <button type="button" onClick={() => { setShowForm(false); setEditingService(null); }} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <div className="p-6">
              <ServiceForm
                service={editingService ?? undefined}
                onSuccess={handleFormSuccess}
                onCancel={() => { setShowForm(false); setEditingService(null); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar servicio?</h3>
            <p className="text-gray-600 mb-6">Se eliminará <strong>{deleteTarget.name}</strong>. Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="button" onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
