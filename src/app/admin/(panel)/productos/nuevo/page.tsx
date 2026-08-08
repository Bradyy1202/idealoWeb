import type { Metadata } from 'next';
import { getCategoriesForAdmin } from '@/modules/categories/service';
import { ProductForm } from '../_components/product-form';

export const metadata: Metadata = { title: 'Nuevo producto | Panel' };

export default async function NuevoProductoPage() {
  const categories = await getCategoriesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nuevo producto</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Guardá primero los datos: las fotos se suben después, editando el producto.
      </p>
      <div className="mt-8 max-w-3xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
