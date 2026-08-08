import bcrypt from 'bcryptjs';
import { loginSchema } from './schema';
import { findUserByEmail, touchLastLogin, type UserAuthRow } from './repository';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: UserAuthRow['role'];
};

/**
 * Devuelve null ante cualquier fallo (usuario inexistente, inactivo,
 * contraseña incorrecta): no distingue el motivo para no filtrar por
 * temporización o respuesta qué correos existen en la base.
 */
export async function verifyCredentials(input: unknown): Promise<AuthenticatedUser | null> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return null;

  const user = await findUserByEmail(parsed.data.email);
  if (!user || !user.isActive) return null;

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordMatches) return null;

  void touchLastLogin(user.id).catch(() => {});

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
