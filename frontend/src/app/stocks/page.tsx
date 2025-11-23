'use client';

import { FadeIn } from '@/components/animations';
import { Card, CardBody } from "@nextui-org/react";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StocksPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="container mx-auto max-w-6xl">
                <FadeIn>
                    <h1 className="text-4xl font-bold mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                            Stocks Market
                        </span>
                    </h1>
                    <p className="text-default-500 mb-12 text-lg">
                        Explore top performing Indian stocks, market trends, and detailed analysis.
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {['NIFTY 50', 'SENSEX', 'BANK NIFTY'].map((index, i) => (
                        <FadeIn key={index} delay={i * 0.1}>
                            <Card className="bg-content1/50 backdrop-blur-lg border border-white/10">
                                <CardBody className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{index}</h3>
                                            <p className="text-sm text-default-500">Index</p>
                                        </div>
                                        <div className="p-2 rounded-full bg-success/10 text-success">
                                            <TrendingUp size={24} />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-bold">22,450.00</span>
                                        <span className="text-sm text-success flex items-center">
                                            <ArrowUpRight size={16} /> +1.2%
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={0.4}>
                    <Card className="min-h-[400px] flex items-center justify-center border-dashed border-2 border-default-200 bg-transparent">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2 text-default-400">Market Dashboard Coming Soon</h2>
                            <p className="text-default-400">We are building advanced screening and analysis tools.</p>
                        </div>
                    </Card>
                </FadeIn>
            </div>
        </div>
    );
}
