import AppLogo from '@/components/app-logo';
import { BusinessSwitcher } from '@/components/business-switcher';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { buildSidebarNavigation } from '@/lib/sidebar-navigation';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

/**
 * Sidebar principal de Vendra.
 *
 * El backend comparte el contexto autenticado y esta capa se limita a
 * representarlo. Ninguna autorización real depende de ocultar un enlace.
 */
export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    if (!auth.user) {
        return null;
    }

    const navigationGroups = buildSidebarNavigation(auth);

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-colors duration-200"
        >
            <SidebarHeader className="gap-2 border-b border-sidebar-border/60 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="rounded-xl">
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <BusinessSwitcher auth={auth} />
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain groups={navigationGroups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60 pt-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
