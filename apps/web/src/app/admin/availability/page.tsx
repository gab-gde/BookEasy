'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Clock, Calendar, XCircle } from 'lucide-react';
import { AvailabilityRule, AvailabilityException } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { getDayName } from '@/lib/utils';
import { Button, Input, Modal, EmptyState, Badge, Skeleton } from '@/components/ui';
import toast from 'react-hot-toast';

export default function AvailabilityPage() {
  const { token } = useAuthStore();
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null);
  const [ruleForm, setRuleForm] = useState({ dayOfWeek: 0, startTime: '09:00', endTime: '18:00', slotStepMin: 30, capacity: 1 });
  const [exceptionForm, setExceptionForm] = useState({ date: '', isClosed: true });

  const fetchData = async () => {
    if (!token) return;
    try {
      const [r, e] = await Promise.all([
        api.get<AvailabilityRule[]>('/admin/availability-rules', { token }),
        api.get<AvailabilityException[]>('/admin/availability-exceptions', { token })
      ]);
      setRules(r.sort((a, b) => a.dayOfWeek - b.dayOfWeek));
      setExceptions(e);
    } catch { toast.error('Erreur'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, [token]);

  const openCreateRule = () => {
    setEditingRule(null);
    const usedDays = rules.map(r => r.dayOfWeek);
    const nextDay = [0, 1, 2, 3, 4, 5, 6].find(d => !usedDays.includes(d)) ?? 0;
    setRuleForm({ dayOfWeek: nextDay, startTime: '09:00', endTime: '18:00', slotStepMin: 30, capacity: 1 });
    setIsRuleModalOpen(true);
  };

  const openEditRule = (r: AvailabilityRule) => {
    setEditingRule(r);
    setRuleForm({ dayOfWeek: r.dayOfWeek, startTime: r.startTime, endTime: r.endTime, slotStepMin: r.slotStepMin, capacity: r.capacity });
    setIsRuleModalOpen(true);
  };

  const handleRuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingRule) {
        await api.patch(`/admin/availability-rules/${editingRule.id}`, ruleForm, { token });
      } else {
        await api.post('/admin/availability-rules', ruleForm, { token });
      }
      toast.success(editingRule ? 'Mis à jour' : 'Créé');
      setIsRuleModalOpen(false);
      fetchData();
    } catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  const handleDeleteRule = async (id: string) => {
    if (!token || !confirm('Supprimer cette règle ?')) return;
    try {
      await api.delete(`/admin/availability-rules/${id}`, { token });
      toast.success('Supprimé');
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  const handleExceptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await api.post('/admin/availability-exceptions', exceptionForm, { token });
      toast.success('Exception créée');
      setIsExceptionModalOpen(false);
      fetchData();
    } catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  const handleDeleteException = async (id: string) => {
    if (!token) return;
    try {
      await api.delete(`/admin/availability-exceptions/${id}`, { token });
      toast.success('Supprimé');
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  if (isLoading) return <div className="card p-6"><Skeleton className="h-48 w-full" /></div>;

  return (
    <div className="space-y-8">
      {/* Règles hebdomadaires */}
      <div className="card">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Horaires hebdomadaires</h2>
            <p className="text-sm text-slate-500">Définissez vos jours et heures de travail</p>
          </div>
          <Button onClick={openCreateRule} disabled={rules.length >= 7}>
            <Plus className="w-4 h-4" /> Ajouter un jour
          </Button>
        </div>
        {rules.length === 0 ? (
          <EmptyState icon={Clock} title="Aucun horaire défini" />
        ) : (
          <div className="divide-y">
            {rules.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <span className="w-24 font-medium">{getDayName(r.dayOfWeek)}</span>
                  <Badge variant="info">{r.startTime} - {r.endTime}</Badge>
                  <span className="text-sm text-slate-500">Créneaux de {r.slotStepMin} min</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditRule(r)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(r.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exceptions */}
      <div className="card">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Exceptions</h2>
            <p className="text-sm text-slate-500">Jours fériés, congés</p>
          </div>
          <Button onClick={() => { setExceptionForm({ date: '', isClosed: true }); setIsExceptionModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Ajouter
          </Button>
        </div>
        {exceptions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Aucune exception</div>
        ) : (
          <div className="divide-y">
            {exceptions.map(ex => (
              <div key={ex.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">{format(new Date(ex.date), 'EEEE d MMMM yyyy', { locale: fr })}</span>
                  <Badge variant="danger">Fermé</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteException(ex.id)}>
                  <XCircle className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal règle */}
      <Modal isOpen={isRuleModalOpen} onClose={() => setIsRuleModalOpen(false)} title={editingRule ? 'Modifier les horaires' : 'Ajouter un jour'}>
        <form onSubmit={handleRuleSubmit} className="space-y-4">
          <div>
            <label className="label">Jour de la semaine</label>
            <select className="input" value={ruleForm.dayOfWeek} onChange={e => setRuleForm({ ...ruleForm, dayOfWeek: parseInt(e.target.value) })} disabled={!!editingRule}>
              {[0, 1, 2, 3, 4, 5, 6].map(d => <option key={d} value={d}>{getDayName(d)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Heure début" type="time" value={ruleForm.startTime} onChange={e => setRuleForm({ ...ruleForm, startTime: e.target.value })} />
            <Input label="Heure fin" type="time" value={ruleForm.endTime} onChange={e => setRuleForm({ ...ruleForm, endTime: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Durée créneaux (min)" type="number" min={5} value={ruleForm.slotStepMin} onChange={e => setRuleForm({ ...ruleForm, slotStepMin: parseInt(e.target.value) })} />
            <Input label="Capacité" type="number" min={1} value={ruleForm.capacity} onChange={e => setRuleForm({ ...ruleForm, capacity: parseInt(e.target.value) })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsRuleModalOpen(false)}>Annuler</Button>
            <Button type="submit">{editingRule ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </form>
      </Modal>

      {/* Modal exception */}
      <Modal isOpen={isExceptionModalOpen} onClose={() => setIsExceptionModalOpen(false)} title="Ajouter une exception">
        <form onSubmit={handleExceptionSubmit} className="space-y-4">
          <Input label="Date" type="date" value={exceptionForm.date} onChange={e => setExceptionForm({ ...exceptionForm, date: e.target.value })} required />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={exceptionForm.isClosed} onChange={e => setExceptionForm({ ...exceptionForm, isClosed: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm">Jour fermé</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsExceptionModalOpen(false)}>Annuler</Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
