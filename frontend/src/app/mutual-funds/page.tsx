'use client';

import { FadeIn } from '@/components/animations';
import { Card, CardBody } from "@nextui-org/react";
import { PieChart } from 'lucide-react';

export default function MutualFundsPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="container mx-auto max-w-6xl">
                <FadeIn>
                    <h1 className="text-4xl font-bold mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                            Mutual Funds
                        </span>
                    </h1>
                    <p className="text-default-500 mb-12 text-lg">
                        Diversify your portfolio with top-rated mutual funds.
                    </p>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <Card className="min-h-[400px] flex items-center justify-center border-dashed border-2 border-default-200 bg-transparent">
                        <div className="text-center p-8">
                            <div className="inline-flex p-4 rounded-full bg-blue-500/10 text-blue-500 mb-4">
                                <PieChart size={48} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-default-400">Fund Explorer Coming Soon</h2>
                            <p className="text-default-400 max-w-md mx-auto">
                                We are integrating with AMFI to bring you real-time NAVs and fund performance data.
                            </p>
                        </div>
                    </Card>
                </FadeIn>
            </div>
        </div>
    );
}
