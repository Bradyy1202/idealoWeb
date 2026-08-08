import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, buildProductInquiryMessage, buildQuoteListMessage } from './whatsapp';

describe('buildWhatsAppUrl', () => {
  it('arma la URL de wa.me con el teléfono y el mensaje codificado', () => {
    const url = buildWhatsAppUrl('50688887777', 'Hola, quiero cotizar productos.');

    expect(url).toBe('https://wa.me/50688887777?text=Hola%2C%20quiero%20cotizar%20productos.');
  });

  it('codifica caracteres especiales y tildes del mensaje', () => {
    const url = buildWhatsAppUrl('50688887777', '¿Cuánto tarda un pedido?');

    expect(url).toContain('text=');
    expect(decodeURIComponent(url.split('text=')[1] ?? '')).toBe('¿Cuánto tarda un pedido?');
  });
});

describe('buildProductInquiryMessage', () => {
  it('incluye el SKU entre paréntesis cuando existe', () => {
    const message = buildProductInquiryMessage({
      name: 'Botella térmica 750 ml',
      sku: 'BOT-TER-750',
      url: 'https://idealo.example/producto/botella-termica-750ml',
    });

    expect(message).toBe(
      'Hola, quiero cotizar: Botella térmica 750 ml (BOT-TER-750).\nhttps://idealo.example/producto/botella-termica-750ml',
    );
  });

  it('omite los paréntesis del SKU cuando es null', () => {
    const message = buildProductInquiryMessage({
      name: 'Botella térmica 750 ml',
      sku: null,
      url: 'https://idealo.example/producto/botella-termica-750ml',
    });

    expect(message).toBe(
      'Hola, quiero cotizar: Botella térmica 750 ml.\nhttps://idealo.example/producto/botella-termica-750ml',
    );
  });
});

describe('buildQuoteListMessage', () => {
  it('arma una línea por producto con cantidad, SKU y notas', () => {
    const message = buildQuoteListMessage(
      [
        { name: 'Botella térmica', sku: 'BOT-TER-750', quantity: 2, notes: 'Color azul' },
        { name: 'Taza mágica', sku: null, quantity: 1 },
      ],
      'https://idealo.example/lista-de-cotizacion',
    );

    expect(message).toBe(
      'Hola, quiero cotizar estos productos:\n' +
        '• 2x Botella térmica (BOT-TER-750) — Color azul\n' +
        '• 1x Taza mágica\n' +
        '\n' +
        'https://idealo.example/lista-de-cotizacion',
    );
  });

  it('devuelve el mensaje sin líneas de producto cuando la lista está vacía', () => {
    const message = buildQuoteListMessage([], 'https://idealo.example/lista-de-cotizacion');

    expect(message).toBe(
      'Hola, quiero cotizar estos productos:\n\n\nhttps://idealo.example/lista-de-cotizacion',
    );
  });
});
