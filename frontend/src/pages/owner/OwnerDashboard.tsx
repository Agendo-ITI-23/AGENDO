import { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, Briefcase, Calendar, Users, Settings, Clock, Tag, User, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  customer: { name: string; phone: string };
  service: { name: string; price: string };
}

interface Stats {
  services: number;
  customers: number;
  upcoming: number;
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

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({ services: 0, customers: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/owner/appointments/upcoming'),
      axios.get('/api/owner/services'),
      axios.get('/api/owner/customers'),
    ]).then(([apptRes, svcRes, custRes]) => {
      const upcoming: Appointment[] = apptRes.data.data;
      setAppointments(upcoming);
      setStats({
        services: svcRes.data.data.length,
        customers: custRes.data.data.length,
        upcoming: upcoming.length,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="w-16 h-16 text-violet-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      gradient="from-violet-50 via-purple-50 to-fuchsia-50"
      title={user?.business_name ?? 'Mi Negocio'}
      subtitle={`Bienvenido, ${user?.name}`}
      HeaderIcon={LayoutDashboard}
      iconBg="bg-violet-100"
      iconColor="text-violet-600"
      navLinks={NAV_LINKS}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Servicios activos', value: stats.services, icon: Briefcase, color: 'violet', to: '/owner/services' },
          { label: 'Próximas reservas',  value: stats.upcoming,  icon: Calendar,  color: 'purple', to: '/owner/appointments' },
          { label: 'Clientes',           value: stats.customers, icon: Users,     color: 'fuchsia', to: '/owner/customers' },
        ].map(({ label, value, icon: Icon, color, to }) => (
          <Link key={to} to={to} className={`bg-white rounded-2xl shadow-md p-6 flex items-center gap-5 hover:shadow-lg transition-all border border-${color}-100 hover:border-${color}-300`}>
            <div className={`p-4 bg-${color}-50 rounded-xl`}>
              <Icon className={`w-8 h-8 text-${color}-600`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Próximas reservas */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Clock className="w-7 h-7 text-violet-600" />
          Próximas Reservas
        </h2>
        <Link to="/owner/appointments" className="text-violet-600 hover:text-violet-700 font-semibold text-sm">
          Ver todas →
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reservas próximas</h3>
          <p className="text-gray-500 mb-6">Las reservas de tus clientes aparecerán aquí</p>
          <Link to="/owner/services" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all shadow-lg">
            <Briefcase className="w-5 h-5" />
            Publicar servicios
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {appointments.slice(0, 8).map((appt) => {
            let date = new Date();
            try {
              const [d, t] = appt.appointment_date.split(' ');
              const [y, mo, day] = d.split('-').map(Number);
              const [h, min] = t.split(':').map(Number);
              date = new Date(y, mo - 1, day, h, min);
            } catch { /* ignore */ }
            return (
              <Link
                key={appt.id}
                to="/owner/appointments"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-violet-300 overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-grow space-y-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[appt.status]}`}>
                    {STATUS_LABELS[appt.status]}
                  </span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-violet-500 flex-shrink-0" />
                    <p className="font-semibold truncate">{appt.customer.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Tag className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <p className="truncate">{appt.service.name} — ${appt.service.price}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
                      <p className="text-xs text-gray-500">{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  {appt.notes && (
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500 line-clamp-2">{appt.notes}</p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                  <p className="text-xs text-center text-violet-600 font-semibold">Ver detalles →</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
