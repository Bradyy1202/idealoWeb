import type { Metadata } from 'next';
import { getCategoriesForAdmin } from '@/modules/categories/service';
import { getAttributesForAdmin } from '@/modules/attributes/service';
import { CategoryForm } from '../_components/category-form';

export const metadata: Metadata = { title: 'Nueva categoría | Panel' };

export default async function NuevaCategoriaPage() {
  const [categories, attributes] = await Promise.all([
    getCategoriesForAdmin(),
    getAttributesForAdmin(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nueva categoría</h1>
      <div className="mt-8 max-w-2xl">
        <CategoryForm categories={categories} attributes={attributes} />
      </div>
    </div>
  );
}
