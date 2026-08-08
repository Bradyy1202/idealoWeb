import { describe, expect, it } from 'vitest';
import { contactFormSchema } from './schema';

function baseContactInput(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    name: 'María Fernanda',
    email: 'maria@example.com',
    message: 'Quiero cotizar 20 tazas para un evento corporativo.',
    website: '',
    ...overrides,
  };
}

describe('contactFormSchema', () => {
  it('acepta un envío normal, con el honeypot vacío', () => {
    const result = contactFormSchema.safeParse(baseContactInput());

    expect(result.success).toBe(true);
  });

  it('acepta un envío que directamente no manda el campo "website" (default a "")', () => {
    const { website: _website, ...rest } = baseContactInput();
    const result = contactFormSchema.safeParse(rest);

    expect(result.success).toBe(true);
  });

  it('rechaza el envío si el honeypot "website" viene con cualquier valor (lo llenó un bot)', () => {
    const result = contactFormSchema.safeParse(
      baseContactInput({ website: 'https://spam.example' }),
    );

    expect(result.success).toBe(false);
  });

  it('rechaza un correo con formato inválido', () => {
    const result = contactFormSchema.safeParse(baseContactInput({ email: 'no-es-un-correo' }));

    expect(result.success).toBe(false);
  });

  it('rechaza un mensaje demasiado corto (menos de 10 caracteres)', () => {
    const result = contactFormSchema.safeParse(baseContactInput({ message: 'Hola' }));

    expect(result.success).toBe(false);
  });

  it('rechaza un nombre vacío', () => {
    const result = contactFormSchema.safeParse(baseContactInput({ name: '' }));

    expect(result.success).toBe(false);
  });
});
