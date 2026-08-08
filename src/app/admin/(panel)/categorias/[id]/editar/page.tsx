import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoriesForAdmin, getCategoryForEdit } from '@/modules/categories/service';
import { getAttributesForAdmin } from '@/modules/attributes/service';
import { CategoryForm } from '../../_components/category-form';

type EditarCategoriaPageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Editar categoría | Panel' };

export default async function EditarCategoriaPage({ params }: EditarCategoriaPageProps) {
  const { id } = await params;
  const [categories, attributes, category] = await Promise.all([
    getCategoriesForAdmin(),
    getAttributesForAdmin(),
    getCategoryForEdit(id),
  ]);

  // Sin loading.tsx en ningún ancestro de /admin: mismo motivo que en el
  // resto del panel y del sitio público.
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Editar categoría</h1>
      <div className="mt-8 max-w-2xl">
        <CategoryForm categories={categories} attributes={attributes} initialValues={category} />
      </div>
    </div>
  );
}
