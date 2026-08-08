import { createInquirySchema } from './schema';
import { createInquiry, countNew, findRecent, type InquirySummaryRow } from './repository';

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
