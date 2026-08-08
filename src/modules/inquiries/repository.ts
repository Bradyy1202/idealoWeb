import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import type { CreateInquiryInput } from './schema';

export async function createInquiry(input: CreateInquiryInput): Promise<{ id: string }> {
  return prisma.inquiry.create({
    data: {
      source: input.source,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      message: input.message,
      referrer: input.referrer,
      userAgent: input.userAgent,
      items:
        input.items.length > 0
          ? {
              create: input.items.map((item) => ({
                productId: item.productId,
                productSnapshot: item.productSnapshot,
                quantity: item.quantity,
                notes: item.notes,
              })),
            }
          : undefined,
    },
    select: { id: true },
  });
}

/** Consultas sin atender: es el número que importa mostrar de un vistazo en el panel. */
export async function countNew(): Promise<number> {
  return prisma.inquiry.count({ where: { status: 'NEW' } });
}

const inquirySummarySelect = {
  id: true,
  source: true,
  status: true,
  customerName: true,
  customerEmail: true,
  message: true,
  createdAt: true,
  items: { select: { productSnapshot: true, quantity: true } },
} satisfies Prisma.InquirySelect;

export type InquirySummaryRow = Prisma.InquiryGetPayload<{ select: typeof inquirySummarySelect }>;

export async function findRecent(limit: number): Promise<InquirySummaryRow[]> {
  return prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: inquirySummarySelect,
  });
}
