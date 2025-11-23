'use client';

import { FadeIn } from '@/components/animations';
import { Card, CardBody } from "@nextui-org/react";
import { Landmark } from 'lucide-react';

export default function GovtBondsPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="container mx-auto max-w-6xl">
                <FadeIn>
                    <h1 className="text-4xl font-bold mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-green-500">
                            Government Securities
                        </span>
                    </h1>
                    <p className="text-default-500 mb-12 text-lg">
                        Risk-free investments backed by the Government of India.
                    </p>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <Card className="min-h-[400px] flex items-center justify-center border-dashed border-2 border-default-200 bg-transparent">
                        <div className="text-center p-8">
                            <div className="inline-flex p-4 rounded-full bg-teal-500/10 text-teal-500 mb-4">
                                <Landmark size={48} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-default-400">G-Secs Platform Coming Soon</h2>
                            <p className="text-default-400 max-w-md mx-auto">
                                Invest directly in Treasury Bills and Government Bonds.
                            </p>
                        </div>
                    </Card>
                </FadeIn>
            </div>
        </div>
    );
}
