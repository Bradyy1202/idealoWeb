import Link from 'next/link';
import type { Metadata } from 'next';
import { getProductCounts } from '@/modules/products/service';
import { getCategoryCount } from '@/modules/categories/service';
import { getNewInquiryCount, getRecentInquiries } from '@/modules/inquiries/service';

export const metadata: Metadata = {
  title: 'Panel | Idealo',
};

const sourceLabels: Record<string, string> = {
  WHATSAPP_PRODUCT: 'WhatsApp (producto)',
  WHATSAPP_FLOAT: 'WhatsApp (flotante)',
  QUOTE_LIST: 'Lista de cotización',
  CONTACT_FORM: 'Formulario de contacto',
};

const statusLabels: Record<string, string> = {
  NEW: 'Nueva',
  CONTACTED: 'Contactada',
  QUOTED: 'Cotizada',
  WON: 'Ganada',
  LOST: 'Perdida',
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export default async function DashboardPage() {
  const [productCounts, categoryCount, newInquiryCount, recentInquiries] = await Promise.all([
    getProductCounts(),
    getCategoryCount(),
    getNewInquiryCount(),
    getRecentInquiries(5),
  ]);

  const stats = [
    { label: 'Productos activos', value: productCounts.active },
    { label: 'Productos totales', value: productCounts.total },
    { label: 'Categorías', value: categoryCount },
    { label: 'Consultas nuevas', value: newInquiryCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Panel</h1>
      <p className="text-muted-foreground mt-1 text-sm">Resumen general del catálogo.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-border rounded-2xl border p-5">
            <p data-numeral className="text-3xl font-bold">
              {stat.value}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Últimas consultas</h2>
          <Link
            href="/admin/consultas"
            className="text-primary text-sm font-medium hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <p className="text-muted-foreground mt-4 text-sm">
            Todavía no hay consultas registradas.
          </p>
        ) : (
          <ul className="border-border divide-border mt-4 divide-y rounded-2xl border">
            {recentInquiries.map((inquiry) => (
              <li key={inquiry.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {inquiry.customerName ?? inquiry.itemsSummary ?? sourceLabels[inquiry.source]}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {sourceLabels[inquiry.source]} · {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <span className="bg-secondary shrink-0 rounded-full px-3 py-1 text-xs font-medium">
                  {statusLabels[inquiry.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
