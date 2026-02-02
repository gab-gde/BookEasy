'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, CalendarCheck, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { DashboardStats } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { formatTime, getStatusLabel, cn } from '@/lib/utils';
import { Button, Badge, Skeleton } from '@/components/ui';

export default function AdminDashboardPage() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get<DashboardStats>('/admin/dashboard', { token }).then(setStats).finally(() => setIsLoading(false));
  }, [token]);

  const cards = stats ? [
    { label: "Aujourd'hui", value: stats.todayBookings, icon: CalendarDays, color: 'bg-blue-500' },
    { label: 'Cette semaine', value: stats.weekBookings, icon: CalendarCheck, color: 'bg-emerald-500' },
    { label: 'Ce mois', value: stats.monthBookings, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'En attente', value: stats.pendingBookings, icon: Clock, color: 'bg-amber-500' },
  ] : [];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {isLoading ? Array(4).fill(0).map((_, i) => <div key={i} className="card p-6"><Skeleton className="h-10 w-10 rounded-lg mb-4" /><Skeleton className="h-8 w-16 mb-2" /><Skeleton className="h-4 w-24" /></div>) : cards.map((c, i) => (
          <div key={i} className="card p-6">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-4', c.color)}><c.icon className="w-5 h-5 text-white" /></div>
            <p className="text-3xl font-bold text-slate-900">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Réservations récentes</h2>
          <Link href="/admin/bookings"><Button variant="ghost" size="sm">Voir tout<ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
        <div className="divide-y divide-slate-200">
          {isLoading ? Array(5).fill(0).map((_, i) => <div key={i} className="p-4 flex items-center gap-4"><Skeleton className="h-12 w-12 rounded-lg" /><div className="flex-1"><Skeleton className="h-5 w-48 mb-2" /><Skeleton className="h-4 w-32" /></div></div>) : stats?.recentBookings.length === 0 ? <p className="p-12 text-center text-slate-500">Aucune réservation récente</p> : stats?.recentBookings.map(b => (
            <Link key={b.id} href={`/admin/bookings`} className="flex items-center gap-4 p-4 hover:bg-slate-50">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center"><CalendarDays className="w-6 h-6 text-primary-600" /></div>
              <div className="flex-1 min-w-0"><p className="font-medium text-slate-900 truncate">{b.customerName}</p><p className="text-sm text-slate-500">{b.service?.name} • {format(new Date(b.startAt), 'dd/MM/yyyy', { locale: fr })} à {formatTime(b.startAt)}</p></div>
              <Badge variant={b.status === 'CONFIRMED' ? 'success' : b.status === 'PENDING' ? 'warning' : b.status === 'CANCELLED' ? 'danger' : 'info'}>{getStatusLabel(b.status)}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
