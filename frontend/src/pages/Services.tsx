import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag, Briefcase, Plus, DollarSign, Clock, LogOut, Home, Edit, Trash2, CheckCircle, XCircle, Calendar, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ServiceForm from '../components/ServiceForm';
import MobileMenu from '../components/MobileMenu';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
  is_active: boolean;
}

type ModalType = 'none' | 'create' | 'edit' | 'delete';

export default function Services() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalType, setModalType] = useState<ModalType>('none');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data.data);
      setLoading(false);
    } catch {
      setError('Error al cargar los servicios');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNewService = () => {
    setSelectedService(null);
    setModalType('create');
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setModalType('edit');
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setModalType('delete');
  };

  const confirmDelete = async () => {
    if (!selectedService) return;
    
    try {
      await axios.delete(`/api/services/${selectedService.id}`);
      setModalType('none');
      setSelectedService(null);
      loadServices();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Error al eliminar el servicio');
      setModalType('none');
      setSelectedService(null);
    }
  };

  const handleFormSuccess = () => {
    setModalType('none');
    setSelectedService(null);
    loadServices();
  };

  const closeModal = () => {
    setModalType('none');
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Tag className="w-16 h-16 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Tag className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Servicios</h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Gestiona tu catálogo de servicios, <span className="font-semibold text-indigo-600">{user?.name}</span>
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
                to="/customers"
                className="hidden xl:flex items-center gap-2 px-5 py-3 text-teal-600 font-semibold border-2 border-teal-300 rounded-xl hover:bg-teal-50 transition-all"
              >
                <Users className="w-5 h-5" />
                Clientes
              </Link>
              <button 
                onClick={handleNewService}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex-1 lg:flex-initial justify-center"
              >
                <Plus className="w-5 h-5" />
                Nuevo Servicio
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

        {services.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 lg:p-16 text-center max-w-3xl mx-auto mt-8">
            <Tag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">No hay servicios registrados</h3>
            <p className="text-lg text-gray-600 mb-8">Comienza creando tu primer servicio</p>
            <button 
              onClick={handleNewService}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Crear primer servicio
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => handleEdit(service)}
                onDelete={() => handleDelete(service)}
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
                  {modalType === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'}
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
              <ServiceForm
                onSuccess={handleFormSuccess}
                onCancel={closeModal}
                service={selectedService || undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {modalType === 'delete' && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                ¿Eliminar servicio?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Esta acción no se puede deshacer. El servicio <span className="font-semibold">{selectedService.name}</span> será eliminado permanentemente.
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

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}

function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-900 flex-1">{service.name}</h3>
          {service.is_active ? (
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" aria-label="Activo" />
          ) : (
            <XCircle className="w-6 h-6 text-gray-400 flex-shrink-0" aria-label="Inactivo" />
          )}
        </div>
        
        {service.description && (
          <p className="text-gray-600 mb-5 leading-relaxed line-clamp-3">{service.description}</p>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Precio</p>
              <p className="text-2xl font-bold text-gray-900">${service.price}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Duración</p>
              <p className="text-lg font-semibold text-gray-900">{service.duration_minutes} min</p>
            </div>
          </div>
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
