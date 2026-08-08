import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getInquiryForAdmin, inquirySourceLabels } from '@/modules/inquiries/service';
import { InquiryStatusSelect } from '../_components/inquiry-status-select';
import { InquiryNotesForm } from '../_components/inquiry-notes-form';

export const metadata: Metadata = { title: 'Consulta | Panel' };

type ConsultaPageProps = { params: Promise<{ id: string }> };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'long', timeStyle: 'short' }).format(date);
}

export default async function ConsultaPage({ params }: ConsultaPageProps) {
  const { id } = await params;
  const inquiry = await getInquiryForAdmin(id);

  if (!inquiry) notFound();

  return (
    <div>
      <Link href="/admin/consultas" className="text-muted-foreground hover:text-foreground text-sm">
        ← Volver a consultas
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {inquiry.customerName ?? inquirySourceLabels[inquiry.source]}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {inquirySourceLabels[inquiry.source]} · Recibida el {formatDate(inquiry.createdAt)}
            {inquiry.contactedAt ? ` · Contactada el ${formatDate(inquiry.contactedAt)}` : ''}
          </p>
        </div>
        <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          {inquiry.message ? (
            <div className="border-border rounded-2xl border p-5">
              <h2 className="text-sm font-semibold">Mensaje</h2>
              <p className="text-muted-foreground mt-2 text-sm whitespace-pre-line">
                {inquiry.message}
              </p>
            </div>
          ) : null}

          {inquiry.items.length > 0 ? (
            <div className="border-border rounded-2xl border p-5">
              <h2 className="text-sm font-semibold">Productos</h2>
              <ul className="mt-3 flex flex-col gap-3">
                {inquiry.items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">
                        {item.quantity}x {item.productSnapshot}
                      </p>
                      {item.notes ? (
                        <p className="text-muted-foreground mt-0.5 text-xs">{item.notes}</p>
                      ) : null}
                    </div>
                    {item.productId ? (
                      <Link
                        href={`/admin/productos/${item.productId}/editar`}
                        className="text-primary shrink-0 text-xs font-medium hover:underline"
                      >
                        Ver producto
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="border-border rounded-2xl border p-5">
            <h2 className="text-sm font-semibold">Notas internas</h2>
            <p className="text-muted-foreground mt-1 text-xs">No las ve la clienta.</p>
            <div className="mt-3">
              <InquiryNotesForm inquiryId={inquiry.id} initialNotes={inquiry.adminNotes ?? ''} />
            </div>
          </div>
        </div>

        <div className="border-border h-fit rounded-2xl border p-5">
          <h2 className="text-sm font-semibold">Datos de contacto</h2>
          <dl className="mt-3 flex flex-col gap-2 text-sm">
            {inquiry.customerName ? (
              <div>
                <dt className="text-muted-foreground text-xs">Nombre</dt>
                <dd>{inquiry.customerName}</dd>
              </div>
            ) : null}
            {inquiry.customerEmail ? (
              <div>
                <dt className="text-muted-foreground text-xs">Correo</dt>
                <dd>
                  <a href={`mailto:${inquiry.customerEmail}`} className="hover:underline">
                    {inquiry.customerEmail}
                  </a>
                </dd>
              </div>
            ) : null}
            {inquiry.customerPhone ? (
              <div>
                <dt className="text-muted-foreground text-xs">Teléfono</dt>
                <dd>{inquiry.customerPhone}</dd>
              </div>
            ) : null}
            {!inquiry.customerName && !inquiry.customerEmail && !inquiry.customerPhone ? (
              <p className="text-muted-foreground text-sm">Sin datos de contacto.</p>
            ) : null}
          </dl>
        </div>
      </div>
    </div>
  );
}
