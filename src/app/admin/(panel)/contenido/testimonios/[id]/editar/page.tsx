import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTestimonialForEdit } from '@/modules/content/service';
import { TestimonialForm } from '../../_components/testimonial-form';

type EditarTestimonioPageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Editar testimonio | Panel' };

export default async function EditarTestimonioPage({ params }: EditarTestimonioPageProps) {
  const { id } = await params;
  const testimonial = await getTestimonialForEdit(id);

  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Editar testimonio</h1>
      <div className="mt-8 max-w-xl">
        <TestimonialForm initialValues={testimonial} />
      </div>
    </div>
  );
}
