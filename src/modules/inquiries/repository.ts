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
