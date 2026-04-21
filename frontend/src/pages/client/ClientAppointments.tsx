import { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Search, Calendar, User, Clock, Tag, Building2, AlertCircle, X, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';

const NAV_LINKS = [
  { to: '/client/dashboard',    label: 'Inicio',    Icon: Home,     activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/services',     label: 'Explorar',  Icon: Search,   activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/appointments', label: 'Mis Citas', Icon: Calendar, activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/profile',      label: 'Mi Perfil', Icon: User,     activeClass: 'bg-emerald-50 text-emerald-600' },
];

interface Appointment {
  id: number;
  appointment_date: string;
  status: string;
  notes?: string;
  customer: { name: string };
  service: { name: string; price: string; duration_minutes: number; user?: { name: string; business_name?: string } };
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada',
};
const FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

function parseDate(str: string): Date {
  try {
    const [d, t] = str.split(' ');
    const [y, mo, day] = d.split('-').map(Number);
    const [h, min] = t.split(':').map(Number);
    return new Date(y, mo - 1, day, h, min);
  } catch { return new Date(); }
}

export default function ClientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await axios.get('/api/client/appointments', { params });
      setAppointments(res.data.data);
    } catch { setError('Error al cargar tus citas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await axios.patch(`/api/client/appointments/${cancelTarget.id}/cancel`);
      setCancelTarget(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al cancelar');
      setCancelTarget(null);
    }
  };

  return (
    <PageLayout
      gradient="from-emerald-50 via-teal-50 to-cyan-50"
      title="Mis Citas"
      subtitle="Historial y próximas reservas"
      HeaderIcon={Calendar}
      iconBg="bg-emerald-100"
      iconColor="text-emerald-600"
      navLinks={NAV_LINKS}
    >
      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
          <button type="button" onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4 text-red-400" /></button>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-all ${
              filter === value
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20"><Calendar className="w-16 h-16 text-emerald-300 animate-pulse mx-auto" /></div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter ? 'Sin citas con este estado' : 'Aún no tienes citas'}
          </h3>
          <p className="text-gray-500 mb-6">¡Reserva tu primer servicio!</p>
          <Link to="/client/services" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg">
            <Search className="w-5 h-5" />Explorar servicios
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {appointments.map((appt) => {
            const date = parseDate(appt.appointment_date);
            const canCancel = ['pending', 'confirmed'].includes(appt.status);
            const business = appt.service.user?.business_name ?? appt.service.user?.name;
            return (
              <div key={appt.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-emerald-300 overflow-hidden flex flex-col">
                <div className="p-5 flex-grow space-y-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[appt.status]}`}>
                    {STATUS_LABELS[appt.status]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="font-bold text-gray-900 truncate">{appt.service.name}</p>
                  </div>
                  {business && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <p className="text-sm text-gray-600 truncate">{business}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500">{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  {appt.notes && <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 line-clamp-2">{appt.notes}</p>}
                </div>

                {canCancel && (
                  <div className="border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCancelTarget(appt)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-red-600 font-semibold hover:bg-red-50 transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />Cancelar cita
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal confirmar cancelación */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cancelar esta cita?</h3>
            <p className="text-gray-600 mb-1"><strong>{cancelTarget.service.name}</strong></p>
            <p className="text-sm text-gray-500 mb-6">
              {parseDate(cancelTarget.appointment_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCancelTarget(null)} className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
                Volver
              </button>
              <button type="button" onClick={handleCancel} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
