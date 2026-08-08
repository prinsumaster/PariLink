'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Hexagon, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const registerSchema = z.object({
  companyName: z.string().min(2, 'Company Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', data);
      
      setAuth(response.data.user, response.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.normalizedMessage || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-blue-600 p-2 rounded-xl shadow-sm border border-blue-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <Hexagon className="h-6 w-6 text-white fill-white/20" strokeWidth={1.5} />
        </div>
        <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">PariLink</span>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Create your account
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Register a new tenant to access the enterprise portal.
      </p>

      <div className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 glass border-red-200/50 dark:border-red-900/30 rounded-lg animate-fade-in-up flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="font-medium text-slate-700 dark:text-slate-300">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Acme Logistics"
              {...register('companyName')}
              className={`transition-all duration-200 ${errors.companyName ? 'border-red-500 focus-visible:ring-red-500' : 'focus-ring hover:border-slate-300 dark:hover:border-slate-700'}`}
            />
            {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-medium text-slate-700 dark:text-slate-300">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={`transition-all duration-200 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-ring hover:border-slate-300 dark:hover:border-slate-700'}`}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-medium text-slate-700 dark:text-slate-300">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className={`transition-all duration-200 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-ring hover:border-slate-300 dark:hover:border-slate-700'}`}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-11 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </span>
            ) : (
              'Register'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
