import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tickets', href: '/tickets' }];

/**
 * Conservado temporalmente para instalaciones que todavía tengan enlaces del
 * prototipo anterior. La edición se incorporará con el flujo de soporte.
 */
export default function EditTicket() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de ticket" />
            <div className="mx-auto w-full max-w-2xl p-6">
                <Card>
                    <CardContent className="space-y-4 p-8 text-center">
                        <h1 className="text-2xl font-semibold">Gestión de tickets en evolución</h1>
                        <p className="text-muted-foreground">El listado y la creación ya utilizan la entidad oficial TicketSoporte.</p>
                        <Button asChild>
                            <Link href={route('tickets.index')}>Volver a tickets</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
