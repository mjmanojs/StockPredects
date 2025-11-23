import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Chip, Button, Skeleton } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TrendingUp, Globe, ArrowRight, Clock, ExternalLink } from "lucide-react";
import api from "@/lib/api";

interface NewsItem {
    title: string;
    link: string;
    publisher: string;
    providerPublishTime: number;
    type: string;
    thumbnail?: string;
}

export default function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await api.get('/news');
                setNews(res.data.slice(0, 4)); // Take top 4
            } catch (error) {
                console.error("Failed to fetch news", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatTime = (timestamp: number) => {
        if (!timestamp) return "Recently";
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return date.toLocaleDateString();
    };

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-12"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="text-primary" size={24} />
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Global & Indian Updates</span>
                        </div>
                        <h2 className="text-4xl font-bold">Financial News Feed</h2>
                    </div>
                    <Button variant="light" color="primary" endContent={<ArrowRight size={18} />}>
                        View All News
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <Card key={i} className="h-[300px] w-full space-y-5 p-4" radius="lg">
                                <Skeleton className="rounded-lg">
                                    <div className="h-24 rounded-lg bg-default-300"></div>
                                </Skeleton>
                                <div className="space-y-3">
                                    <Skeleton className="w-3/5 rounded-lg">
                                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-4/5 rounded-lg">
                                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-2/5 rounded-lg">
                                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                                    </Skeleton>
                                </div>
                            </Card>
                        ))
                    ) : (
                        news.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    isPressable
                                    onPress={() => window.open(item.link, '_blank')}
                                    className="h-full hover:scale-[1.02] transition-transform duration-300 border-none glass-panel"
                                >
                                    <CardHeader className="p-0 z-0">
                                        <img
                                            src={item.thumbnail || "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60"}
                                            alt={item.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Chip
                                                size="sm"
                                                color="primary"
                                                variant="solid"
                                                className="shadow-lg"
                                            >
                                                News
                                            </Chip>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs font-semibold text-primary uppercase tracking-wider line-clamp-1">{item.publisher}</span>
                                                <div className="flex items-center gap-1 text-default-400 text-xs shrink-0">
                                                    <Clock size={12} />
                                                    <span>{formatTime(item.providerPublishTime)}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-3">{item.title}</h3>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                                            <span className="text-xs font-medium text-default-500">Read More</span>
                                            <ExternalLink size={16} className="text-default-400" />
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
