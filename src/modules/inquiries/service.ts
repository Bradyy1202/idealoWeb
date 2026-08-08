import {
  createInquirySchema,
  inquiryAdminFiltersSchema,
  updateInquiryStatusSchema,
  updateInquiryNotesSchema,
  type InquirySourceInput,
  type InquiryStatusInput,
} from './schema';
import {
  createInquiry,
  countNew,
  findRecent,
  findManyForAdmin,
  countForAdmin,
  findByIdForAdmin,
  updateStatus,
  updateNotes,
  type InquirySummaryRow,
  type InquiryAdminListRow,
  type InquiryDetailRow,
} from './repository';

/** Deja que los errores (de validación o de base) suban: quien necesite tragárselos lo decide en actions.ts. */
export async function registerInquiry(input: unknown): Promise<{ id: string }> {
  const parsed = createInquirySchema.parse(input);
  return createInquiry(parsed);
}

export async function getNewInquiryCount(): Promise<number> {
  return countNew();
}

export type InquirySummary = {
  id: string;
  source: InquirySummaryRow['source'];
  status: InquirySummaryRow['status'];
  customerName: string | null;
  customerEmail: string | null;
  message: string | null;
  createdAt: Date;
  itemsSummary: string | null;
};

function toInquirySummary(row: InquirySummaryRow): InquirySummary {
  const itemsSummary =
    row.items.length > 0
      ? row.items.map((item) => `${item.quantity}x ${item.productSnapshot}`).join(', ')
      : null;

  return {
    id: row.id,
    source: row.source,
    status: row.status,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    message: row.message,
    createdAt: row.createdAt,
    itemsSummary,
  };
}

export async function getRecentInquiries(limit = 5): Promise<InquirySummary[]> {
  const rows = await findRecent(limit);
  return rows.map(toInquirySummary);
}

// ---------------------------------------------------------------------------
// Panel de administración (tarea 4.13): bandeja de consultas.
// ---------------------------------------------------------------------------

export const inquirySourceLabels: Record<InquirySourceInput, string> = {
  WHATSAPP_PRODUCT: 'WhatsApp (producto)',
  WHATSAPP_FLOAT: 'WhatsApp (flotante)',
  QUOTE_LIST: 'Lista de cotización',
  CONTACT_FORM: 'Formulario de contacto',
};

export const inquiryStatusLabels: Record<InquiryStatusInput, string> = {
  NEW: 'Nueva',
  CONTACTED: 'Contactada',
  QUOTED: 'Cotizada',
  WON: 'Ganada',
  LOST: 'Perdida',
};

export type InquiryAdminListItem = {
  id: string;
  source: InquirySourceInput;
  status: InquiryStatusInput;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  message: string | null;
  itemsSummary: string | null;
  createdAt: Date;
};

function toInquiryAdminListItem(row: InquiryAdminListRow): InquiryAdminListItem {
  const itemsSummary =
    row.items.length > 0
      ? row.items.map((item) => `${item.quantity}x ${item.productSnapshot}`).join(', ')
      : null;

  return {
    id: row.id,
    source: row.source,
    status: row.status,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    message: row.message,
    itemsSummary,
    createdAt: row.createdAt,
  };
}

export type InquiryAdminListResult = { items: InquiryAdminListItem[]; total: number };

export async function getInquiriesForAdmin(input: unknown): Promise<InquiryAdminListResult> {
  const filters = inquiryAdminFiltersSchema.parse(input);
  const [rows, total] = await Promise.all([findManyForAdmin(filters), countForAdmin(filters)]);
  return { items: rows.map(toInquiryAdminListItem), total };
}

export type InquiryDetail = {
  id: string;
  source: InquirySourceInput;
  status: InquiryStatusInput;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  message: string | null;
  referrer: string | null;
  userAgent: string | null;
  adminNotes: string | null;
  contactedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    productId: string | null;
    productSnapshot: string;
    quantity: number;
    notes: string | null;
  }>;
};

function toInquiryDetail(row: InquiryDetailRow): InquiryDetail {
  return row;
}

export async function getInquiryForAdmin(id: string): Promise<InquiryDetail | null> {
  const row = await findByIdForAdmin(id);
  return row ? toInquiryDetail(row) : null;
}

/** La primera vez que se saca una consulta de NEW se estampa `contactedAt`; cambios de estado posteriores no lo tocan (registra el primer contacto, no el último cambio). */
export async function updateInquiryStatus(id: string, input: unknown): Promise<void> {
  const parsed = updateInquiryStatusSchema.parse(input);
  const current = await findByIdForAdmin(id);
  if (!current) throw new Error('Consulta no encontrada.');
  const contactedAt = !current.contactedAt && parsed.status !== 'NEW' ? new Date() : undefined;
  await updateStatus(id, parsed.status, contactedAt);
}

export async function updateInquiryNotes(id: string, input: unknown): Promise<void> {
  const parsed = updateInquiryNotesSchema.parse(input);
  await updateNotes(id, parsed.adminNotes?.trim() || null);
}
