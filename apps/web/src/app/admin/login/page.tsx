'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (isAuthenticated) router.push('/admin'); }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      router.push('/admin');
    } catch (err: any) { setError(err.message || 'Identifiants incorrects'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center"><Calendar className="w-6 h-6 text-white" /></div>
          <span className="text-2xl font-bold text-white">Book<span className="text-primary-400">Easy</span></span>
        </Link>
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Espace Administration</h1>
            <p className="text-slate-600">Connectez-vous pour gérer vos réservations</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input pl-12" required /></div>
            <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="input pl-12" required /></div>
            <Button type="submit" className="w-full" isLoading={isLoading}><LogIn className="w-4 h-4" />Se connecter</Button>
          </form>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center mb-3">Compte démo</p>
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600"><p><strong>Email:</strong> admin@bookeasy.com</p><p><strong>Mot de passe:</strong> admin123</p></div>
          </div>
        </div>
        <div className="text-center mt-6"><Link href="/" className="text-slate-400 hover:text-white text-sm">← Retour au site</Link></div>
      </div>
    </div>
  );
}
