import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import type { User } from '@/types';
import { Link } from '@inertiajs/react';
import { KeyRound, LogOut, Palette, UserRoundCog } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                    <UserInfo user={user} showEmail />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="w-full" href={route('profile.edit')} prefetch onClick={cleanup}>
                        <UserRoundCog className="mr-2" />
                        Mi perfil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="w-full" href={route('password.edit')} prefetch onClick={cleanup}>
                        <KeyRound className="mr-2" />
                        Seguridad
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="w-full" href={route('appearance')} prefetch onClick={cleanup}>
                        <Palette className="mr-2" />
                        Apariencia
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="w-full" method="post" href={route('logout')} as="button" onClick={cleanup}>
                    <LogOut className="mr-2" />
                    Cerrar sesión
                </Link>
            </DropdownMenuItem>
        </>
    );
}
