'use client';

import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

const plans = [
  {
    name: 'Gratuit',
    description: 'Parfait pour démarrer',
    price: '0€',
    period: '/mois',
    features: [
      'Réservations illimitées',
      'Jusqu\'à 3 services',
      'Notifications email',
      'Tableau de bord basique',
      'Support par email',
    ],
    cta: 'Commencer gratuitement',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'Pour les professionnels',
    price: '19€',
    period: '/mois',
    features: [
      'Tout du plan Gratuit',
      'Services illimités',
      'Rappels SMS',
      'Statistiques avancées',
      'Export CSV',
      'Support prioritaire',
      'Personnalisation avancée',
    ],
    cta: 'Essayer Pro',
    popular: true,
  },
  {
    name: 'Business',
    description: 'Pour les équipes',
    price: '49€',
    period: '/mois',
    features: [
      'Tout du plan Pro',
      'Multi-utilisateurs',
      'Gestion des équipes',
      'API & Webhooks',
      'Intégrations tierces',
      'Account manager dédié',
    ],
    cta: 'Contacter les ventes',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Des tarifs simples et transparents
          </h2>
          <p className="text-lg text-slate-600">
            Commencez gratuitement, évoluez selon vos besoins. 
            Pas de frais cachés, pas de surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card relative ${
                plan.popular
                  ? 'border-2 border-primary-500 shadow-xl shadow-primary-500/10'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-medium rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Populaire
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/booking">
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
