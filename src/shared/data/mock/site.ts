// ---------------------------------------------------------------------------
// Datos de la fase 1. Los tipos coinciden con lo que devolverá `SiteSetting`
// y `Product` cuando la fase 2 conecte la base, así que migrar solo toca la
// capa de obtención y no los componentes.
//
// Los valores replican `prisma/seed.ts`. Si cambiás uno, cambiá el otro.
// ---------------------------------------------------------------------------

export type HeroSettings = {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
};

export type AboutSettings = {
  title: string;
  body: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

export type Testimonial = {
  authorName: string;
  authorLocation: string;
  content: string;
  rating: number;
};

export type GalleryItem = {
  title: string;
  colorway: Colorway;
};

export type ContactSettings = {
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  schedule: string;
  location: string;
};

/** Los cuatro kits del catálogo. Define el campo de color de cada categoría. */
export type Colorway = 'botellas' | 'tazas' | 'textiles' | 'accesorios';

export type ShowcaseProduct = {
  name: string;
  slug: string;
  sku: string;
  colorway: Colorway;
  categoryName: string;
  /** Especificaciones de la placa. Material primero, luego la medida. */
  specs: string[];
  /** Proporción real del objeto. Una taza no es una botella. */
  aspect: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
};

/** Una tarjeta de catálogo. `basePrice` es referencial: "desde ₡X". */
export type Product = {
  name: string;
  slug: string;
  sku: string;
  colorway: Colorway;
  categoryName: string;
  shortDescription: string;
  basePrice: number;
  aspect: string;
  imageAlt: string;
};

export const hero: HeroSettings = {
  title: 'Personalizamos cada detalle para hacerlo único.',
  subtitle:
    'Botellas, tazas, textiles y accesorios para regalos y empresas. Envíos a todo Costa Rica.',
  primaryCta: 'Explorar catálogo',
  secondaryCta: 'Solicitar cotización',
};

export const contact: ContactSettings = {
  whatsapp: '50685097011',
  email: 'bradycmc1@gmail.com',
  instagram: 'https://instagram.com/ejemplo',
  facebook: 'https://facebook.com/ejemplo',
  schedule: 'Lunes a viernes 8:00 a 20:00 · Sábados 9:00 a 17:00',
  location: 'San Carlos, Costa Rica',
};

/**
 * Una pieza por categoría. El hero las presenta en su propio campo de color,
 * así el visitante ve de entrada que el catálogo cubre cuatro familias y no
 * un solo producto. Todas salen del seed.
 *
 * El orden define el de la tira de categorías.
 */
export const showcase: [ShowcaseProduct, ...ShowcaseProduct[]] = [
  {
    name: 'Botella térmica deportiva',
    slug: 'botella-termica-deportiva-750ml',
    sku: 'BOT-TER-750',
    colorway: 'botellas',
    categoryName: 'Botellas',
    specs: ['Acero inoxidable', '750 ml'],
    aspect: '3 / 5',
    imageAlt: 'Botella térmica deportiva de acero inoxidable, lista para sublimar',
    imageWidth: 1200,
    imageHeight: 2000,
  },
  {
    name: 'Taza mágica 11 oz',
    slug: 'taza-magica-11oz',
    sku: 'TAZ-MAG-11',
    colorway: 'tazas',
    categoryName: 'Tazas',
    specs: ['Cerámica', '350 ml'],
    aspect: '5 / 4',
    imageAlt: 'Taza mágica de cerámica que revela el diseño con el calor',
    imageWidth: 2000,
    imageHeight: 1600,
  },
  {
    name: 'Camiseta poliéster unisex',
    slug: 'camiseta-poliester-unisex',
    sku: 'TEX-CAM-UNI',
    colorway: 'textiles',
    categoryName: 'Textiles',
    specs: ['Poliéster', 'Tallas S a XXL'],
    aspect: '1 / 1',
    imageAlt: 'Camiseta de poliéster blanca lista para sublimación a todo color',
    imageWidth: 1600,
    imageHeight: 1600,
  },
  {
    name: 'Llavero acrílico personalizado',
    slug: 'llavero-acrilico-personalizado',
    sku: 'ACC-LLA-ACR',
    colorway: 'accesorios',
    categoryName: 'Accesorios',
    specs: ['Acrílico', 'Mínimo 5 unidades'],
    aspect: '1 / 1',
    imageAlt: 'Llavero de acrílico con impresión a doble cara',
    imageWidth: 1600,
    imageHeight: 1600,
  },
];

export type Category = {
  name: string;
  slug: string;
  description: string;
  /** Hechos reales de `prisma/seed.ts` (valores de atributo), no inventados. */
  facts: [string, string];
};

/** Las cuatro categorías del catálogo. Descripciones tal como están en `prisma/seed.ts`. */
export const categories: [Category, Category, Category, Category] = [
  {
    name: 'Botellas',
    slug: 'botellas',
    description: 'Botellas personalizables para el día a día, el gimnasio o la oficina.',
    facts: ['Acero inoxidable o aluminio', '350 a 1000 ml'],
  },
  {
    name: 'Tazas',
    slug: 'tazas',
    description: 'Tazas de cerámica, mágicas y de viaje listas para tu diseño.',
    facts: ['Cerámica y vidrio', 'Mágicas o clásicas'],
  },
  {
    name: 'Textiles',
    slug: 'textiles',
    description: 'Camisetas, gorras y bolsos con impresión duradera.',
    facts: ['Poliéster y algodón', 'Tallas S a XXL'],
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Llaveros, agendas, mousepads y detalles personalizados.',
    facts: ['Acrílico y plástico', 'Ideal para eventos'],
  },
];

export const about: AboutSettings = {
  title: 'Creamos productos que dejan huella.',
  body: 'Somos una marca costarricense especializada en productos personalizados mediante sublimación. Combinamos creatividad, materiales de calidad y atención personalizada para transformar tus ideas en piezas únicas que destacan por su diseño, durabilidad y significado.',
};

/**
 * El proceso real, derivado de las respuestas del FAQ (no inventado):
 * cómo se envía el diseño, cuánto tarda producción y que hay envíos a
 * todo el país.
 */
export const howItWorks: [ProcessStep, ProcessStep, ProcessStep, ProcessStep] = [
  {
    number: '01',
    title: 'Elegís tu producto',
    description: 'Recorré el catálogo y elegí la pieza, el color y la cantidad que necesitás.',
  },
  {
    number: '02',
    title: 'Enviás tu diseño',
    description: 'Por WhatsApp, en PNG o JPG a 300 dpi. Si no tenés el diseño, te ayudamos.',
  },
  {
    number: '03',
    title: 'Confirmamos y producimos',
    description: 'Entre 2 y 4 días hábiles. Pedidos grandes coordinan fecha al confirmar.',
  },
  {
    number: '04',
    title: 'Recibís tu pedido',
    description: 'Envíos a todo Costa Rica por encomienda. El costo se coordina por zona.',
  },
];

/** Los cuatro productos marcados `isFeatured` en el seed. */
export const featuredProducts: [Product, Product, Product, Product] = [
  {
    name: 'Botella térmica deportiva 750 ml',
    slug: 'botella-termica-deportiva-750ml',
    sku: 'BOT-TER-750',
    colorway: 'botellas',
    categoryName: 'Botellas',
    shortDescription: 'Acero inoxidable de doble pared, mantiene la temperatura 12 horas.',
    basePrice: 9500,
    aspect: '3 / 5',
    imageAlt: 'Botella térmica deportiva de acero inoxidable',
  },
  {
    name: 'Botella infantil 350 ml con pajilla',
    slug: 'botella-infantil-350ml',
    sku: 'BOT-INF-350',
    colorway: 'botellas',
    categoryName: 'Botellas',
    shortDescription: 'Libre de BPA, tapa con pajilla retráctil y asa.',
    basePrice: 5500,
    aspect: '3 / 5',
    imageAlt: 'Botella infantil con pajilla retráctil',
  },
  {
    name: 'Taza mágica 11 oz',
    slug: 'taza-magica-11oz',
    sku: 'TAZ-MAG-11',
    colorway: 'tazas',
    categoryName: 'Tazas',
    shortDescription: 'Revela el diseño al contacto con líquido caliente.',
    basePrice: 6500,
    aspect: '5 / 4',
    imageAlt: 'Taza mágica de cerámica termosensible',
  },
  {
    name: 'Camiseta poliéster unisex',
    slug: 'camiseta-poliester-unisex',
    sku: 'TEX-CAM-UNI',
    colorway: 'textiles',
    categoryName: 'Textiles',
    shortDescription: 'Tela deportiva de secado rápido, ideal para sublimación full color.',
    basePrice: 8500,
    aspect: '1 / 1',
    imageAlt: 'Camiseta de poliéster blanca para sublimación',
  },
];

export const faqs: [FaqItem, ...FaqItem[]] = [
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

export const testimonials: [Testimonial, Testimonial, Testimonial] = [
  {
    authorName: 'María Fernanda R.',
    authorLocation: 'Alajuela',
    content:
      'Pedí tazas mágicas para el cumpleaños de mi mamá y quedaron preciosas. La foto se ve nítida y me atendieron rapidísimo por WhatsApp.',
    rating: 5,
  },
  {
    authorName: 'Carlos M.',
    authorLocation: 'San Carlos',
    content:
      'Encargamos 30 botellas con el logo de la empresa. Excelente acabado y cumplieron con la fecha prometida.',
    rating: 5,
  },
  {
    authorName: 'Andrea S.',
    authorLocation: 'Heredia',
    content:
      'Las camisetas para el equipo quedaron perfectas y después de varios lavados siguen igual de vivas.',
    rating: 5,
  },
];

/**
 * Sin fotos reales de trabajos entregados todavía (`GalleryItem` no tiene
 * seed). En vez de inventar imágenes, la sección reserva el ritmo de grilla
 * con el mismo patrón de ranura del hero, listo para recibir contenido real.
 */
export const galleryItems: GalleryItem[] = [
  { title: 'Botellas para evento corporativo', colorway: 'botellas' },
  { title: 'Tazas para regalo de cumpleaños', colorway: 'tazas' },
  { title: 'Camisetas de equipo', colorway: 'textiles' },
  { title: 'Llaveros para boda', colorway: 'accesorios' },
  { title: 'Botellas deportivas personalizadas', colorway: 'botellas' },
  { title: 'Tazas corporativas con logo', colorway: 'tazas' },
];
