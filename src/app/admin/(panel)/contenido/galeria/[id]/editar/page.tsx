import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getGalleryItemForEdit } from '@/modules/content/service';
import { getAdminProducts } from '@/modules/products/service';
import { GalleryItemForm } from '../../_components/gallery-item-form';

type EditarFotoGaleriaPageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Editar foto | Panel' };

export default async function EditarFotoGaleriaPage({ params }: EditarFotoGaleriaPageProps) {
  const { id } = await params;
  const [item, { items: products }] = await Promise.all([
    getGalleryItemForEdit(id),
    getAdminProducts({ take: 60 }),
  ]);

  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Editar foto</h1>
      <div className="mt-8 max-w-xl">
        <GalleryItemForm products={products} initialValues={item} />
      </div>
    </div>
  );
}
