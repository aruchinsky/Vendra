import { Badge } from '@/components/ui/badge';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import type { Auth, NegocioConUserPivot } from '@/types';
import { router } from '@inertiajs/react';
import { Building2, Check, ChevronsUpDown, Globe2, LoaderCircle, Plus, Settings2, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

interface BusinessSwitcherProps {
    auth: Auth;
}

function BusinessAvatar({ business }: { business: NegocioConUserPivot }) {
    if (business.logo_path) {
        return (
            <img
                src={business.logo_path}
                alt=""
                className="size-8 rounded-xl border border-border/60 object-cover"
            />
        );
    }

    return (
        <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-4" />
        </span>
    );
}

/**
 * Selector compacto estilo command palette para cambiar el contexto comercial.
 */
export function BusinessSwitcher({ auth }: BusinessSwitcherProps) {
    const { isMobile, state } = useSidebar();
    const [open, setOpen] = useState(false);
    const [processingId, setProcessingId] = useState<number | 'global' | null>(null);

    const canUseBusinessContext = auth.es_admin_global || auth.es_usuario_negocio;
    const activeBusiness = auth.negocio_activo;
    const activePlan = auth.plan_activo ?? activeBusiness?.plan ?? null;
    const triggerTitle = activeBusiness?.nombre_comercial ?? (auth.es_admin_global ? 'Entorno global' : 'Seleccionar negocio');

    const orderedBusinesses = useMemo(
        () => [...auth.negocios].sort((a, b) => a.nombre_comercial.localeCompare(b.nombre_comercial, 'es')),
        [auth.negocios],
    );

    if (!canUseBusinessContext) {
        return null;
    }

    const selectBusiness = (business: NegocioConUserPivot) => {
        if (activeBusiness?.id === business.id) {
            setOpen(false);
            return;
        }

        setProcessingId(business.id);
        router.post(
            route('dashboard.negocio.seleccionar', business.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setOpen(false),
                onFinish: () => setProcessingId(null),
            },
        );
    };

    const selectGlobalContext = () => {
        if (!auth.es_admin_global || !activeBusiness) {
            setOpen(false);
            return;
        }

        setProcessingId('global');
        router.delete(route('dashboard.negocio.limpiar'), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
            onFinish: () => setProcessingId(null),
        });
    };

    const navigate = (href: string) => {
        setOpen(false);
        router.visit(href);
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Popover open={open} onOpenChange={setOpen} modal={isMobile}>
                    <PopoverTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="border border-sidebar-border/70 bg-sidebar-accent/35 shadow-sm data-[state=open]:bg-sidebar-accent"
                            tooltip={triggerTitle}
                        >
                            {activeBusiness ? (
                                <BusinessAvatar business={activeBusiness} />
                            ) : (
                                <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                    {auth.es_admin_global ? <Globe2 className="size-4" /> : <Building2 className="size-4" />}
                                </span>
                            )}

                            <span className="min-w-0 flex-1 text-left leading-tight">
                                <span className="block truncate text-sm font-semibold">{triggerTitle}</span>
                                <span className="block truncate text-xs text-sidebar-foreground/65">
                                    {activeBusiness
                                        ? activePlan?.nombre ?? 'Sin plan asignado'
                                        : auth.es_admin_global
                                          ? 'Administración de Vendra'
                                          : auth.negocios.length > 0
                                            ? 'Elegí un negocio'
                                            : 'Creá tu primer negocio'}
                                </span>
                            </span>

                            <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/60" />
                        </SidebarMenuButton>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-[min(22rem,calc(100vw-2rem))] p-0 max-md:max-h-[calc(var(--radix-popover-content-available-height)-0.5rem)] max-md:overflow-hidden"
                        align="start"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'right' : 'bottom'}
                        sideOffset={8}
                    >
                        <Command className="max-md:h-auto max-md:max-h-[calc(var(--radix-popover-content-available-height)-0.5rem)]">
                            <CommandInput placeholder="Buscar negocio..." />
                            <CommandList className="max-md:flex max-md:min-h-0 max-md:max-h-none max-md:flex-1 max-md:flex-col max-md:overflow-hidden">
                                <CommandEmpty>No encontramos un negocio con ese nombre.</CommandEmpty>

                                {auth.es_admin_global && (
                                    <CommandGroup heading="Contexto de trabajo" className="max-md:shrink-0">
                                        <CommandItem
                                            value="entorno global administracion vendra"
                                            onSelect={selectGlobalContext}
                                            disabled={processingId !== null}
                                            className="gap-3 py-2.5"
                                        >
                                            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                                <Globe2 className="size-4" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-medium">Entorno global</span>
                                                <span className="block truncate text-xs text-muted-foreground">
                                                    Usuarios, planes y operación general
                                                </span>
                                            </span>
                                            {processingId === 'global' ? (
                                                <LoaderCircle className="size-4 animate-spin" />
                                            ) : !activeBusiness ? (
                                                <Check className="size-4 text-primary" />
                                            ) : null}
                                        </CommandItem>
                                    </CommandGroup>
                                )}

                                {auth.es_admin_global && orderedBusinesses.length > 0 && <CommandSeparator />}

                                {orderedBusinesses.length > 0 ? (
                                    <CommandGroup
                                        heading={auth.es_admin_global ? 'Negocios activos' : 'Tus negocios'}
                                        className="max-md:min-h-0 max-md:flex-1 max-md:touch-pan-y max-md:overflow-y-auto max-md:overscroll-contain max-md:[-webkit-overflow-scrolling:touch]"
                                    >
                                        {orderedBusinesses.map((business) => {
                                        const isActive = activeBusiness?.id === business.id;
                                        const isBusinessAdmin = auth.es_admin_global || Boolean(business.pivot?.es_administrador);

                                        return (
                                            <CommandItem
                                                key={business.id}
                                                value={`${business.nombre_comercial} ${business.rubro ?? ''} ${business.plan?.nombre ?? ''}`}
                                                onSelect={() => selectBusiness(business)}
                                                disabled={processingId !== null}
                                                className="gap-3 py-2.5"
                                            >
                                                <BusinessAvatar business={business} />
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex min-w-0 items-center gap-2">
                                                        <span className="truncate font-medium">{business.nombre_comercial}</span>
                                                        {business.plan?.slug === 'premium' && (
                                                            <Badge className="h-5 shrink-0 px-1.5 text-[10px]">Premium</Badge>
                                                        )}
                                                    </span>
                                                    <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                                                        {isBusinessAdmin && <ShieldCheck className="size-3 text-primary" />}
                                                        {business.rubro || business.plan?.nombre || 'Negocio Vendra'}
                                                    </span>
                                                </span>
                                                {processingId === business.id ? (
                                                    <LoaderCircle className="size-4 animate-spin" />
                                                ) : isActive ? (
                                                    <Check className="size-4 text-primary" />
                                                ) : null}
                                            </CommandItem>
                                        );
                                        })}
                                    </CommandGroup>
                                ) : (
                                    <div className="px-4 py-6 text-center">
                                        <Building2 className="mx-auto size-8 text-muted-foreground/50" />
                                        <p className="mt-2 text-sm font-medium">Todavía no hay negocios disponibles</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Creá el primero para activar los módulos comerciales.</p>
                                    </div>
                                )}

                                <CommandSeparator />
                                <CommandGroup heading="Acciones" className="max-md:shrink-0">
                                    {auth.es_usuario_negocio && (
                                        <CommandItem onSelect={() => navigate(route('negocios.create'))} className="gap-3 py-2.5">
                                            <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                                                <Plus className="size-4" />
                                            </span>
                                            <span>{auth.negocios.length === 0 ? 'Crear mi primer negocio' : 'Crear otro negocio'}</span>
                                        </CommandItem>
                                    )}
                                    <CommandItem onSelect={() => navigate(route('dashboard.negocios'))} className="gap-3 py-2.5">
                                        <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                                            <Settings2 className="size-4" />
                                        </span>
                                        <span>{auth.es_admin_global ? 'Ver todos los negocios' : 'Administrar selección'}</span>
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
