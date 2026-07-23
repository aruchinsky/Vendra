import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BadgeDollarSign, Settings2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Planes', href: '/planes' }];

export default function PlanesIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planes" />
            <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 md:p-8">
                <Card className="w-full max-w-3xl rounded-3xl border-dashed">
                    <CardContent className="p-10 text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
                            <BadgeDollarSign className="size-8" />
                        </div>
                        <h1 className="mt-6 text-3xl font-semibold">Planes de Vendra</h1>
                        <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
                            La navegación administrativa ya reconoce este módulo. La pantalla completa de edición de límites y funcionalidades se incorporará en la etapa de gestión de planes.
                        </p>
                        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                            <Settings2 className="size-4 text-primary" />
                            Preparado para Plan Free y Premium
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
