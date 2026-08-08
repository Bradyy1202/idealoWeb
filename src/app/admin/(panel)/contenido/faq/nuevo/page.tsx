import type { Metadata } from 'next';
import { FaqForm } from '../_components/faq-form';

export const metadata: Metadata = { title: 'Nueva pregunta | Panel' };

export default function NuevaFaqPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nueva pregunta</h1>
      <div className="mt-8 max-w-xl">
        <FaqForm />
      </div>
    </div>
  );
}
