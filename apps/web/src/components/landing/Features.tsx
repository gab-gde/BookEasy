'use client';

import { Calendar, Clock, Bell, Users, BarChart3, Shield } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Réservation en ligne',
    description: 'Vos clients réservent directement depuis votre site, à toute heure du jour et de la nuit.',
  },
  {
    icon: Clock,
    title: 'Gestion des disponibilités',
    description: 'Définissez vos horaires, vos jours off et vos exceptions en quelques clics.',
  },
  {
    icon: Bell,
    title: 'Notifications automatiques',
    description: 'Confirmations et rappels envoyés automatiquement à vos clients.',
  },
  {
    icon: Users,
    title: 'Multi-services',
    description: 'Proposez différentes prestations avec des durées et tarifs personnalisés.',
  },
  {
    icon: BarChart3,
    title: 'Tableau de bord',
    description: 'Suivez vos réservations, analysez votre activité et exportez vos données.',
  },
  {
    icon: Shield,
    title: 'Simple et fiable',
    description: 'Interface intuitive, pas de formation nécessaire. Ça marche, tout simplement.',
  },
];

export function Features() {
  return (
    <section id="features" className="section bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-lg text-slate-600">
            BookEasy simplifie la gestion de vos rendez-vous avec des fonctionnalités 
            pensées pour les professionnels indépendants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-hover p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
