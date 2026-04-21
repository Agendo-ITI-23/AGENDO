import { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, Briefcase, Calendar, Users, Settings, Mail, Phone, UserCheck, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/PageLayout';

const NAV_LINKS = [
  { to: '/owner/dashboard',    label: 'Mi Negocio', Icon: LayoutDashboard, activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/services',     label: 'Servicios',  Icon: Briefcase,       activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/appointments', label: 'Reservas',   Icon: Calendar,        activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/customers',    label: 'Clientes',   Icon: Users,           activeClass: 'bg-violet-50 text-violet-600' },
  { to: '/owner/profile',      label: 'Perfil',     Icon: Settings,        activeClass: 'bg-violet-50 text-violet-600' },
];

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  linked_user_id?: number | null;
  linked_user?: { name: string; email: string } | null;
  appointments?: unknown[];
}

export default function OwnerCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/owner/customers')
      .then((res) => setCustomers(res.data.data))
      .catch(() => setError('Error al cargar los clientes'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  return (
    <PageLayout
      gradient="from-violet-50 via-purple-50 to-fuchsia-50"
      title="Mis Clientes"
      subtitle="Personas que han reservado contigo"
      HeaderIcon={Users}
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

      {/* Búsqueda */}
      <div className="mb-8">
        <input
          type="search"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      {loading ? (
        <div className="text-center py-20"><Users className="w-16 h-16 text-violet-300 animate-pulse mx-auto mb-4" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {search ? 'Sin resultados' : 'Sin clientes aún'}
          </h3>
          <p className="text-gray-500">
            {search ? 'Prueba con otro término de búsqueda' : 'Los clientes que reserven tus servicios aparecerán aquí'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-violet-300 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{customer.name}</p>
                    {customer.appointments && (
                      <p className="text-xs text-gray-500">{customer.appointments.length} cita{customer.appointments.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
                {customer.linked_user_id && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <UserCheck className="w-3 h-3" />Cuenta
                  </span>
                )}
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  <span>{customer.phone}</span>
                </div>
                {customer.address && (
                  <p className="text-xs text-gray-400 pl-6 truncate">{customer.address}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
