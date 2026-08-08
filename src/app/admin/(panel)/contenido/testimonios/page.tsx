import Link from 'next/link';
import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { getTestimonialsForAdmin } from '@/modules/content/service';
import { Button } from '@/shared/ui/button';
import { DeleteTestimonialButton } from './_components/delete-testimonial-button';

export const metadata: Metadata = { title: 'Testimonios | Panel' };

export default async function TestimoniosPage() {
  const testimonials = await getTestimonialsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimonios</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Se muestran en la portada, en el orden elegido.
          </p>
        </div>
        <Link href="/admin/contenido/testimonios/nuevo">
          <Button className="rounded-full">Nuevo testimonio</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {testimonials.length === 0 ? (
          <p className="text-muted-foreground text-sm">Todavía no hay testimonios.</p>
        ) : null}

        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border-border rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold">
                  {testimonial.authorName}
                  {testimonial.authorLocation ? (
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      · {testimonial.authorLocation}
                    </span>
                  ) : null}
                </h2>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {testimonial.content}
                </p>
                <p className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                  {testimonial.rating ? (
                    <span className="flex items-center gap-0.5">
                      {testimonial.rating}
                      <Star className="fill-primary text-primary h-3 w-3" strokeWidth={0} />
                    </span>
                  ) : null}
                  {testimonial.rating ? '·' : null} {testimonial.isActive ? 'Activo' : 'Inactivo'}
                  {testimonial.isFeatured ? ' · Destacado' : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/admin/contenido/testimonios/${testimonial.id}/editar`}
                  className="text-sm font-medium underline-offset-2 hover:underline"
                >
                  Editar
                </Link>
                <DeleteTestimonialButton
                  testimonialId={testimonial.id}
                  authorName={testimonial.authorName}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
