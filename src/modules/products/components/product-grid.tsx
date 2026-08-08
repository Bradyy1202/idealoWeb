import { EmptyState } from '@/shared/ui/empty-state';
import type { ProductListItem } from '../service';
import { ProductCard } from './product-card';

export function ProductGrid({ items }: { items: ProductListItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No hay productos para mostrar"
        description="Todavía no hay productos publicados en esta vista. Volvé a intentarlo más tarde."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
