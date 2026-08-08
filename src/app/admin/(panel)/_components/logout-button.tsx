import { signOut } from '@/auth';
import { Button } from '@/shared/ui/button';

export function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/admin/login' });
      }}
    >
      <Button type="submit" variant="outline" size="sm" className="w-full rounded-full">
        Cerrar sesión
      </Button>
    </form>
  );
}
