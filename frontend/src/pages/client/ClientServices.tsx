import { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Search, Calendar, User, Clock, DollarSign, Building2, AlertCircle, X } from 'lucide-react';
import PageLayout from '../../components/PageLayout';

const NAV_LINKS = [
  { to: '/client/dashboard',    label: 'Inicio',    Icon: Home,     activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/services',     label: 'Explorar',  Icon: Search,   activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/appointments', label: 'Mis Citas', Icon: Calendar, activeClass: 'bg-emerald-50 text-emerald-600' },
  { to: '/client/profile',      label: 'Mi Perfil', Icon: User,     activeClass: 'bg-emerald-50 text-emerald-600' },
];

interface Service {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
  user?: { id: number; name: string; business_name?: string; business_description?: string };
}

export default function ClientServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [booking, setBooking] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/client/services')
      .then((res) => setServices(res.data.data))
      .catch(() => setError('Error al cargar los servicios'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (s.user?.business_name ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setBookingError('');
    setBookingLoading(true);
    try {
      await axios.post('/api/client/appointments', {
        service_id: booking.id,
        appointment_date: bookingDate,
        notes: bookingNotes || undefined,
      });
      setBookingSuccess(`¡Reserva creada! Tu cita para "${booking.name}" está pendiente de confirmación.`);
      setBooking(null);
      setBookingDate('');
      setBookingNotes('');
    } catch (err: any) {
      const msgs = err.response?.data?.errors;
      setBookingError(
        msgs ? Object.values(msgs).flat().join(' ') : (err.response?.data?.message ?? 'Error al crear la reserva'),
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Mínimo: ahora + 1 hora
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <PageLayout
      gradient="from-emerald-50 via-teal-50 to-cyan-50"
      title="Explorar Servicios"
      subtitle="Reserva cuando quieras, donde quieras"
      HeaderIcon={Search}
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

      {bookingSuccess && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 font-semibold">{bookingSuccess}</p>
          <button type="button" onClick={() => setBookingSuccess('')} className="ml-auto text-green-400 hover:text-green-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Búsqueda */}
      <div className="mb-8">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar servicio o negocio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><Search className="w-16 h-16 text-emerald-300 animate-pulse mx-auto mb-4" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {search ? 'Sin resultados' : 'Sin servicios disponibles'}
          </h3>
          <p className="text-gray-500">{search ? 'Prueba con otros términos' : 'Pronto habrá servicios disponibles'}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((svc) => {
            const business = svc.user?.business_name ?? svc.user?.name;
            return (
              <div key={svc.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-emerald-300 overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  {business && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Building2 className="w-3.5 h-3.5 text-teal-500" />
                      <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide">{business}</p>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{svc.name}</h3>
                  {svc.description && <p className="text-sm text-gray-600 line-clamp-2 mb-4">{svc.description}</p>}
                  <div className="flex gap-4 text-sm font-semibold text-gray-700">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <DollarSign className="w-4 h-4" />${svc.price}
                    </span>
                    <span className="flex items-center gap-1 text-teal-600">
                      <Clock className="w-4 h-4" />{svc.duration_minutes} min
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => { setBooking(svc); setBookingError(''); setBookingDate(''); setBookingNotes(''); }}
                    className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de reserva */}
      {booking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reservar servicio</h2>
                <p className="text-sm text-emerald-600 font-semibold">{booking.name}</p>
              </div>
              <button type="button" onClick={() => setBooking(null)} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Cerrar">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleBook} className="p-6 space-y-5">
              {bookingError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{bookingError}</p>
                </div>
              )}

              {/* Info del servicio */}
              <div className="bg-emerald-50 rounded-xl p-4 flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <DollarSign className="w-4 h-4" />${booking.price}
                </span>
                <span className="flex items-center gap-1 text-teal-700 font-semibold">
                  <Clock className="w-4 h-4" />{booking.duration_minutes} min
                </span>
                {booking.user?.business_name && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <Building2 className="w-4 h-4" />{booking.user.business_name}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha y hora *</label>
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={minDateTime}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notas (opcional)</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  rows={3}
                  placeholder="Indica cualquier detalle adicional..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setBooking(null)} className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={bookingLoading} className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {bookingLoading ? 'Reservando...' : 'Confirmar reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
