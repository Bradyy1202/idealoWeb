import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';

const userAuthSelect = {
  id: true,
  email: true,
  name: true,
  passwordHash: true,
  role: true,
  isActive: true,
} satisfies Prisma.UserSelect;

export type UserAuthRow = Prisma.UserGetPayload<{ select: typeof userAuthSelect }>;

export async function findUserByEmail(email: string): Promise<UserAuthRow | null> {
  return prisma.user.findUnique({ where: { email }, select: userAuthSelect });
}

/** Efecto secundario no crítico: si falla, no debe impedir el login. */
export async function touchLastLogin(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
}
