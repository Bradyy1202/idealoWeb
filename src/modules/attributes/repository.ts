import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';

const attributeAdminSelect = {
  id: true,
  name: true,
  slug: true,
  type: true,
  unit: true,
  isFilterable: true,
  sortOrder: true,
  values: {
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      value: true,
      slug: true,
      hexColor: true,
      sortOrder: true,
      _count: { select: { products: true } },
    },
  },
  _count: { select: { categories: true } },
} satisfies Prisma.AttributeSelect;

export type AttributeAdminRow = Prisma.AttributeGetPayload<{ select: typeof attributeAdminSelect }>;

export async function findAllForAdmin(): Promise<AttributeAdminRow[]> {
  return prisma.attribute.findMany({ select: attributeAdminSelect, orderBy: { sortOrder: 'asc' } });
}

export async function findByIdForAdmin(id: string): Promise<AttributeAdminRow | null> {
  return prisma.attribute.findUnique({ where: { id }, select: attributeAdminSelect });
}

export type AttributeWriteData = {
  name: string;
  slug: string;
  type: 'TEXT' | 'COLOR' | 'NUMBER' | 'BOOLEAN';
  unit: string | null;
  isFilterable: boolean;
  sortOrder: number;
};

export async function createAttribute(data: AttributeWriteData): Promise<{ id: string }> {
  return prisma.attribute.create({ data, select: { id: true } });
}

export async function updateAttribute(
  id: string,
  data: AttributeWriteData,
): Promise<{ id: string }> {
  return prisma.attribute.update({ where: { id }, data, select: { id: true } });
}

/** Cascada declarada en el schema: borra también sus valores y los vínculos con categorías y productos. */
export async function deleteAttribute(id: string): Promise<void> {
  await prisma.attribute.delete({ where: { id } });
}

export type AttributeValueWriteData = {
  attributeId: string;
  value: string;
  slug: string;
  hexColor: string | null;
  sortOrder: number;
};

export async function createAttributeValue(data: AttributeValueWriteData): Promise<{ id: string }> {
  return prisma.attributeValue.create({ data, select: { id: true } });
}

export async function updateAttributeValue(
  id: string,
  data: Omit<AttributeValueWriteData, 'attributeId'>,
): Promise<{ id: string }> {
  return prisma.attributeValue.update({ where: { id }, data, select: { id: true } });
}

/** Cascada declarada en el schema: la quita de cualquier producto que la tuviera asignada. */
export async function deleteAttributeValue(id: string): Promise<void> {
  await prisma.attributeValue.delete({ where: { id } });
}
