'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Download, CalendarDays, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking, Service, PaginatedResponse, BOOKING_STATUS } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { formatTime, getStatusLabel, getStatusColor, cn, generateBookingRef } from '@/lib/utils';
import { Button, Select, Modal, EmptyState, SkeletonTable } from '@/components/ui';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const { token } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState({ status: '', serviceId: '', search: '' });

  const fetchBookings = async () => {
    if (!token) return;
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
    if (filters.status) params.set('status', filters.status);
    if (filters.serviceId) params.set('serviceId', filters.serviceId);
    if (filters.search) params.set('search', filters.search);
    try {
      const data = await api.get<PaginatedResponse<Booking>>(`/admin/bookings?${params}`, { token });
      setBookings(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Erreur'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { if (token) api.get<Service[]>('/admin/services', { token }).then(setServices); }, [token]);
  useEffect(() => { fetchBookings(); }, [token, pagination.page, filters]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    if (!token) return;
    try {
      await api.patch(`/admin/bookings/${bookingId}`, { status }, { token });
      toast.success('Statut mis à jour');
      fetchBookings();
      if (selectedBooking?.id === bookingId) setSelectedBooking({ ...selectedBooking, status: status as any });
    } catch { toast.error('Erreur'); }
  };

  const handleExport = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/export/bookings.csv`, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `reservations_${format(new Date(), 'yyyy-MM-dd')}.csv`; a.click();
      toast.success('Export téléchargé');
    } catch { toast.error('Erreur'); }
  };

  const statusOptions = [{ value: '', label: 'Tous' }, ...Object.values(BOOKING_STATUS).map(s => ({ value: s, label: getStatusLabel(s) }))];
  const serviceOptions = [{ value: '', label: 'Tous' }, ...services.map(s => ({ value: s.id, label: s.name }))];

  return (
    <div>
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Rechercher..." className="input pl-10" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} /></div>
          <Select options={statusOptions} value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="w-full md:w-48" />
          <Select options={serviceOptions} value={filters.serviceId} onChange={e => setFilters({ ...filters, serviceId: e.target.value })} className="w-full md:w-48" />
          <Button variant="secondary" onClick={handleExport}><Download className="w-4 h-4" />Export</Button>
        </div>
      </div>
      <div className="card overflow-hidden">
        {isLoading ? <div className="p-4"><SkeletonTable rows={10} /></div> : bookings.length === 0 ? <EmptyState icon={CalendarDays} title="Aucune réservation" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b"><tr><th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Réf</th><th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Client</th><th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Service</th><th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Date</th><th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Statut</th><th className="text-right px-6 py-4 text-sm font-medium text-slate-600">Actions</th></tr></thead>
              <tbody className="divide-y">{bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm">{generateBookingRef(b.id)}</td>
                  <td className="px-6 py-4"><p className="font-medium">{b.customerName}</p><p className="text-sm text-slate-500">{b.customerEmail}</p></td>
                  <td className="px-6 py-4">{b.service?.name}</td>
                  <td className="px-6 py-4"><p>{format(new Date(b.startAt), 'dd/MM/yyyy', { locale: fr })}</p><p className="text-sm text-slate-500">{formatTime(b.startAt)}</p></td>
                  <td className="px-6 py-4"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', getStatusColor(b.status))}>{getStatusLabel(b.status)}</span></td>
                  <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm" onClick={() => setSelectedBooking(b)}><Eye className="w-4 h-4" /></Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-slate-600">{pagination.total} résultat(s)</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={pagination.page === 1} onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="text-sm">Page {pagination.page} / {pagination.totalPages}</span>
              <Button variant="ghost" size="sm" disabled={pagination.page === pagination.totalPages} onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} title="Détails">
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500">Référence</p><p className="font-medium">{generateBookingRef(selectedBooking.id)}</p></div>
              <div><p className="text-slate-500">Service</p><p className="font-medium">{selectedBooking.service?.name}</p></div>
              <div><p className="text-slate-500">Client</p><p className="font-medium">{selectedBooking.customerName}</p></div>
              <div><p className="text-slate-500">Email</p><p className="font-medium">{selectedBooking.customerEmail}</p></div>
              <div><p className="text-slate-500">Date</p><p className="font-medium">{format(new Date(selectedBooking.startAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</p></div>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(BOOKING_STATUS).map(s => <button key={s} onClick={() => handleStatusChange(selectedBooking.id, s)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', selectedBooking.status === s ? getStatusColor(s) : 'bg-slate-100 hover:bg-slate-200')}>{getStatusLabel(s)}</button>)}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
