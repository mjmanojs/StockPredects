'use client';

import { FadeIn } from '@/components/animations';
import { Card, CardBody } from "@nextui-org/react";
import { ScrollText } from 'lucide-react';

export default function BondsPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="container mx-auto max-w-6xl">
                <FadeIn>
                    <h1 className="text-4xl font-bold mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
                            Corporate Bonds
                        </span>
                    </h1>
                    <p className="text-default-500 mb-12 text-lg">
                        Secure, fixed-income investment opportunities.
                    </p>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <Card className="min-h-[400px] flex items-center justify-center border-dashed border-2 border-default-200 bg-transparent">
                        <div className="text-center p-8">
                            <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500 mb-4">
                                <ScrollText size={48} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-default-400">Bond Market Coming Soon</h2>
                            <p className="text-default-400 max-w-md mx-auto">
                                Discover high-yield corporate bonds and secure your future returns.
                            </p>
                        </div>
                    </Card>
                </FadeIn>
            </div>
        </div>
    );
}
