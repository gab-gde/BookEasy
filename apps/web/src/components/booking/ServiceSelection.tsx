'use client';

import { useState, useEffect } from 'react';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { Service } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useBookingStore } from '@/lib/booking-store';
import { formatCurrency, formatDuration, cn } from '@/lib/utils';
import { Button, SkeletonCard } from '@/components/ui';

export function ServiceSelection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { selectedService, setSelectedService, setCurrentStep } = useBookingStore();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get<Service[]>('/services');
        setServices(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleContinue = () => {
    if (selectedService) {
      setCurrentStep(2);
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Choisissez votre prestation
        </h2>
        <p className="text-slate-600">
          Sélectionnez le service qui correspond à vos besoins
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleSelect(service)}
            className={cn(
              'card-hover p-6 text-left transition-all',
              selectedService?.id === service.id &&
                'ring-2 ring-primary-500 border-primary-500 bg-primary-50'
            )}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {service.name}
            </h3>
            {service.description && (
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(service.durationMin)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary-600 font-medium">
                <Tag className="w-4 h-4" />
                <span>
                  {service.priceCents === 0
                    ? 'Gratuit'
                    : formatCurrency(service.priceCents)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedService}
          className="group"
        >
          Continuer
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
