'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, Clock, Tag } from 'lucide-react';
import { Service } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { formatCurrency, formatDuration, cn } from '@/lib/utils';
import { Button, Input, Modal, EmptyState, Badge, Skeleton } from '@/components/ui';
import toast from 'react-hot-toast';

export default function ServicesPage() {
  const { token } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: '', durationMin: 60, priceCents: 0, description: '', isActive: true });

  const fetchServices = async () => {
    if (!token) return;
    try {
      const data = await api.get<Service[]>('/admin/services', { token });
      setServices(data);
    } catch (err) {
      toast.error('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [token]);

  const openCreate = () => {
    setEditingService(null);
    setFormData({ name: '', durationMin: 60, priceCents: 0, description: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      durationMin: service.durationMin,
      priceCents: service.priceCents,
      description: service.description || '',
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      if (editingService) {
        await api.patch(`/admin/services/${editingService.id}`, formData, { token });
        toast.success('Service mis à jour');
      } else {
        await api.post('/admin/services', formData, { token });
        toast.success('Service créé');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await api.delete(`/admin/services/${id}`, { token });
      toast.success('Service supprimé');
      fetchServices();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-600">{services.length} service{services.length > 1 ? 's' : ''}</p>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Nouveau service
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucun service"
          description="Créez votre premier service pour commencer à recevoir des réservations"
          action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> Créer un service</Button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className={cn('card p-6 relative', !service.isActive && 'opacity-60')}>
              {!service.isActive && (
                <Badge variant="default" className="absolute top-4 right-4">Inactif</Badge>
              )}
              <h3 className="text-lg font-semibold text-slate-900 mb-2 pr-16">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{service.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(service.durationMin)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary-600 font-medium">
                  <Tag className="w-4 h-4" />
                  <span>{service.priceCents === 0 ? 'Gratuit' : formatCurrency(service.priceCents)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(service)}>
                  <Pencil className="w-4 h-4" /> Modifier
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Modifier le service' : 'Nouveau service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du service *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Consultation"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Durée (min) *"
              type="number"
              min={5}
              max={480}
              value={formData.durationMin}
              onChange={(e) => setFormData({ ...formData, durationMin: parseInt(e.target.value) })}
              required
            />
            <Input
              label="Prix (€)"
              type="number"
              min={0}
              step={0.01}
              value={formData.priceCents / 100}
              onChange={(e) => setFormData({ ...formData, priceCents: Math.round(parseFloat(e.target.value) * 100) })}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[80px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du service..."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">Service actif (visible pour les clients)</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {editingService ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
