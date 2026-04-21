import { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Search, Calendar, User, Clock, Tag, Building2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/PageLayout';

const NAV_LINKS = [
  { to: '/client/dashboard',    label: 'Inicio',     Icon: Home,     activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/services',     label: 'Explorar',   Icon: Search,   activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/appointments', label: 'Mis Citas',  Icon: Calendar, activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/profile',      label: 'Mi Perfil',  Icon: User,     activeClass: 'bg-emerald-50 text-emerald-600' },
];

interface Appointment {
  id: number;
  appointment_date: string;
  status: string;
  notes?: string;
  customer: { name: string };
  service: { name: string; price: string; user?: { name: string; business_name?: string } };
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada',
};

function parseDate(str: string): Date {
  try {
    const [d, t] = str.split(' ');
    const [y, mo, day] = d.split('-').map(Number);
    const [h, min] = t.split(':').map(Number);
    return new Date(y, mo - 1, day, h, min);
  } catch { return new Date(); }
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/client/appointments/upcoming')
      .then((res) => setAppointments(res.data.data))
      .catch(() => setError('Error al cargar tus citas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      gradient="from-emerald-50 via-teal-50 to-cyan-50"
      title="Bienvenido"
      subtitle={`Hola, ${user?.name} 👋`}
      HeaderIcon={Home}
      iconBg="bg-emerald-100"
      iconColor="text-emerald-600"
      navLinks={NAV_LINKS}
    >
      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* CTA explorar servicios */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mb-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">¿Buscas un servicio?</h2>
          <p className="text-emerald-100">Explora todos los servicios disponibles y reserva cuando quieras</p>
        </div>
        <Link
          to="/client/services"
          className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg"
        >
          <Search className="w-5 h-5" />
          Explorar servicios
        </Link>
      </div>

      {/* Próximas citas */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Clock className="w-7 h-7 text-emerald-600" />
          Mis próximas citas
        </h2>
        <Link to="/client/appointments" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
          Ver todas →
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10"><Clock className="w-12 h-12 text-emerald-300 animate-pulse mx-auto" /></div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes citas próximas</h3>
          <p className="text-gray-500 mb-6">¡Reserva tu primer servicio!</p>
          <Link to="/client/services" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg">
            <Search className="w-5 h-5" />Explorar servicios
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {appointments.slice(0, 6).map((appt) => {
            const date = parseDate(appt.appointment_date);
            const businessName = appt.service.user?.business_name ?? appt.service.user?.name;
            return (
              <Link
                key={appt.id}
                to="/client/appointments"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-emerald-300 overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-grow space-y-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[appt.status]}`}>
                    {STATUS_LABELS[appt.status]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="font-semibold text-gray-900 truncate">{appt.service.name}</p>
                  </div>
                  {businessName && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <p className="text-sm text-gray-600 truncate">{businessName}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
                      <p className="text-xs text-gray-500">{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-200">
                  <p className="text-xs text-center text-emerald-600 font-semibold">Ver detalle →</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
