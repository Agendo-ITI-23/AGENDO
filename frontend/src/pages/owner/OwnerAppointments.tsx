import { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, Briefcase, Calendar, Users, Settings, User, Tag, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import PageLayout from '../../components/PageLayout';

const NAV_LINKS = [
  { to: '/owner/dashboard',    label: 'Mi Negocio', Icon: LayoutDashboard, activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/services',     label: 'Servicios',  Icon: Briefcase,       activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/appointments', label: 'Reservas',   Icon: Calendar,        activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/customers',    label: 'Clientes',   Icon: Users,           activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/profile',      label: 'Perfil',     Icon: Settings,        activeClass: 'bg-violet-50 text-violet-600' },
];

interface Appointment {
  id: number;
  appointment_date: string;
  status: string;
  notes?: string;
  customer: { id: number; name: string; phone: string; email: string };
  service: { id: number; name: string; price: string; duration_minutes: number };
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

function parseDate(dateStr: string): Date {
  try {
    const [d, t] = dateStr.split(' ');
    const [y, mo, day] = d.split('-').map(Number);
    const [h, min] = t.split(':').map(Number);
    return new Date(y, mo - 1, day, h, min);
  } catch { return new Date(); }
}

export default function OwnerAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await axios.get('/api/owner/appointments', { params });
      setAppointments(res.data.data);
    } catch { setError('Error al cargar las reservas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAppointments(); }, [filter]);

  const quickActions = (appt: Appointment) => {
    const actions = [];
    if (appt.status === 'pending')
      actions.push({ label: 'Confirmar', status: 'confirmed', Icon: CheckCircle, color: 'text-green-600 hover:bg-green-50 border-green-300' });
    if (['pending', 'confirmed'].includes(appt.status))
      actions.push({ label: 'Completar', status: 'completed', Icon: CheckCircle, color: 'text-blue-600 hover:bg-blue-50 border-blue-300' });
    if (['pending', 'confirmed'].includes(appt.status))
      actions.push({ label: 'Cancelar', status: 'cancelled', Icon: XCircle, color: 'text-red-600 hover:bg-red-50 border-red-300' });
    return actions;
  };

  return (
    <PageLayout
      gradient="from-violet-50 via-purple-50 to-fuchsia-50"
      title="Reservas"
      subtitle="Gestiona las citas de tu negocio"
      HeaderIcon={Calendar}
      iconBg="bg-violet-100"
      iconColor="text-violet-600"
      navLinks={NAV_LINKS}
    >
      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
          <button type="button" onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
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
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-violet-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20"><Calendar className="w-16 h-16 text-violet-300 animate-pulse mx-auto mb-4" /></div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reservas</h3>
          <p className="text-gray-500">Cuando los clientes reserven tus servicios aparecerán aquí</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {appointments.map((appt) => {
            const date = parseDate(appt.appointment_date);
            return (
              <div key={appt.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-violet-300 overflow-hidden flex flex-col">
                <div className="p-5 flex-grow space-y-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[appt.status]}`}>
                    {STATUS_LABELS[appt.status]}
                  </span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{appt.customer.name}</p>
                      <p className="text-xs text-gray-500">{appt.customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <p className="text-gray-700">{appt.service.name} — <span className="font-semibold">${appt.service.price}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })}
                      </p>
                      <p className="text-xs text-gray-500">{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  {appt.notes && <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 line-clamp-2">{appt.notes}</p>}
                </div>

                {/* Quick actions */}
                {quickActions(appt).length > 0 && (
                  <div className="border-t border-gray-200 flex divide-x divide-gray-200">
                    {quickActions(appt).map(({ label, status, Icon, color }) => (
                      <button
                        key={status}
                        type="button"
                        onClick={async () => {
                          try {
                            await axios.patch(`/api/owner/appointments/${appt.id}/status`, { status });
                            loadAppointments();
                          } catch { setError('Error al actualizar'); }
                        }}
                        className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-semibold border-0 transition-colors ${color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />{label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
