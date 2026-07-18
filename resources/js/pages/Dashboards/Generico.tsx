import { Head, usePage } from '@inertiajs/react';
import { CircleUserRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type pageProps } from '@/types';

type GenericoProps = pageProps & {
    user?: {
        nombre?: string | null;
    };
    mensaje?: string;
};

export default function Generico() {
    const { auth, user, mensaje } = usePage<GenericoProps>().props;
    const nombre = user?.nombre ?? auth?.user?.nombre ?? 'Usuario';

    return (
        <AppLayout>
            <Head title="Panel general" />

            <div className="flex h-full flex-1 items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="items-center text-center">
                        <CircleUserRound className="h-12 w-12 text-primary" />
                        <CardTitle>Bienvenido, {nombre}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-center text-muted-foreground">
                        {mensaje ?? 'Tu cuenta todavía no tiene un panel personalizado asignado.'}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
