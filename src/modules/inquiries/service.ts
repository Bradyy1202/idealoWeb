import { createInquirySchema } from './schema';
import { createInquiry } from './repository';

/** Deja que los errores (de validación o de base) suban: quien necesite tragárselos lo decide en actions.ts. */
export async function registerInquiry(input: unknown): Promise<{ id: string }> {
  const parsed = createInquirySchema.parse(input);
  return createInquiry(parsed);
}
