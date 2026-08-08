import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoriesForAdmin } from '@/modules/categories/service';
import { getProductForEdit } from '@/modules/products/service';
import { ProductForm } from '../../_components/product-form';
import { ProductImageManager } from '../../_components/product-image-manager';

type EditarProductoPageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Editar producto | Panel' };

export default async function EditarProductoPage({ params }: EditarProductoPageProps) {
  const { id } = await params;
  const [categories, product] = await Promise.all([getCategoriesForAdmin(), getProductForEdit(id)]);

  // Sin loading.tsx en ningún ancestro de /admin: mismo motivo que en el
  // sitio público, notFound() necesita resolver antes de que Next empiece a
  // streamear la respuesta para que el status 404 sea real.
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Editar producto</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ProductForm categories={categories} initialValues={product} />
        <ProductImageManager productId={product.id} images={product.images} />
      </div>
    </div>
  );
}
