import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { PageProps, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, CircleUserRound, ShieldQuestion } from 'lucide-react';

type Props = PageProps & {
    user?: User;
    mensaje?: string;
};

export default function Generico() {
    const { auth, user, mensaje } = usePage<Props>().props;
    const currentUser = user ?? auth?.user;

    return (
        <AppLayout>
            <Head title="Panel general | Vendra" />

            <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                    <Card className="overflow-hidden rounded-3xl">
                        <CardContent className="relative p-8 text-center md:p-12">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.13),transparent_38%)]" />
                            <div className="relative z-10">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                                    {currentUser ? <CircleUserRound className="h-8 w-8" /> : <ShieldQuestion className="h-8 w-8" />}
                                </div>
                                <h1 className="mt-6 text-2xl font-semibold">
                                    Bienvenido, {currentUser?.nombre ?? 'usuario'}
                                </h1>
                                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                                    {mensaje ?? 'Tu cuenta todavía no tiene un panel personalizado asignado.'}
                                </p>
                                <Button asChild variant="outline" className="mt-7">
                                    <Link href={route('home')}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Volver al inicio
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
