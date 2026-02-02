'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, LayoutDashboard, CalendarDays, Settings, Clock, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/bookings', icon: CalendarDays, label: 'Réservations' },
  { href: '/admin/services', icon: Settings, label: 'Services' },
  { href: '/admin/availability', icon: Clock, label: 'Disponibilités' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, admin, logout, checkAuth, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (!isLoading && !isAuthenticated && pathname !== '/admin/login') router.push('/admin/login'); }, [isAuthenticated, isLoading, router, pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (isLoading || !isAuthenticated) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn('fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
            <Link href="/admin" className="flex items-center gap-2"><div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-blue-500 flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div><span className="text-lg font-bold">Book<span className="gradient-text">Easy</span></span></Link>
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium', pathname === item.href ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100')}><item.icon className="w-5 h-5" />{item.label}</Link>)}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-2 mb-2"><div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center"><span className="text-sm font-medium text-primary-700">{admin?.email?.charAt(0).toUpperCase()}</span></div><p className="text-sm font-medium truncate">{admin?.email}</p></div>
            <button onClick={() => { logout(); router.push('/admin/login'); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"><LogOut className="w-5 h-5" />Déconnexion</button>
          </div>
        </div>
      </aside>
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8">
          <button className="lg:hidden p-2 mr-4" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
          <h1 className="text-lg font-semibold">{navItems.find(i => i.href === pathname)?.label || 'Admin'}</h1>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
