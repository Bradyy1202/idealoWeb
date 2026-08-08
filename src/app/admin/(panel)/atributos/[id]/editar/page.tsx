import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAttributeForEdit } from '@/modules/attributes/service';
import { AttributeForm } from '../../_components/attribute-form';
import { AttributeValuesManager } from '../../_components/attribute-values-manager';

type EditarAtributoPageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Editar atributo | Panel' };

export default async function EditarAtributoPage({ params }: EditarAtributoPageProps) {
  const { id } = await params;
  const attribute = await getAttributeForEdit(id);

  // Sin loading.tsx en ningún ancestro de /admin: mismo motivo que en el
  // resto del panel y del sitio público.
  if (!attribute) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Editar atributo</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <AttributeForm initialValues={attribute} />
        <AttributeValuesManager
          attributeId={attribute.id}
          values={attribute.values}
          isColor={attribute.type === 'COLOR'}
        />
      </div>
    </div>
  );
}
