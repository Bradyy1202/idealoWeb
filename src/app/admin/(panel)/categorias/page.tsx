import Link from 'next/link';
import type { Metadata } from 'next';
import { getCategoriesForAdmin } from '@/modules/categories/service';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';
import { DeleteCategoryButton } from './_components/delete-category-button';

export const metadata: Metadata = { title: 'Categorías | Panel' };

export default async function CategoriasPage() {
  const categories = await getCategoriesForAdmin();
  const rootCategories = categories.filter((category) => category.parentId === null);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Árbol de máximo dos niveles: qué es el producto, no cómo es.
          </p>
        </div>
        <Link href="/admin/categorias/nueva">
          <Button className="rounded-full">Nueva categoría</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {rootCategories.length === 0 ? (
          <p className="text-muted-foreground text-sm">Todavía no hay categorías.</p>
        ) : null}

        {rootCategories.map((category) => {
          const children = categories.filter((child) => child.parentId === category.id);

          return (
            <div key={category.id} className="border-border rounded-2xl border p-5">
              <CategoryRow category={category} />

              {children.length > 0 ? (
                <div className="border-border mt-3 ml-4 flex flex-col gap-3 border-l pl-4">
                  {children.map((child) => (
                    <CategoryRow key={child.id} category={child} />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryRow({
  category,
}: {
  category: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    productCount: number;
    childCount: number;
    filterableAttributes: Array<{ id: string; name: string }>;
  };
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">
          {category.name}
          <span
            className={cn(
              'ml-2 rounded-full px-2 py-0.5 text-xs font-medium',
              category.isActive
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {category.isActive ? 'Activa' : 'Inactiva'}
          </span>
        </p>
        <p className="text-muted-foreground text-xs">
          {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
          {category.filterableAttributes.length > 0
            ? ` · ${category.filterableAttributes.map((attribute) => attribute.name).join(', ')}`
            : ''}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Link
          href={`/admin/categorias/${category.id}/editar`}
          className="text-sm font-medium underline-offset-2 hover:underline"
        >
          Editar
        </Link>
        <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
      </div>
    </div>
  );
}
