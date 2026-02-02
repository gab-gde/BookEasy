'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-100/50 via-accent-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-accent-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Simplifiez vos réservations dès aujourd&apos;hui</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 animate-slide-up">
            Réservez en{' '}
            <span className="gradient-text">30 secondes</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            BookEasy permet à vos clients de réserver leurs rendez-vous en ligne, 
            24h/24. Fini les appels manqués et les agendas papier.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link href="/booking">
              <Button size="lg" className="group">
                Réserver un créneau
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" size="lg">
                Voir comment ça marche
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium">Réservation 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium">Confirmation instantanée</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium">100% gratuit</span>
            </div>
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 md:mt-24 relative animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white rounded-lg text-xs text-slate-400 border border-slate-200">
                    bookeasy.app/booking
                  </div>
                </div>
              </div>
              {/* Content preview */}
              <div className="p-8 bg-gradient-to-br from-slate-50 to-white">
                <div className="grid md:grid-cols-3 gap-6">
                  {['Consultation découverte', 'Coaching individuel', 'Coaching premium'].map((service, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                        <Calendar className="w-6 h-6 text-primary-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{service}</h3>
                      <p className="text-sm text-slate-500 mb-4">
                        {i === 0 ? 'Gratuit • 30 min' : i === 1 ? '80€ • 1h' : '120€ • 1h30'}
                      </p>
                      <div className="h-10 bg-primary-500 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
