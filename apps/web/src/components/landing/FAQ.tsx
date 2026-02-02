'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'Comment fonctionne la réservation en ligne ?',
    answer: 'Les clients accèdent à votre page de réservation, choisissent un service et un créneau disponible, puis renseignent leurs coordonnées. Ils reçoivent une confirmation instantanée par email.',
  },
  {
    question: 'Puis-je personnaliser mes horaires et jours de travail ?',
    answer: 'Oui, vous pouvez définir vos horaires pour chaque jour de la semaine, créer des exceptions pour les jours fériés ou les congés, et même ajuster la durée des créneaux selon vos besoins.',
  },
  {
    question: 'Comment sont gérées les annulations ?',
    answer: 'Vous pouvez annuler une réservation depuis votre tableau de bord. Le client est automatiquement notifié et le créneau redevient disponible pour d\'autres réservations.',
  },
  {
    question: 'Y a-t-il une limite de réservations ?',
    answer: 'Non, toutes les formules permettent des réservations illimitées. Nous voulons que vous puissiez développer votre activité sans contraintes.',
  },
  {
    question: 'Comment puis-je exporter mes données ?',
    answer: 'Depuis l\'interface admin, vous pouvez exporter toutes vos réservations au format CSV en un clic. Parfait pour votre comptabilité ou vos statistiques.',
  },
  {
    question: 'BookEasy est-il adapté à mon activité ?',
    answer: 'BookEasy convient à tous les professionnels qui gèrent des rendez-vous : coachs, thérapeutes, salons de coiffure, médecins, formateurs, artisans... Si vous avez un agenda, BookEasy est fait pour vous.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-slate-600">
            Tout ce que vous devez savoir pour bien démarrer avec BookEasy.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card overflow-hidden">
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-slate-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-slate-400 flex-shrink-0 transition-transform',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
