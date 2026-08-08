import Link from 'next/link';
import type { Metadata } from 'next';
import { getAttributesForAdmin } from '@/modules/attributes/service';
import { Button } from '@/shared/ui/button';
import { DeleteAttributeButton } from './_components/delete-attribute-button';

export const metadata: Metadata = { title: 'Atributos | Panel' };

const typeLabels: Record<string, string> = {
  TEXT: 'Texto',
  COLOR: 'Color',
  NUMBER: 'Número',
  BOOLEAN: 'Sí/No',
};

export default async function AtributosPage() {
  const attributes = await getAttributesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atributos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Características transversales como material, capacidad o color.
          </p>
        </div>
        <Link href="/admin/atributos/nuevo">
          <Button className="rounded-full">Nuevo atributo</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {attributes.length === 0 ? (
          <p className="text-muted-foreground text-sm">Todavía no hay atributos.</p>
        ) : null}

        {attributes.map((attribute) => (
          <div key={attribute.id} className="border-border rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">
                  {attribute.name}
                  {attribute.unit ? (
                    <span className="text-muted-foreground font-normal"> ({attribute.unit})</span>
                  ) : null}
                </h2>
                <p className="text-muted-foreground text-xs">
                  {typeLabels[attribute.type]} ·{' '}
                  {attribute.isFilterable ? 'Filtrable' : 'No filtrable'} · usado en{' '}
                  {attribute.categoryCount}{' '}
                  {attribute.categoryCount === 1 ? 'categoría' : 'categorías'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/admin/atributos/${attribute.id}/editar`}
                  className="text-sm font-medium underline-offset-2 hover:underline"
                >
                  Editar
                </Link>
                <DeleteAttributeButton attributeId={attribute.id} attributeName={attribute.name} />
              </div>
            </div>

            {attribute.values.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {attribute.values.map((value) => (
                  <span
                    key={value.id}
                    className="border-border inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs"
                  >
                    {value.hexColor ? (
                      <span
                        aria-hidden
                        className="border-border inline-block h-2.5 w-2.5 rounded-full border"
                        style={{ backgroundColor: value.hexColor }}
                      />
                    ) : null}
                    {value.value}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-3 text-xs">Sin valores todavía.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
