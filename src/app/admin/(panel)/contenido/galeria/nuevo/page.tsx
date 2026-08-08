import type { Metadata } from 'next';
import { getAdminProducts } from '@/modules/products/service';
import { GalleryItemForm } from '../_components/gallery-item-form';

export const metadata: Metadata = { title: 'Nueva foto | Panel' };

export default async function NuevaFotoGaleriaPage() {
  const { items: products } = await getAdminProducts({ take: 60 });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nueva foto</h1>
      <div className="mt-8 max-w-xl">
        <GalleryItemForm products={products} />
      </div>
    </div>
  );
}
