import { getContactSettings } from '@/modules/content/service';
import { QuoteListView } from './_components/quote-list-view';

export default async function ListaDeCotizacionPage() {
  const contact = await getContactSettings();
  return <QuoteListView whatsapp={contact.whatsapp} />;
}
