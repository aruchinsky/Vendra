import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BadgeDollarSign } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Planes', href: '/planes' },
    { title: 'Nuevo plan', href: '/planes/create' },
];

export default function CreatePlan() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo plan" />
            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-6">
                <Button asChild variant="ghost" className="w-fit">
                    <Link href={route('planes.index')}>
                        <ArrowLeft className="mr-2 size-4" />
                        Volver a planes
                    </Link>
                </Button>
                <Card className="rounded-3xl border-dashed">
                    <CardContent className="p-10 text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
                            <BadgeDollarSign className="size-8" />
                        </div>
                        <h1 className="mt-6 text-2xl font-semibold">Creación de planes</h1>
                        <p className="mt-3 text-muted-foreground">
                            Esta pantalla se completará junto con la administración avanzada de límites y funcionalidades.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
