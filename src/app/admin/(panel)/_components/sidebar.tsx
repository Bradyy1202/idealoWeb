import Link from 'next/link';
import { FileText, FolderTree, Inbox, LayoutDashboard, Package, Tags } from 'lucide-react';
import { Logo } from '@/shared/ui/logo';
import { LogoutButton } from './logout-button';

const navItems = [
  { label: 'Panel', href: '/admin', icon: LayoutDashboard },
  { label: 'Productos', href: '/admin/productos', icon: Package },
  { label: 'Categorías', href: '/admin/categorias', icon: FolderTree },
  { label: 'Atributos', href: '/admin/atributos', icon: Tags },
  { label: 'Contenido', href: '/admin/contenido', icon: FileText },
  { label: 'Consultas', href: '/admin/consultas', icon: Inbox },
];

export function Sidebar({ userName }: { userName: string }) {
  return (
    <aside className="border-border bg-card flex w-full flex-row items-center gap-4 overflow-x-auto border-b p-4 md:h-[100dvh] md:w-64 md:shrink-0 md:flex-col md:items-stretch md:gap-0 md:overflow-visible md:border-r md:border-b-0 md:p-6">
      <Link href="/admin" className="shrink-0">
        <Logo height={26} />
      </Link>

      <nav className="flex flex-row gap-1 md:mt-10 md:flex-col">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-3 md:mt-auto md:ml-0 md:flex-col md:items-stretch md:gap-3 md:pt-6">
        <p className="text-muted-foreground hidden truncate text-xs md:block">{userName}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
