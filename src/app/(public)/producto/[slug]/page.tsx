import { cache, Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContactSettings } from '@/modules/content/service';
import { formatPrice } from '@/shared/lib/format-price';
import { buildProductInquiryMessage, buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { SITE_URL } from '@/shared/lib/site-url';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { productSlugSchema } from '@/modules/products/schema';
import {
  getProductBySlug,
  getRelatedProducts,
  type ProductGalleryImage,
  type ProductSpec,
} from '@/modules/products/service';
import { ProductGrid } from '@/modules/products/components/product-grid';
import { ProductGridSkeleton } from '@/modules/products/components/product-grid-skeleton';
import { WhatsappInquiryLink } from '@/modules/inquiries/components/whatsapp-inquiry-link';
import { AddToQuoteListButton } from '@/modules/quote-list/components/add-to-quote-list-button';

type ProductoPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * `cache()` deduplica dentro de un mismo request: sin esto, generateMetadata
 * y la página consultarían la base por separado (Prisma no pasa por el
 * fetch cache de Next, que solo deduplica llamadas a `fetch`).
 * safeParse antes de tocar la base: un slug con formato inválido en la URL
 * cae a "no encontrado" en vez de un error 500.
 */
const getProduct = cache(async (slug: string) => {
  const parsed = productSlugSchema.safeParse(slug);
  if (!parsed.success) return null;
  return getProductBySlug(parsed.data);
});

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} | Idealo`,
    description: product.shortDescription ?? undefined,
  };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // No agregar loading.tsx a esta ruta (ni a producto/ ni a un ancestro):
  // Next.js empieza a streamear el shell con status 200 en cuanto existe un
  // boundary de Suspense a nivel de archivo, y ya no puede corregirlo a 404
  // cuando notFound() resuelve después. Sin loading.tsx el response se
  // retiene hasta saber si es 200 o 404 (verificado con curl contra el
  // build de producción). El Suspense de "también te puede interesar" más
  // abajo es de componente y se resuelve después de este chequeo: no tiene
  // ese problema, porque el contenido principal ya se decidió por completo.
  if (!product) notFound();

  const contact = await getContactSettings();
  const whatsappHref = buildWhatsAppUrl(
    contact.whatsapp,
    buildProductInquiryMessage({
      name: product.name,
      sku: product.sku,
      url: `${SITE_URL}/producto/${product.slug}`,
    }),
  );

  return (
    <Container className="py-16 md:py-24">
      <Link href="/catalogo" className="text-muted-foreground hover:text-foreground text-sm">
        ← Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-6">
          <div>
            <Badge>{product.category.name}</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
            {product.shortDescription ? (
              <p className="text-muted-foreground mt-2 text-lg">{product.shortDescription}</p>
            ) : null}
          </div>

          <p className="text-2xl font-semibold">
            {product.basePrice === null
              ? 'Precio a cotizar'
              : `${product.priceIsFrom ? 'Desde ' : ''}${formatPrice(product.basePrice)}`}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsappInquiryLink
              href={whatsappHref}
              source="WHATSAPP_PRODUCT"
              productId={product.id}
              productSnapshot={product.name}
            >
              <Button variant="whatsapp" size="lg" className="w-full rounded-full sm:w-auto">
                Cotizar por WhatsApp
              </Button>
            </WhatsappInquiryLink>

            <AddToQuoteListButton
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                sku: product.sku,
                basePrice: product.basePrice,
                priceIsFrom: product.priceIsFrom,
                imageUrl: product.images[0]?.url ?? null,
              }}
            />
          </div>

          {product.description ? (
            <p className="text-muted-foreground border-border border-t pt-6 text-sm whitespace-pre-line">
              {product.description}
            </p>
          ) : null}

          <ProductSpecs specs={product.specs} />

          {product.customizationNotes || product.minOrderQuantity > 1 ? (
            <div className="bg-secondary/40 rounded-2xl p-4 text-sm">
              <p className="font-semibold">Notas de personalización</p>
              {product.customizationNotes ? (
                <p className="text-muted-foreground mt-1">{product.customizationNotes}</p>
              ) : null}
              {product.minOrderQuantity > 1 ? (
                <p className="text-muted-foreground mt-1">
                  Pedido mínimo: {product.minOrderQuantity} unidades.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="border-border mt-16 border-t pt-16">
            <ProductGridSkeleton count={4} />
          </div>
        }
      >
        <RelatedProducts productId={product.id} categoryId={product.category.id} />
      </Suspense>
    </Container>
  );
}

async function RelatedProducts({
  productId,
  categoryId,
}: {
  productId: string;
  categoryId: string;
}) {
  const relatedProducts = await getRelatedProducts(productId, categoryId);
  if (relatedProducts.length === 0) return null;

  return (
    <div className="border-border mt-16 border-t pt-16">
      <h2 className="text-2xl font-bold tracking-tight">También te puede interesar</h2>
      <div className="mt-8">
        <ProductGrid items={relatedProducts} />
      </div>
    </div>
  );
}

function ProductGallery({
  images,
  productName,
}: {
  images: ProductGalleryImage[];
  productName: string;
}) {
  const [primary, ...rest] = images;

  if (!primary) {
    return (
      <div className="bg-muted border-border text-muted-foreground flex aspect-square items-center justify-center rounded-2xl border border-dashed">
        <span className="text-xs tracking-[0.16em] uppercase">Foto próximamente</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={primary.url}
          alt={primary.alt ?? productName}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {rest.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {rest.map((image) => (
            <div
              key={image.id}
              className="bg-muted relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={image.url}
                alt={image.alt ?? productName}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProductSpecs({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
      {specs.map((spec) => (
        <div key={spec.attributeSlug} className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">{spec.attributeName}</dt>
          <dd className="flex items-center gap-2 font-medium">
            {spec.hexColor ? (
              <span
                aria-hidden
                className="border-border inline-block h-3 w-3 rounded-full border"
                style={{ backgroundColor: spec.hexColor }}
              />
            ) : null}
            {spec.value}
            {spec.unit ? ` ${spec.unit}` : ''}
          </dd>
        </div>
      ))}
    </dl>
  );
}
