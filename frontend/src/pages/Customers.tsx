import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Plus, Mail, Phone, MapPin, LogOut, Home, Calendar, Tag, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomerForm from '../components/CustomerForm';
import MobileMenu from '../components/MobileMenu';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

type ModalType = 'none' | 'create' | 'edit' | 'delete';

export default function Customers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalType, setModalType] = useState<ModalType>('none');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data.data);
      setLoading(false);
    } catch {
      setError('Error al cargar los clientes');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setModalType('create');
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalType('edit');
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalType('delete');
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    
    try {
      await axios.delete(`/api/customers/${selectedCustomer.id}`);
      setModalType('none');
      setSelectedCustomer(null);
      loadCustomers();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Error al eliminar el cliente');
      setModalType('none');
      setSelectedCustomer(null);
    }
  };

  const handleFormSuccess = () => {
    setModalType('none');
    setSelectedCustomer(null);
    loadCustomers();
  };

  const closeModal = () => {
    setModalType('none');
    setSelectedCustomer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-xl">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Clientes</h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Gestiona tu base de clientes, <span className="font-semibold text-indigo-600">{user?.name}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto items-center">
              <MobileMenu />
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex-1 lg:flex-initial justify-center"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              <Link
                to="/appointments"
                className="hidden xl:flex items-center gap-2 px-5 py-3 text-indigo-600 font-semibold border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Citas
              </Link>
              <Link
                to="/services"
                className="hidden xl:flex items-center gap-2 px-5 py-3 text-purple-600 font-semibold border-2 border-purple-300 rounded-xl hover:bg-purple-50 transition-all"
              >
                <Tag className="w-5 h-5" />
                Servicios
              </Link>
              <button 
                onClick={handleNewCustomer}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex-1 lg:flex-initial justify-center"
              >
                <Plus className="w-5 h-5" />
                Nuevo Cliente
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 text-red-600 font-semibold border-2 border-red-300 rounded-xl hover:bg-red-50 transition-all"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden xl:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-10 sm:py-14">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        {customers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 lg:p-16 text-center max-w-3xl mx-auto mt-8">
            <Users className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">No hay clientes registrados</h3>
            <p className="text-lg text-gray-600 mb-8">Comienza agregando tu primer cliente</p>
            <button 
              onClick={handleNewCustomer}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Agregar primer cliente
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={() => handleEdit(customer)}
                onDelete={() => handleDelete(customer)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal crear/editar */}
      {(modalType === 'create' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalType === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <CustomerForm
                onSuccess={handleFormSuccess}
                onCancel={closeModal}
                customer={selectedCustomer || undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {modalType === 'delete' && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                ¿Eliminar cliente?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Esta acción no se puede deshacer. El cliente <span className="font-semibold">{selectedCustomer.name}</span> será eliminado permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CustomerCardProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-teal-300 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-900 flex-1">{customer.name}</h3>
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-teal-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
              <p className="text-sm text-gray-900 break-all">{customer.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Teléfono</p>
              <p className="text-sm text-gray-900">{customer.phone}</p>
            </div>
          </div>
          
          {customer.address && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Dirección</p>
                <p className="text-sm text-gray-900">{customer.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
        <button 
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border-2 border-indigo-200 hover:border-indigo-300"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button 
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all border-2 border-red-200 hover:border-red-300"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>
    </div>
  );
}
