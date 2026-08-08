import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Logo } from '@/shared/ui/logo';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Ingresar | Panel',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo height={32} />
        </div>

        <div className="border-border rounded-2xl border p-6">
          <h1 className="text-xl font-semibold">Ingresar al panel</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Acceso exclusivo para administración.
          </p>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
