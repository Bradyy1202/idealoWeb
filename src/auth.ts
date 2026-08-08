import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verifyCredentials } from '@/modules/auth/service';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: (credentials) => verifyCredentials(credentials),
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      // La aumentación de tipos de next-auth/jwt no termina de fusionarse en
      // esta versión beta: token.id/token.role llegan como `unknown` acá
      // aunque el callback jwt() ya los puso con el tipo correcto arriba.
      session.user.id = token.id as string;
      session.user.role = token.role as 'ADMIN' | 'EDITOR';
      return session;
    },
  },
});
