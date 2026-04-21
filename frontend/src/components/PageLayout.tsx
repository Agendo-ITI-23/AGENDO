import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MobileMenu, { type NavLinkConfig } from './MobileMenu';

interface PageLayoutProps {
  gradient: string;
  title: string;
  subtitle?: string;
  HeaderIcon: LucideIcon;
  iconBg: string;
  iconColor: string;
  navLinks: NavLinkConfig[];
  children: ReactNode;
}

export default function PageLayout({
  gradient,
  title,
  subtitle,
  HeaderIcon,
  iconBg,
  iconColor,
  navLinks,
  children,
}: PageLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const activeLinkFor = (to: string) => {
    const link = navLinks.find((l) => l.to === to);
    return link?.activeClass ?? '';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient}`}>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${iconBg} rounded-xl`}>
                <HeaderIcon className={`w-8 h-8 ${iconColor}`} />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle ?? `Hola, ${user?.name}`}</p>}
              </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto items-center">
              <MobileMenu links={navLinks} />
              {navLinks.map(({ to, label, Icon }) => {
                const isActive = location.pathname === to;
                const active = activeLinkFor(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`hidden xl:flex items-center gap-2 px-5 py-3 font-semibold border-2 rounded-xl transition-all ${
                      isActive
                        ? `${active} border-current`
                        : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 text-red-600 font-semibold border-2 border-red-300 rounded-xl hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden xl:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-10 sm:py-14">
        {children}
      </main>
    </div>
  );
}
