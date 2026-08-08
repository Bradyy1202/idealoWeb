import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFaqForEdit } from '@/modules/content/service';
import { FaqForm } from '../../_components/faq-form';

type EditarFaqPageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Editar pregunta | Panel' };

export default async function EditarFaqPage({ params }: EditarFaqPageProps) {
  const { id } = await params;
  const faq = await getFaqForEdit(id);

  if (!faq) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Editar pregunta</h1>
      <div className="mt-8 max-w-xl">
        <FaqForm initialValues={faq} />
      </div>
    </div>
  );
}
