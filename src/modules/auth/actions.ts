'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export type LoginState = {
  status: 'idle' | 'error';
  message?: string;
  email?: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  // React resetea los campos no controlados del formulario después de que
  // el server action termina: sin devolver el correo tendría que
  // retipearlo entero cada vez que se equivoca solo la contraseña.
  const email = String(formData.get('email') ?? '');

  try {
    await signIn('credentials', {
      email,
      password: formData.get('password'),
      redirectTo: formData.get('callbackUrl')?.toString() || '/admin',
    });
    return { status: 'idle' };
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: 'error', message: 'Correo o contraseña incorrectos.', email };
    }
    // signIn() redirige lanzando un error especial de Next (NEXT_REDIRECT) en
    // el caso exitoso: hay que dejarlo seguir su curso, no es un error real.
    throw error;
  }
}
