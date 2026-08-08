import Link from 'next/link';
import type { Metadata } from 'next';
import { getFaqsForAdmin } from '@/modules/content/service';
import { Button } from '@/shared/ui/button';
import { DeleteFaqButton } from './_components/delete-faq-button';

export const metadata: Metadata = { title: 'Preguntas frecuentes | Panel' };

export default async function FaqPage() {
  const faqs = await getFaqsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Preguntas frecuentes</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Se muestran en la portada, en el orden elegido.
          </p>
        </div>
        <Link href="/admin/contenido/faq/nuevo">
          <Button className="rounded-full">Nueva pregunta</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {faqs.length === 0 ? (
          <p className="text-muted-foreground text-sm">Todavía no hay preguntas frecuentes.</p>
        ) : null}

        {faqs.map((faq) => (
          <div key={faq.id} className="border-border rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold">{faq.question}</h2>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{faq.answer}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {faq.category ?? 'Sin categoría'} · {faq.isActive ? 'Activa' : 'Inactiva'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/admin/contenido/faq/${faq.id}/editar`}
                  className="text-sm font-medium underline-offset-2 hover:underline"
                >
                  Editar
                </Link>
                <DeleteFaqButton faqId={faq.id} question={faq.question} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
