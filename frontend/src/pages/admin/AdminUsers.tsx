import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Users, Briefcase, Shield, User, Mail, AlertCircle, Pencil, Trash2, X, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MobileMenu from '../../components/MobileMenu';

const NAV_LINKS = [
  { to: '/dashboard',    label: 'Dashboard',  Icon: Calendar, activeClass: 'bg-indigo-50 text-indigo-600' },
  { to: '/appointments', label: 'Citas',       Icon: Calendar, activeClass: 'bg-indigo-50 text-indigo-600' },
  { to: '/customers',    label: 'Clientes',    Icon: Users,    activeClass: 'bg-teal-50 text-teal-600' },
  { to: '/services',     label: 'Servicios',   Icon: Briefcase,activeClass: 'bg-purple-50 text-purple-600' },
  { to: '/admin/users',  label: 'Usuarios',    Icon: Shield,   activeClass: 'bg-indigo-50 text-indigo-600' },
];

const ROLE_LABELS: Record<string, string> = { admin: 'Admin', business_owner: 'Negocio', customer: 'Cliente' };
const ROLE_COLORS: Record<string, string> = {
  admin:          'bg-red-100 text-red-700',
  business_owner: 'bg-violet-100 text-violet-700',
  customer:       'bg-emerald-100 text-emerald-700',
};

interface AppUser {
  id: number;
  name: string;
  email: string;
  role: string;
  business_name?: string;
  phone?: string;
  created_at: string;
}

export default function AdminUsers() {
  const { user: me, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState<AppUser | null>(null);
  const [newRole, setNewRole] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data.data);
    } catch { setError('Error al cargar los usuarios'); }
    finally { setLoading(false); }
  };

  const handleUpdateRole = async () => {
    if (!editTarget || !newRole) return;
    setSaving(true);
    try {
      await axios.patch(`/api/admin/users/${editTarget.id}`, { role: newRole });
      setEditTarget(null);
      setSuccess('Rol actualizado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al actualizar');
      setEditTarget(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/admin/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al eliminar');
      setDeleteTarget(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.business_name ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl"><Shield className="w-8 h-8 text-indigo-600" /></div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <p className="text-sm text-gray-600 mt-1">{users.length} usuarios registrados</p>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto items-center">
              <MobileMenu links={NAV_LINKS} />
              {NAV_LINKS.map(({ to, label, Icon }) => (
                <Link key={to} to={to} className="hidden xl:flex items-center gap-2 px-5 py-3 text-indigo-600 font-semibold border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 transition-all">
                  <Icon className="w-5 h-5" />{label}
                </Link>
              ))}
              <button type="button" onClick={async () => { await logout(); navigate('/'); }}
                className="flex items-center gap-2 px-5 py-3 text-red-600 font-semibold border-2 border-red-300 rounded-xl hover:bg-red-50 transition-all">
                <X className="w-5 h-5" /><span className="hidden xl:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-10">
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button type="button" onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4 text-red-400" /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 font-semibold">{success}</p>
          </div>
        )}

        {/* Búsqueda */}
        <div className="mb-8">
          <input
            type="search"
            placeholder="Buscar por nombre, email o negocio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {loading ? (
          <div className="text-center py-20"><Users className="w-16 h-16 text-indigo-300 animate-pulse mx-auto" /></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Usuario', 'Email', 'Rol', 'Registrado', 'Acciones'].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            {u.business_name && <p className="text-xs text-gray-500">{u.business_name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />{u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(u.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setEditTarget(u); setNewRole(u.role); }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Cambiar rol"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {u.id !== me?.id && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(u)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Sin usuarios que coincidan</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal cambiar rol */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Cambiar rol</h3>
            <p className="text-gray-600 text-sm mb-5">{editTarget.name} — {editTarget.email}</p>
            <div className="space-y-2 mb-6">
              {['admin', 'business_owner', 'customer'].map((role) => (
                <label key={role} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${newRole === role ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="role" value={role} checked={newRole === role} onChange={() => setNewRole(role)} className="accent-indigo-600" />
                  <span className="font-semibold text-gray-800">{ROLE_LABELS[role]}</span>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[role]}`}>{ROLE_LABELS[role]}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditTarget(null)} className="flex-1 py-2.5 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="button" onClick={handleUpdateRole} disabled={saving} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar usuario?</h3>
            <p className="text-gray-600 mb-1"><strong>{deleteTarget.name}</strong></p>
            <p className="text-sm text-gray-500 mb-6">{deleteTarget.email}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="button" onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
