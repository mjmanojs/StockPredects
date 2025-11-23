'use client';

import { FadeIn } from '@/components/animations';
import { Card, CardBody, Chip } from "@nextui-org/react";
import { Calendar, Rocket } from 'lucide-react';

export default function IPOPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="container mx-auto max-w-6xl">
                <FadeIn>
                    <h1 className="text-4xl font-bold mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                            Upcoming IPOs
                        </span>
                    </h1>
                    <p className="text-default-500 mb-12 text-lg">
                        Track the latest Initial Public Offerings in the Indian market.
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FadeIn delay={0.1}>
                        <Card className="bg-content1/50 backdrop-blur-lg border border-white/10">
                            <CardBody className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 h-fit">
                                            <Rocket size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">TechNova Solutions</h3>
                                            <p className="text-sm text-default-500">Technology • SME</p>
                                        </div>
                                    </div>
                                    <Chip color="primary" variant="flat">Open Now</Chip>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-xs text-default-400">Price Band</p>
                                        <p className="font-semibold">₹450 - ₹480</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-default-400">Lot Size</p>
                                        <p className="font-semibold">30 Shares</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <Card className="bg-content1/50 backdrop-blur-lg border border-white/10 opacity-75">
                            <CardBody className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="p-3 rounded-xl bg-default-100 text-default-500 h-fit">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">GreenEnergy Ltd</h3>
                                            <p className="text-sm text-default-500">Energy • Mainboard</p>
                                        </div>
                                    </div>
                                    <Chip color="default" variant="flat">Coming Soon</Chip>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-xs text-default-400">Expected Date</p>
                                        <p className="font-semibold">Dec 15, 2024</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-default-400">Est. Size</p>
                                        <p className="font-semibold">₹1,200 Cr</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
