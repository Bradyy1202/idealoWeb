import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from './_components/sidebar';

export default async function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  // El middleware ya protege /admin/*; esto es una segunda capa barata y
  // resuelve el tipo de session.user para el resto del layout.
  if (!session?.user) redirect('/admin/login');

  return (
    <div className="flex min-h-[100dvh] flex-col md:flex-row">
      <Sidebar userName={session.user.name ?? session.user.email ?? ''} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">{children}</div>
      </main>
    </div>
  );
}
