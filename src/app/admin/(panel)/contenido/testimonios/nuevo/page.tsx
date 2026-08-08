import type { Metadata } from 'next';
import { TestimonialForm } from '../_components/testimonial-form';

export const metadata: Metadata = { title: 'Nuevo testimonio | Panel' };

export default function NuevoTestimonioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nuevo testimonio</h1>
      <div className="mt-8 max-w-xl">
        <TestimonialForm />
      </div>
    </div>
  );
}
