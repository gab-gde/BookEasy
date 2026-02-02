'use client';

import Link from 'next/link';
import { Calendar, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">BookEasy</span>
            </Link>
            <p className="text-slate-400 max-w-sm">
              La solution de réservation en ligne simple et moderne pour les professionnels indépendants.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-slate-400 hover:text-white transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liens</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/booking" className="text-slate-400 hover:text-white transition-colors">
                  Réserver
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-400 hover:text-white transition-colors">
                  Espace admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} BookEasy. Tous droits réservés.
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-red-500 fill-red-500" /> en France
          </p>
        </div>
      </div>
    </footer>
  );
}
