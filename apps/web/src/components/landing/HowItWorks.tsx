'use client';

import { MousePointerClick, CalendarCheck, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: MousePointerClick,
    number: '01',
    title: 'Choisissez votre prestation',
    description: 'Parcourez les services disponibles et sélectionnez celui qui vous convient.',
  },
  {
    icon: CalendarCheck,
    number: '02',
    title: 'Réservez votre créneau',
    description: 'Consultez les disponibilités en temps réel et choisissez la date et l\'heure idéales.',
  },
  {
    icon: CheckCircle,
    number: '03',
    title: 'C\'est confirmé !',
    description: 'Recevez instantanément votre confirmation avec tous les détails de votre réservation.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-slate-600">
            Réserver un rendez-vous n&apos;a jamais été aussi simple. 
            3 étapes, 30 secondes, c&apos;est fait.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="card p-8 text-center relative z-10 bg-white">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-bold rounded-full">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center mb-6 mt-4">
                    <step.icon className="w-10 h-10 text-primary-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
