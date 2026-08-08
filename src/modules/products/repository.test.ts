import { describe, expect, it } from 'vitest';
import { buildProductWhere } from './repository';

describe('buildProductWhere', () => {
  it('solo filtra por isActive cuando no hay ningún filtro', () => {
    const where = buildProductWhere({
      categoryIds: [],
      attributeValueIdsByAttribute: {},
      q: undefined,
    });

    expect(where).toEqual({ isActive: true });
  });

  it('omite categoryId por completo cuando categoryIds está vacío (no "in: []", que significaría ninguno)', () => {
    const where = buildProductWhere({
      categoryIds: [],
      attributeValueIdsByAttribute: {},
      q: undefined,
    });

    expect(where).not.toHaveProperty('categoryId');
  });

  it('filtra por categoryId con "in" cuando hay categorías', () => {
    const where = buildProductWhere({
      categoryIds: ['cat-1', 'cat-2'],
      attributeValueIdsByAttribute: {},
      q: undefined,
    });

    expect(where.categoryId).toEqual({ in: ['cat-1', 'cat-2'] });
  });

  it('combina valores del mismo atributo con OR (un solo "some" con "in")', () => {
    const where = buildProductWhere({
      categoryIds: [],
      attributeValueIdsByAttribute: { material: ['acero', 'aluminio'] },
      q: undefined,
    });

    expect(where.AND).toEqual([
      { attributeValues: { some: { attributeValueId: { in: ['acero', 'aluminio'] } } } },
    ]);
  });

  /**
   * El caso que CLAUDE.md marca como "el error clásico": aplanar todos los
   * valores en un solo `some` dejaría pasar una botella de aluminio de
   * 500 ml (cumple el grupo de material pero no el de capacidad). El `AND`
   * debe traer un `some` SEPARADO por atributo, no uno solo con todos los
   * ids juntos.
   */
  it('combina atributos distintos con AND (un "some" separado por atributo, no todo junto)', () => {
    const where = buildProductWhere({
      categoryIds: [],
      attributeValueIdsByAttribute: {
        material: ['acero-inoxidable', 'aluminio'],
        capacidad: ['750ml'],
      },
      q: undefined,
    });

    expect(where.AND).toEqual([
      { attributeValues: { some: { attributeValueId: { in: ['acero-inoxidable', 'aluminio'] } } } },
      { attributeValues: { some: { attributeValueId: { in: ['750ml'] } } } },
    ]);
    // Nunca debe existir un único `some` que junte los ids de los dos atributos.
    expect(where.AND).not.toContainEqual({
      attributeValues: {
        some: { attributeValueId: { in: ['acero-inoxidable', 'aluminio', '750ml'] } },
      },
    });
  });

  it('ignora atributos sin valores seleccionados (array vacío)', () => {
    const where = buildProductWhere({
      categoryIds: [],
      attributeValueIdsByAttribute: { material: [], capacidad: ['750ml'] },
      q: undefined,
    });

    expect(where.AND).toEqual([
      { attributeValues: { some: { attributeValueId: { in: ['750ml'] } } } },
    ]);
  });

  it('busca "q" en nombre, descripción y SKU, sin distinguir mayúsculas', () => {
    const where = buildProductWhere({
      categoryIds: [],
      attributeValueIdsByAttribute: {},
      q: 'botella',
    });

    expect(where.OR).toEqual([
      { name: { contains: 'botella', mode: 'insensitive' } },
      { description: { contains: 'botella', mode: 'insensitive' } },
      { sku: { contains: 'botella', mode: 'insensitive' } },
    ]);
  });

  it('combina categoría, atributos y búsqueda a la vez sin pisarse entre sí', () => {
    const where = buildProductWhere({
      categoryIds: ['botellas'],
      attributeValueIdsByAttribute: { material: ['acero'] },
      q: 'termica',
    });

    expect(where).toMatchObject({
      isActive: true,
      categoryId: { in: ['botellas'] },
      AND: [{ attributeValues: { some: { attributeValueId: { in: ['acero'] } } } }],
      OR: [
        { name: { contains: 'termica', mode: 'insensitive' } },
        { description: { contains: 'termica', mode: 'insensitive' } },
        { sku: { contains: 'termica', mode: 'insensitive' } },
      ],
    });
  });
});
