import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getRoleDashboard } from '../contexts/AuthContext';
import { Mail, Lock, User, Phone, Briefcase, AlertCircle, Calendar, Building2 } from 'lucide-react';

type Role = 'business_owner' | 'customer';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState<Role>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    business_name: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const validateForm = () => {
    const errs: Record<string, string[]> = {};
    if (!formData.name.trim()) errs.name = ['El nombre es requerido'];
    else if (!/^[\p{L}\s]+$/u.test(formData.name)) errs.name = ['Solo letras y espacios'];

    if (!formData.email.trim()) errs.email = ['El email es requerido'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = ['Email inválido'];

    if (!formData.password) errs.password = ['La contraseña es requerida'];
    else if (formData.password.length < 8) errs.password = ['Mínimo 8 caracteres'];
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      errs.password = ['Debe contener mayúscula, minúscula y número'];

    if (formData.password !== formData.password_confirmation)
      errs.password_confirmation = ['Las contraseñas no coinciden'];

    if (role === 'business_owner' && !formData.business_name.trim())
      errs.business_name = ['El nombre del negocio es requerido'];

    if (role === 'customer' && !formData.phone.trim())
      errs.phone = ['El teléfono es requerido'];
    else if (role === 'customer' && formData.phone && !/^[0-9\s\-\+\(\)]+$/.test(formData.phone))
      errs.phone = ['Formato de teléfono inválido'];

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({});
    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) { setErrors(clientErrors); return; }
    setLoading(true);
    try {
      const userData = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role,
        business_name: role === 'business_owner' ? formData.business_name : undefined,
        phone: role === 'customer' ? formData.phone : undefined,
        address: formData.address || undefined,
      });
      navigate(getRoleDashboard(userData.role));
    } catch (err: any) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else setError(err.response?.data?.message ?? 'Error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, icon: React.ReactNode, inputProps: React.InputHTMLAttributes<HTMLInputElement>, errorKey: string) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        {icon}{label}
      </label>
      <input
        {...inputProps}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
      />
      {errors[errorKey] && <p className="text-red-500 text-sm mt-1">{errors[errorKey][0]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center mb-6 hover:opacity-80 transition-opacity">
            <Calendar className="w-12 h-12 text-indigo-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AGENDO
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear cuenta</h2>
          <p className="text-gray-600">¿Cómo quieres usar AGENDO?</p>
        </div>

        {/* Selector de rol */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              role === 'customer'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <User className="w-7 h-7" />
            <span className="font-semibold text-sm">Soy cliente</span>
            <span className="text-xs text-center opacity-70">Quiero reservar servicios</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('business_owner')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              role === 'business_owner'
                ? 'border-violet-500 bg-violet-50 text-violet-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <Building2 className="w-7 h-7" />
            <span className="font-semibold text-sm">Tengo un negocio</span>
            <span className="text-xs text-center opacity-70">Quiero ofrecer servicios</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('Nombre completo', <User className="w-4 h-4 text-gray-500" />,
              { type: 'text', value: formData.name, onChange: set('name'), placeholder: 'Tu nombre', required: true },
              'name'
            )}
            {field('Email', <Mail className="w-4 h-4 text-gray-500" />,
              { type: 'email', value: formData.email, onChange: set('email'), placeholder: 'tu@email.com', required: true },
              'email'
            )}

            {/* Campo condicional por rol */}
            {role === 'business_owner' && field(
              'Nombre del negocio', <Briefcase className="w-4 h-4 text-gray-500" />,
              { type: 'text', value: formData.business_name, onChange: set('business_name'), placeholder: 'Ej: Salón de belleza Ana', required: true },
              'business_name'
            )}
            {role === 'customer' && field(
              'Teléfono', <Phone className="w-4 h-4 text-gray-500" />,
              { type: 'tel', value: formData.phone, onChange: set('phone'), placeholder: '+52 55 1234 5678', required: true },
              'phone'
            )}

            {field('Contraseña', <Lock className="w-4 h-4 text-gray-500" />,
              { type: 'password', value: formData.password, onChange: set('password'), placeholder: 'Mínimo 8 caracteres', required: true, minLength: 8 },
              'password'
            )}
            <p className="text-xs text-gray-500 -mt-2">Debe contener mayúscula, minúscula y número</p>

            {field('Confirmar contraseña', <Lock className="w-4 h-4 text-gray-500" />,
              { type: 'password', value: formData.password_confirmation, onChange: set('password_confirmation'), placeholder: 'Confirma tu contraseña', required: true },
              'password_confirmation'
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                role === 'business_owner'
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
