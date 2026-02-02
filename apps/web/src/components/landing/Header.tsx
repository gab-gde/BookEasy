'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Fonctionnalités' },
    { href: '#how-it-works', label: 'Comment ça marche' },
    { href: '#pricing', label: 'Tarifs' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-xl group-hover:shadow-primary-500/30 transition-shadow">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Book<span className="gradient-text">Easy</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
            <Link href="/booking">
              <Button size="sm">
                <Sparkles className="w-4 h-4" />
                Réserver
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-slate-600" /> : <Menu className="w-6 h-6 text-slate-600" />}
          </button>
        </nav>

        <div className={cn('md:hidden overflow-hidden transition-all duration-300', isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0')}>
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-200">
              <Link href="/admin/login" className="flex-1">
                <Button variant="secondary" className="w-full" size="sm">Admin</Button>
              </Link>
              <Link href="/booking" className="flex-1">
                <Button className="w-full" size="sm">Réserver</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
