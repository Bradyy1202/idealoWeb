import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/shared/lib/format-price';
import { cn } from '@/shared/lib/cn';
import type { ProductAdminListItem } from '@/modules/products/service';
import { ProductRowActions } from './product-row-actions';

export function ProductTable({ items }: { items: ProductAdminListItem[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground mt-6 text-sm">No hay productos que coincidan.</p>;
  }

  return (
    <div className="border-border overflow-x-auto rounded-2xl border">
      <table className="w-full text-sm">
        <thead className="border-border bg-secondary/40 border-b text-left">
          <tr>
            <th className="p-3 font-medium">Producto</th>
            <th className="p-3 font-medium">Categoría</th>
            <th className="p-3 font-medium">Precio</th>
            <th className="p-3 font-medium">Estado</th>
            <th className="p-3 font-medium">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {items.map((product) => (
            <tr key={product.id}>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    {product.sku ? (
                      <p className="text-muted-foreground text-xs">{product.sku}</p>
                    ) : null}
                  </div>
                </div>
              </td>
              <td className="p-3">{product.categoryName}</td>
              <td className="p-3">
                {product.basePrice === null ? '—' : formatPrice(product.basePrice)}
              </td>
              <td className="p-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium',
                    product.isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="p-3">
                <ProductRowActions productId={product.id} isActive={product.isActive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
