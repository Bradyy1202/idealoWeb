import { describe, expect, it } from 'vitest';
import { contactSettingsSchema, faqFormSchema } from './schema';

function baseContactSettings(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    whatsapp: '50688887777',
    email: 'hola@idealo.example',
    ...overrides,
  };
}

describe('contactSettingsSchema', () => {
  it('acepta un WhatsApp con código de país, solo dígitos', () => {
    const result = contactSettingsSchema.safeParse(baseContactSettings());

    expect(result.success).toBe(true);
  });

  it('rechaza un WhatsApp con espacios, guiones o "+"', () => {
    const result = contactSettingsSchema.safeParse(
      baseContactSettings({ whatsapp: '+506 8888-7777' }),
    );

    expect(result.success).toBe(false);
  });

  it('rechaza un WhatsApp demasiado corto', () => {
    const result = contactSettingsSchema.safeParse(baseContactSettings({ whatsapp: '1234' }));

    expect(result.success).toBe(false);
  });

  it('rechaza un correo con formato inválido', () => {
    const result = contactSettingsSchema.safeParse(baseContactSettings({ email: 'no-valido' }));

    expect(result.success).toBe(false);
  });

  it('instagram/facebook/schedule/location son opcionales', () => {
    const result = contactSettingsSchema.safeParse(baseContactSettings());

    expect(result.success).toBe(true);
  });
});

describe('faqFormSchema', () => {
  it('acepta pregunta y respuesta sin categoría', () => {
    const result = faqFormSchema.safeParse({
      question: '¿Hacen envíos?',
      answer: 'Sí, a todo el país.',
      sortOrder: 0,
      isActive: true,
    });

    expect(result.success).toBe(true);
  });

  it('rechaza una pregunta vacía', () => {
    const result = faqFormSchema.safeParse({
      question: '',
      answer: 'Sí, a todo el país.',
      sortOrder: 0,
      isActive: true,
    });

    expect(result.success).toBe(false);
  });
});
