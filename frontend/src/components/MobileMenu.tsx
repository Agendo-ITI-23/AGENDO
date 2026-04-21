import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Users, Briefcase, Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavLinkConfig {
  to: string;
  label: string;
  Icon: LucideIcon;
  activeClass: string;
}

const DEFAULT_LINKS: NavLinkConfig[] = [
  { to: '/dashboard',    label: 'Dashboard', Icon: Home,      activeClass: 'bg-indigo-50 text-indigo-600' },
  { to: '/appointments', label: 'Citas',      Icon: Calendar,  activeClass: 'bg-indigo-50 text-indigo-600' },
  { to: '/customers',    label: 'Clientes',   Icon: Users,     activeClass: 'bg-teal-50 text-teal-600' },
  { to: '/services',     label: 'Servicios',  Icon: Briefcase, activeClass: 'bg-purple-50 text-purple-600' },
];

interface MobileMenuProps {
  links?: NavLinkConfig[];
}

export default function MobileMenu({ links = DEFAULT_LINKS }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xl:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Menú de navegación"
      >
        {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40 xl:hidden" />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out xl:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Menú</h2>
            <button type="button" aria-label="Cerrar menú" onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <nav className="space-y-2">
            {links.map(({ to, label, Icon, activeClass }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === to ? activeClass + ' font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
