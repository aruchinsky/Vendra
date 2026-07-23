import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    groups?: NavGroup[];
}

function normalizePath(value: string): string {
    const withoutOrigin = value.replace(/^https?:\/\/[^/]+/i, '');
    const path = withoutOrigin.split('?')[0].split('#')[0].replace(/\/+$/, '');

    return path || '/';
}

function isItemActive(item: NavItem, currentUrl: string): boolean {
    const currentPath = normalizePath(currentUrl);
    const patterns = item.activePatterns ?? [normalizePath(item.href)];

    return patterns.some((pattern) => {
        const normalizedPattern = normalizePath(pattern);

        if (!normalizedPattern.includes('*')) {
            return currentPath === normalizedPattern;
        }

        const expression = normalizedPattern
            .split('*')
            .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('[^/]+');

        return new RegExp(`^${expression}$`).test(currentPath);
    });
}

function badgeClassName(item: NavItem): string {
    return cn(
        'ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none group-data-[collapsible=icon]:hidden',
        item.badgeTone === 'premium'
            ? 'bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-sm'
            : item.badgeTone === 'secondary'
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-muted text-muted-foreground',
    );
}

/**
 * Renderiza grupos declarativos y conserva el estado activo en rutas hijas.
 */
export function NavMain({ groups = [] }: NavMainProps) {
    const page = usePage();

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup key={group.title} className="px-2 py-1.5">
                    <SidebarGroupLabel className="text-[11px] font-semibold tracking-[0.08em] uppercase">
                        {group.title}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => {
                            const active = item.isActive ?? isItemActive(item, page.url);

                            return (
                                <SidebarMenuItem key={`${group.title}-${item.title}`}>
                                    <SidebarMenuButton
                                        asChild={!item.disabled}
                                        isActive={active}
                                        disabled={item.disabled}
                                        tooltip={item.title}
                                        className="h-9 rounded-lg"
                                    >
                                        {item.disabled ? (
                                            <span aria-disabled="true">
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                {item.badge && <span className={badgeClassName(item)}>{item.badge}</span>}
                                            </span>
                                        ) : (
                                            <Link href={item.href} prefetch>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                {item.badge && <span className={badgeClassName(item)}>{item.badge}</span>}
                                            </Link>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
