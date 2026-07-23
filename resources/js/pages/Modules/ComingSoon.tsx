import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Negocio } from '@/types';
import { Head } from '@inertiajs/react';
import { Blocks, Building2, CheckCircle2, Construction } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    negocio?: Pick<Negocio, 'id' | 'nombre_comercial' | 'rubro'> | null;
}

export default function ComingSoon({ title, description, negocio = null }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title, href: '#' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden p-4 md:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.12),transparent_30%),radial-gradient(circle_at_80%_75%,rgba(139,92,246,0.1),transparent_30%)]" />
                <Card className="relative w-full max-w-3xl overflow-hidden rounded-3xl border-dashed bg-card/90 shadow-xl backdrop-blur">
                    <CardContent className="p-8 text-center md:p-12">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Construction className="size-8" />
                        </div>
                        <Badge variant="outline" className="mt-6 gap-2">
                            <Blocks className="size-3.5 text-primary" />
                            Módulo conectado al nuevo contexto
                        </Badge>
                        <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
                        <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">{description}</p>

                        {negocio && (
                            <div className="mx-auto mt-7 flex max-w-lg items-center gap-3 rounded-2xl border bg-background/70 p-4 text-left">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Building2 className="size-5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-xs text-muted-foreground">Contexto comercial activo</span>
                                    <span className="block truncate font-medium">{negocio.nombre_comercial}</span>
                                </span>
                                <CheckCircle2 className="size-5 text-emerald-500" />
                            </div>
                        )}

                        <p className="mt-7 text-sm text-muted-foreground">
                            El acceso, el aislamiento por negocio y la navegación ya están preparados. La interfaz operativa de este módulo se incorporará en su etapa correspondiente.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
