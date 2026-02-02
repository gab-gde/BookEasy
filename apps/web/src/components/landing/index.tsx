'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Calendar, Menu, X, ArrowRight, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [{ href: '#features', label: 'Fonctionnalités' }, { href: '#pricing', label: 'Tarifs' }];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-blue-500 flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold">Book<span className="gradient-text">Easy</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-sm font-medium text-slate-600 hover:text-primary-600">{l.label}</a>)}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/admin/login"><Button variant="ghost" size="sm">Admin</Button></Link>
            <Link href="/booking"><Button size="sm"><Sparkles className="w-4 h-4" />Réserver</Button></Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </nav>
        {isMenuOpen && <div className="md:hidden py-4 space-y-2">{navLinks.map(l => <a key={l.href} href={l.href} className="block px-4 py-2 text-slate-600">{l.label}</a>)}<div className="flex gap-2 pt-2"><Link href="/admin/login" className="flex-1"><Button variant="secondary" className="w-full" size="sm">Admin</Button></Link><Link href="/booking" className="flex-1"><Button className="w-full" size="sm">Réserver</Button></Link></div></div>}
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="container-custom text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8"><Sparkles className="w-4 h-4" />Simplifiez vos réservations</div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Réservez en <span className="gradient-text">30 secondes</span></h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">BookEasy permet à vos clients de réserver leurs rendez-vous en ligne, 24h/24. Simple, rapide, efficace.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/booking"><Button size="lg" className="group">Réserver un créneau<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button></Link>
          <Link href="/admin/login"><Button variant="secondary" size="lg">Espace admin</Button></Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-5 h-5 text-primary-500" /><span className="text-sm font-medium">Réservation 24/7</span></div>
          <div className="flex items-center gap-2 text-slate-600"><Clock className="w-5 h-5 text-primary-500" /><span className="text-sm font-medium">Confirmation instantanée</span></div>
          <div className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="w-5 h-5 text-primary-500" /><span className="text-sm font-medium">100% gratuit</span></div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    { title: 'Réservation en ligne', desc: 'Vos clients réservent à toute heure' },
    { title: 'Gestion des disponibilités', desc: 'Définissez vos horaires facilement' },
    { title: 'Tableau de bord', desc: 'Suivez vos réservations en temps réel' },
  ];
  return (
    <section id="features" className="section bg-slate-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Tout ce dont vous avez besoin</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => <div key={i} className="card-hover p-8"><h3 className="text-xl font-semibold text-slate-900 mb-3">{f.title}</h3><p className="text-slate-600">{f.desc}</p></div>)}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple et gratuit</h2>
        <p className="text-lg text-slate-600 mb-12">BookEasy est entièrement gratuit pour cette démo.</p>
        <div className="card max-w-md mx-auto p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Gratuit</h3>
          <p className="text-4xl font-bold text-primary-600 mb-6">0€</p>
          <ul className="text-left space-y-3 mb-8">{['Réservations illimitées', 'Gestion des services', 'Tableau de bord', 'Export CSV'].map((f, i) => <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary-500" />{f}</li>)}</ul>
          <Link href="/booking"><Button className="w-full">Commencer</Button></Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container-custom text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div><span className="text-xl font-bold">BookEasy</span></Link>
        <p className="text-slate-400">© {new Date().getFullYear()} BookEasy. Projet démo.</p>
      </div>
    </footer>
  );
}
