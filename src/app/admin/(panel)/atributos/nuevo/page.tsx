import type { Metadata } from 'next';
import { AttributeForm } from '../_components/attribute-form';

export const metadata: Metadata = { title: 'Nuevo atributo | Panel' };

export default function NuevoAtributoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nuevo atributo</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Los valores se agregan después de crearlo.
      </p>
      <div className="mt-8 max-w-xl">
        <AttributeForm />
      </div>
    </div>
  );
}
