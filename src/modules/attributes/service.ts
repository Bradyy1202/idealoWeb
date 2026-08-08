import { attributeFormSchema, attributeValueFormSchema } from './schema';
import {
  findAllForAdmin,
  findByIdForAdmin,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  createAttributeValue,
  deleteAttributeValue,
  type AttributeAdminRow,
} from './repository';

export type AttributeAdminItem = {
  id: string;
  name: string;
  slug: string;
  type: AttributeAdminRow['type'];
  unit: string | null;
  isFilterable: boolean;
  sortOrder: number;
  categoryCount: number;
  values: Array<{
    id: string;
    value: string;
    slug: string;
    hexColor: string | null;
    sortOrder: number;
    productCount: number;
  }>;
};

function toAttributeAdminItem(row: AttributeAdminRow): AttributeAdminItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: row.type,
    unit: row.unit,
    isFilterable: row.isFilterable,
    sortOrder: row.sortOrder,
    categoryCount: row._count.categories,
    values: row.values.map((value) => ({
      id: value.id,
      value: value.value,
      slug: value.slug,
      hexColor: value.hexColor,
      sortOrder: value.sortOrder,
      productCount: value._count.products,
    })),
  };
}

export async function getAttributesForAdmin(): Promise<AttributeAdminItem[]> {
  const rows = await findAllForAdmin();
  return rows.map(toAttributeAdminItem);
}

export async function getAttributeForEdit(id: string): Promise<AttributeAdminItem | null> {
  const row = await findByIdForAdmin(id);
  return row ? toAttributeAdminItem(row) : null;
}

function emptyToNull(value: string | undefined): string | null {
  return value && value.trim() !== '' ? value.trim() : null;
}

export async function createAttributeFromInput(input: unknown): Promise<{ id: string }> {
  const parsed = attributeFormSchema.parse(input);
  return createAttribute({
    name: parsed.name,
    slug: parsed.slug,
    type: parsed.type,
    unit: emptyToNull(parsed.unit),
    isFilterable: parsed.isFilterable,
    sortOrder: parsed.sortOrder,
  });
}

export async function updateAttributeFromInput(
  id: string,
  input: unknown,
): Promise<{ id: string }> {
  const parsed = attributeFormSchema.parse(input);
  return updateAttribute(id, {
    name: parsed.name,
    slug: parsed.slug,
    type: parsed.type,
    unit: emptyToNull(parsed.unit),
    isFilterable: parsed.isFilterable,
    sortOrder: parsed.sortOrder,
  });
}

export async function deleteAttributeById(id: string): Promise<void> {
  await deleteAttribute(id);
}

export async function createAttributeValueFromInput(input: unknown): Promise<{ id: string }> {
  const parsed = attributeValueFormSchema.parse(input);
  return createAttributeValue({
    attributeId: parsed.attributeId,
    value: parsed.value,
    slug: parsed.slug,
    hexColor: emptyToNull(parsed.hexColor),
    sortOrder: parsed.sortOrder,
  });
}

export async function deleteAttributeValueById(id: string): Promise<void> {
  await deleteAttributeValue(id);
}
