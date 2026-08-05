import { PrismaClient, AttributeType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Definición declarativa del catálogo inicial.
// Nótese cómo "térmica", "deportiva" o "infantil" NO son subcategorías:
// son valores de atributos que se combinan libremente.
// ---------------------------------------------------------------------------

const attributes = [
  {
    name: 'Material',
    slug: 'material',
    type: AttributeType.TEXT,
    values: [
      'Acero inoxidable',
      'Aluminio',
      'Plástico tritán',
      'Cerámica',
      'Vidrio',
      'Algodón',
      'Poliéster',
    ],
  },
  {
    name: 'Capacidad',
    slug: 'capacidad',
    type: AttributeType.NUMBER,
    unit: 'ml',
    values: ['350', '500', '600', '750', '1000'],
  },
  {
    name: 'Uso',
    slug: 'uso',
    type: AttributeType.TEXT,
    values: ['Térmica', 'Deportiva', 'Infantil', 'Oficina', 'Regalo', 'Promocional'],
  },
  {
    name: 'Color',
    slug: 'color',
    type: AttributeType.COLOR,
    values: [
      { value: 'Blanco', hex: '#FFFFFF' },
      { value: 'Negro', hex: '#1A1A1A' },
      { value: 'Azul', hex: '#2563EB' },
      { value: 'Rojo', hex: '#DC2626' },
      { value: 'Rosado', hex: '#EC4899' },
      { value: 'Plateado', hex: '#C0C0C0' },
    ],
  },
  {
    name: 'Talla',
    slug: 'talla',
    type: AttributeType.TEXT,
    values: ['S', 'M', 'L', 'XL', 'XXL'],
  },
];

const categories = [
  {
    name: 'Botellas',
    slug: 'botellas',
    description: 'Botellas personalizables para el día a día, el gimnasio o la oficina.',
    attributes: ['material', 'capacidad', 'uso', 'color'],
  },
  {
    name: 'Tazas',
    slug: 'tazas',
    description: 'Tazas de cerámica, mágicas y de viaje listas para tu diseño.',
    attributes: ['material', 'capacidad', 'uso', 'color'],
  },
  {
    name: 'Textiles',
    slug: 'textiles',
    description: 'Camisetas, gorras y bolsos con impresión duradera.',
    attributes: ['material', 'talla', 'color', 'uso'],
    children: [
      { name: 'Camisetas', slug: 'camisetas' },
      { name: 'Gorras', slug: 'gorras' },
      { name: 'Bolsos', slug: 'bolsos' },
    ],
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Llaveros, agendas, mousepads y detalles personalizados.',
    attributes: ['material', 'color', 'uso'],
  },
];

const products = [
  {
    name: 'Botella térmica deportiva 750 ml',
    slug: 'botella-termica-deportiva-750ml',
    sku: 'BOT-TER-750',
    category: 'botellas',
    shortDescription: 'Acero inoxidable de doble pared, mantiene la temperatura 12 horas.',
    description:
      'Botella de acero inoxidable con aislamiento al vacío de doble pared. Tapa antiderrame con boquilla deportiva. La superficie recibe sublimación en 360°, ideal para logos completos o diseños envolventes.',
    basePrice: 9500,
    isFeatured: true,
    customizationNotes: 'Área imprimible completa (360°). Enviar diseño en 300 dpi.',
    attributes: {
      material: 'Acero inoxidable',
      capacidad: '750',
      uso: 'Deportiva',
      color: 'Negro',
    },
  },
  {
    name: 'Botella infantil 350 ml con pajilla',
    slug: 'botella-infantil-350ml',
    sku: 'BOT-INF-350',
    category: 'botellas',
    shortDescription: 'Libre de BPA, tapa con pajilla retráctil y asa.',
    description:
      'Botella pensada para escolares. Plástico tritán resistente a caídas, tapa con pajilla retráctil y asa de transporte. Muy solicitada para personalizar con el nombre del niño.',
    basePrice: 5500,
    isFeatured: true,
    customizationNotes: 'Área imprimible frontal de 15 x 8 cm.',
    attributes: {
      material: 'Plástico tritán',
      capacidad: '350',
      uso: 'Infantil',
      color: 'Azul',
    },
  },
  {
    name: 'Botella térmica de oficina 500 ml',
    slug: 'botella-termica-oficina-500ml',
    sku: 'BOT-OFI-500',
    category: 'botellas',
    shortDescription: 'Formato compacto de aluminio, cabe en cualquier portavasos.',
    basePrice: 7500,
    attributes: {
      material: 'Aluminio',
      capacidad: '500',
      uso: 'Oficina',
      color: 'Plateado',
    },
  },
  {
    name: 'Taza mágica 11 oz',
    slug: 'taza-magica-11oz',
    sku: 'TAZ-MAG-11',
    category: 'tazas',
    shortDescription: 'Revela el diseño al contacto con líquido caliente.',
    description:
      'Taza de cerámica con recubrimiento termosensible. En frío se ve negra y al servir una bebida caliente revela la fotografía o el diseño impreso. El regalo más pedido para cumpleaños y aniversarios.',
    basePrice: 6500,
    isFeatured: true,
    customizationNotes: 'Fotografías nítidas funcionan mejor. Evitar fondos muy oscuros.',
    attributes: {
      material: 'Cerámica',
      capacidad: '350',
      uso: 'Regalo',
      color: 'Negro',
    },
  },
  {
    name: 'Taza clásica blanca 11 oz',
    slug: 'taza-clasica-blanca-11oz',
    sku: 'TAZ-CLA-11',
    category: 'tazas',
    shortDescription: 'La opción más versátil y económica para cualquier diseño.',
    basePrice: 4500,
    minOrderQuantity: 1,
    attributes: {
      material: 'Cerámica',
      capacidad: '350',
      uso: 'Regalo',
      color: 'Blanco',
    },
  },
  {
    name: 'Camiseta poliéster unisex',
    slug: 'camiseta-poliester-unisex',
    sku: 'TEX-CAM-UNI',
    category: 'camisetas',
    shortDescription: 'Tela deportiva de secado rápido, ideal para sublimación full color.',
    description:
      'Camiseta 100% poliéster con acabado suave. La sublimación se integra a la fibra, por lo que el diseño no se agrieta ni se despega con el lavado. Disponible de S a XXL.',
    basePrice: 8500,
    isFeatured: true,
    customizationNotes: 'Solo disponible en base blanca o colores claros.',
    attributes: {
      material: 'Poliéster',
      talla: 'M',
      uso: 'Deportiva',
      color: 'Blanco',
    },
  },
  {
    name: 'Gorra deportiva personalizada',
    slug: 'gorra-deportiva-personalizada',
    sku: 'TEX-GOR-DEP',
    category: 'gorras',
    shortDescription: 'Panel frontal sublimable, cierre ajustable.',
    basePrice: 7000,
    attributes: {
      material: 'Poliéster',
      uso: 'Promocional',
      color: 'Negro',
    },
  },
  {
    name: 'Llavero acrílico personalizado',
    slug: 'llavero-acrilico-personalizado',
    sku: 'ACC-LLA-ACR',
    category: 'accesorios',
    shortDescription: 'Impresión a doble cara, formas variadas.',
    description:
      'Llavero de acrílico con impresión por ambos lados. Se ofrece en formato redondo, corazón, rectángulo y placa. Muy usado como recuerdo de eventos y detalles corporativos.',
    basePrice: 2500,
    minOrderQuantity: 5,
    customizationNotes: 'Pedido mínimo de 5 unidades.',
    attributes: {
      material: 'Plástico tritán',
      uso: 'Promocional',
      color: 'Blanco',
    },
  },
];

const faqs = [
  {
    question: '¿Cómo envío mi diseño?',
    answer:
      'Escribinos por WhatsApp desde el botón del producto y enviá tu imagen. Recomendamos archivos PNG o JPG en alta resolución (300 dpi). Si no tenés el diseño, te ayudamos a armarlo.',
    category: 'Personalización',
  },
  {
    question: '¿Cuánto tarda un pedido?',
    answer:
      'Entre 2 y 4 días hábiles para pedidos individuales. Para cantidades mayores a 20 unidades coordinamos una fecha al confirmar el pedido.',
    category: 'Pedidos',
  },
  {
    question: '¿Hay pedido mínimo?',
    answer:
      'La mayoría de productos se pueden pedir por unidad. Algunos artículos promocionales tienen mínimos indicados en su ficha.',
    category: 'Pedidos',
  },
  {
    question: '¿Los diseños se despintan con el lavado?',
    answer:
      'No. La sublimación integra la tinta a la fibra del material, así que no se agrieta ni se despega. En textiles recomendamos lavar del revés con agua fría.',
    category: 'Personalización',
  },
  {
    question: '¿Hacen envíos?',
    answer:
      'Sí, realizamos envíos a todo el país mediante servicio de encomiendas. El costo se coordina por WhatsApp según la zona.',
    category: 'Envíos',
  },
];

const testimonials = [
  {
    authorName: 'María Fernanda R.',
    authorLocation: 'Alajuela',
    content:
      'Pedí tazas mágicas para el cumpleaños de mi mamá y quedaron preciosas. La foto se ve nítida y me atendieron rapidísimo por WhatsApp.',
    rating: 5,
    isFeatured: true,
  },
  {
    authorName: 'Carlos M.',
    authorLocation: 'San Carlos',
    content:
      'Encargamos 30 botellas con el logo de la empresa. Excelente acabado y cumplieron con la fecha prometida.',
    rating: 5,
    isFeatured: true,
  },
  {
    authorName: 'Andrea S.',
    authorLocation: 'Heredia',
    content:
      'Las camisetas para el equipo quedaron perfectas y después de varios lavados siguen igual de vivas.',
    rating: 5,
  },
];

const settings = [
  {
    key: 'contact',
    group: 'contacto',
    value: {
      whatsapp: '50600000000',
      email: 'contacto@ejemplo.com',
      instagram: 'https://instagram.com/ejemplo',
      facebook: 'https://facebook.com/ejemplo',
      schedule: 'Lunes a viernes 8:00 a 17:00 · Sábados 9:00 a 13:00',
      location: 'Alajuela, Costa Rica',
    },
  },
  {
    key: 'hero',
    group: 'hero',
    value: {
      title: 'Convertimos tus ideas en productos únicos',
      subtitle:
        'Botellas, tazas, textiles y accesorios personalizados con sublimación de alta calidad.',
      primaryCta: 'Ver catálogo',
      secondaryCta: 'Cotizar por WhatsApp',
    },
  },
  {
    key: 'about',
    group: 'sobre-nosotros',
    value: {
      title: '¿Quiénes somos?',
      body: 'Somos un emprendimiento familiar dedicado a la sublimación. Empezamos personalizando tazas para amigos y hoy acompañamos a personas y empresas que quieren regalar algo con significado.',
    },
  },
];

// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('Sembrando base de datos...');

  // --- Usuario administrador -----------------------------------------------
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@ejemplo.com';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Cambiar123!';

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Administradora',
      passwordHash: await bcrypt.hash(password, 12),
      role: 'ADMIN',
    },
  });
  console.log(`  Admin: ${email}`);

  // --- Atributos y sus valores ---------------------------------------------
  const valueIds = new Map<string, string>(); // "material:acero-inoxidable" -> id
  const attributeIds = new Map<string, string>();

  for (const [i, attr] of attributes.entries()) {
    const created = await prisma.attribute.upsert({
      where: { slug: attr.slug },
      update: { name: attr.name, type: attr.type, unit: attr.unit, sortOrder: i },
      create: {
        name: attr.name,
        slug: attr.slug,
        type: attr.type,
        unit: attr.unit,
        sortOrder: i,
      },
    });
    attributeIds.set(attr.slug, created.id);

    for (const [j, raw] of attr.values.entries()) {
      const value = typeof raw === 'string' ? raw : raw.value;
      const hexColor = typeof raw === 'string' ? null : raw.hex;
      const slug = slugify(value);

      const av = await prisma.attributeValue.upsert({
        where: { attributeId_slug: { attributeId: created.id, slug } },
        update: { value, hexColor, sortOrder: j },
        create: { attributeId: created.id, value, slug, hexColor, sortOrder: j },
      });
      valueIds.set(`${attr.slug}:${slug}`, av.id);
    }
  }
  console.log(`  ${attributes.length} atributos con sus valores`);

  // --- Categorías y sus filtros --------------------------------------------
  const categoryIds = new Map<string, string>();

  for (const [i, cat] of categories.entries()) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: i },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: i,
      },
    });
    categoryIds.set(cat.slug, parent.id);

    for (const [k, attrSlug] of cat.attributes.entries()) {
      const attributeId = attributeIds.get(attrSlug)!;
      await prisma.categoryAttribute.upsert({
        where: { categoryId_attributeId: { categoryId: parent.id, attributeId } },
        update: { sortOrder: k },
        create: { categoryId: parent.id, attributeId, sortOrder: k },
      });
    }

    for (const [j, child] of (cat.children ?? []).entries()) {
      const created = await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, parentId: parent.id, sortOrder: j },
        create: { name: child.name, slug: child.slug, parentId: parent.id, sortOrder: j },
      });
      categoryIds.set(child.slug, created.id);

      // Las subcategorías heredan los filtros de su categoría madre
      for (const [k, attrSlug] of cat.attributes.entries()) {
        const attributeId = attributeIds.get(attrSlug)!;
        await prisma.categoryAttribute.upsert({
          where: { categoryId_attributeId: { categoryId: created.id, attributeId } },
          update: { sortOrder: k },
          create: { categoryId: created.id, attributeId, sortOrder: k },
        });
      }
    }
  }
  console.log(`  ${categoryIds.size} categorías`);

  // --- Productos ------------------------------------------------------------
  for (const [i, p] of products.entries()) {
    const categoryId = categoryIds.get(p.category);
    if (!categoryId) throw new Error(`Categoría no encontrada: ${p.category}`);

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        basePrice: p.basePrice,
        categoryId,
        isFeatured: p.isFeatured ?? false,
        sortOrder: i,
      },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        basePrice: p.basePrice,
        categoryId,
        isFeatured: p.isFeatured ?? false,
        minOrderQuantity: p.minOrderQuantity ?? 1,
        customizationNotes: p.customizationNotes,
        sortOrder: i,
      },
    });

    // Reemplaza las asociaciones para que el seed sea idempotente
    await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } });

    for (const [attrSlug, value] of Object.entries(p.attributes)) {
      const key = `${attrSlug}:${slugify(value as string)}`;
      const attributeValueId = valueIds.get(key);
      if (!attributeValueId) {
        console.warn(`  Valor de atributo no encontrado: ${key}`);
        continue;
      }
      await prisma.productAttributeValue.create({
        data: { productId: product.id, attributeValueId },
      });
    }
  }
  console.log(`  ${products.length} productos`);

  // --- Contenido editable ---------------------------------------------------
  await prisma.faqItem.deleteMany();
  await prisma.faqItem.createMany({
    data: faqs.map((f, i) => ({ ...f, sortOrder: i })),
  });

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: testimonials.map((t, i) => ({ ...t, sortOrder: i })),
  });

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }
  console.log(
    `  ${faqs.length} FAQ, ${testimonials.length} testimonios, ${settings.length} ajustes`,
  );

  console.log('Listo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
