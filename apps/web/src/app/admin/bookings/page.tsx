'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Download, CalendarDays, Eye, ChevronLeft, ChevronRight, MessageSquare, XCircle } from 'lucide-react';
import { Booking, Service, PaginatedResponse, BOOKING_STATUS } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { formatTime, getStatusLabel, getStatusColor, cn, generateBookingRef } from '@/lib/utils';
import { Button, Badge, Input, Select, Modal, EmptyState, SkeletonTable } from '@/components/ui';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const { token } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newNote, setNewNote] = useState('');
  const [filters, setFilters] = useState({ status: '', serviceId: '', search: '' });

  const fetchBookings = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(pagination.page));
      params.set('limit', String(pagination.limit));
      if (filters.status) params.set('status', filters.status);
      if (filters.serviceId) params.set('serviceId', filters.serviceId);
      if (filters.search) params.set('search', filters.search);

      const data = await api.get<PaginatedResponse<Booking>>(`/admin/bookings?${params}`, { token });
      setBookings(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      if (!token) return;
      try {
        const data = await api.get<Service[]>('/admin/services', { token });
        setServices(data);
      } catch (err) {}
    };
    fetchServices();
  }, [token]);

  useEffect(() => { fetchBookings(); }, [token, pagination.page, filters]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    if (!token) return;
    try {
      await api.patch(`/admin/bookings/${bookingId}`, { status }, { token });
      toast.success('Statut mis à jour');
      fetchBookings();
      if (selectedBooking?.id === bookingId) {
        const updated = await api.get<Booking>(`/admin/bookings/${bookingId}`, { token });
        setSelectedBooking(updated);
      }
    } catch (err) { toast.error('Erreur lors de la mise à jour'); }
  };

  const handleAddNote = async () => {
    if (!token || !selectedBooking || !newNote.trim()) return;
    try {
      await api.post(`/admin/bookings/${selectedBooking.id}/notes`, { content: newNote }, { token });
      toast.success('Note ajoutée');
      setNewNote('');
      const updated = await api.get<Booking>(`/admin/bookings/${selectedBooking.id}`, { token });
      setSelectedBooking(updated);
    } catch (err) { toast.error('Erreur'); }
  };

  const handleCancel = async () => {
    if (!token || !selectedBooking) return;
    if (!confirm('Annuler cette réservation et notifier le client ?')) return;
    try {
      await api.post(`/admin/bookings/${selectedBooking.id}/cancel`, {}, { token });
      toast.success('Réservation annulée');
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) { toast.error('Erreur'); }
  };

  const handleExport = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/export/bookings.csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      toast.success('Export téléchargé');
    } catch (err) { toast.error('Erreur export'); }
  };

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: BOOKING_STATUS.PENDING, label: 'En attente' },
    { value: BOOKING_STATUS.CONFIRMED, label: 'Confirmée' },
    { value: BOOKING_STATUS.COMPLETED, label: 'Terminée' },
    { value: BOOKING_STATUS.CANCELLED, label: 'Annulée' },
  ];

  const serviceOptions = [
    { value: '', label: 'Tous les services' },
    ...services.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div>
      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              className="input pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full md:w-48"
          />
          <Select
            options={serviceOptions}
            value={filters.serviceId}
            onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
            className="w-full md:w-48"
          />
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-4"><SkeletonTable rows={10} /></div>
        ) : bookings.length === 0 ? (
          <EmptyState icon={CalendarDays} title="Aucune réservation" description="Les réservations apparaîtront ici" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Référence</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Service</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Statut</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">{generateBookingRef(booking.id)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{booking.customerName}</p>
                      <p className="text-sm text-slate-500">{booking.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{booking.service?.name}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{format(new Date(booking.startAt), 'dd/MM/yyyy', { locale: fr })}</p>
                      <p className="text-sm text-slate-500">{formatTime(booking.startAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', getStatusColor(booking.status))}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                        <Eye className="w-4 h-4" /> Détails
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              {pagination.total} résultat{pagination.total > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600">
                Page {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} title="Détails de la réservation">
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Référence</p>
                <p className="font-medium">{generateBookingRef(selectedBooking.id)}</p>
              </div>
              <div>
                <p className="text-slate-500">Service</p>
                <p className="font-medium">{selectedBooking.service?.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Client</p>
                <p className="font-medium">{selectedBooking.customerName}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-medium">{selectedBooking.customerEmail}</p>
              </div>
              <div>
                <p className="text-slate-500">Date</p>
                <p className="font-medium">{format(new Date(selectedBooking.startAt), 'EEEE d MMMM yyyy', { locale: fr })}</p>
              </div>
              <div>
                <p className="text-slate-500">Horaire</p>
                <p className="font-medium">{formatTime(selectedBooking.startAt)} - {formatTime(selectedBooking.endAt)}</p>
              </div>
            </div>

            {selectedBooking.customerNote && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Note du client</p>
                <p className="text-slate-700">{selectedBooking.customerNote}</p>
              </div>
            )}

            {/* Status change */}
            <div>
              <p className="text-sm text-slate-500 mb-2">Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(BOOKING_STATUS).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedBooking.id, status)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      selectedBooking.status === status
                        ? getStatusColor(status)
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-sm text-slate-500 mb-2">Notes internes</p>
              {selectedBooking.notes && selectedBooking.notes.length > 0 && (
                <div className="space-y-2 mb-4">
                  {selectedBooking.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-50 rounded-lg text-sm">
                      <p className="text-slate-700">{note.content}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(new Date(note.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Ajouter une note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Cancel button */}
            {selectedBooking.status !== BOOKING_STATUS.CANCELLED && (
              <Button variant="danger" className="w-full" onClick={handleCancel}>
                <XCircle className="w-4 h-4" /> Annuler et notifier
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
