import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import type { CreateInquiryInput, InquiryAdminFilters, InquiryStatusInput } from './schema';

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

// ---------------------------------------------------------------------------
// Panel de administración (tarea 4.13): bandeja de consultas.
// ---------------------------------------------------------------------------

const inquiryAdminListSelect = {
  id: true,
  source: true,
  status: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  message: true,
  createdAt: true,
  items: { select: { productSnapshot: true, quantity: true } },
} satisfies Prisma.InquirySelect;

export type InquiryAdminListRow = Prisma.InquiryGetPayload<{
  select: typeof inquiryAdminListSelect;
}>;

function buildInquiryAdminWhere(filters: InquiryAdminFilters): Prisma.InquiryWhereInput {
  const where: Prisma.InquiryWhereInput = {};
  if (filters.status !== 'all') where.status = filters.status;
  if (filters.source !== 'all') where.source = filters.source;
  if (filters.q) {
    where.OR = [
      { customerName: { contains: filters.q, mode: 'insensitive' } },
      { customerEmail: { contains: filters.q, mode: 'insensitive' } },
      { customerPhone: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

export async function findManyForAdmin(
  filters: InquiryAdminFilters,
): Promise<InquiryAdminListRow[]> {
  return prisma.inquiry.findMany({
    where: buildInquiryAdminWhere(filters),
    orderBy: { createdAt: 'desc' },
    skip: filters.skip,
    take: filters.take,
    select: inquiryAdminListSelect,
  });
}

export async function countForAdmin(filters: InquiryAdminFilters): Promise<number> {
  return prisma.inquiry.count({ where: buildInquiryAdminWhere(filters) });
}

const inquiryDetailSelect = {
  id: true,
  source: true,
  status: true,
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  message: true,
  referrer: true,
  userAgent: true,
  adminNotes: true,
  contactedAt: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: { id: true, productId: true, productSnapshot: true, quantity: true, notes: true },
  },
} satisfies Prisma.InquirySelect;

export type InquiryDetailRow = Prisma.InquiryGetPayload<{ select: typeof inquiryDetailSelect }>;

export async function findByIdForAdmin(id: string): Promise<InquiryDetailRow | null> {
  return prisma.inquiry.findUnique({ where: { id }, select: inquiryDetailSelect });
}

/** `contactedAt` solo se toca si el llamador manda una fecha: así el service decide cuándo estampar el primer contacto sin arriesgarse a pisarlo en cada cambio de estado. */
export async function updateStatus(
  id: string,
  status: InquiryStatusInput,
  contactedAt?: Date,
): Promise<void> {
  await prisma.inquiry.update({
    where: { id },
    data: { status, ...(contactedAt ? { contactedAt } : {}) },
  });
}

export async function updateNotes(id: string, adminNotes: string | null): Promise<void> {
  await prisma.inquiry.update({ where: { id }, data: { adminNotes } });
}
