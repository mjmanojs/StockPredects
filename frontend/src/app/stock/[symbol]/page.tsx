'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Newspaper, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Stock, Prediction, Sentiment, HistoryPoint } from '@/lib/types';

export default function StockDetailsPage() {
    const { symbol } = useParams();
    const [info, setInfo] = useState<Stock | null>(null);
    const [history, setHistory] = useState<HistoryPoint[]>([]);
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [sentiment, setSentiment] = useState<Sentiment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!symbol) return;

        // Initial Fetch for static data
        const fetchStaticData = async () => {
            try {
                const [historyRes, predRes, sentRes] = await Promise.all([
                    api.get(`/stocks/${symbol}/history?period=1mo&interval=1d`),
                    api.get(`/stocks/${symbol}/prediction`),
                    api.get(`/stocks/${symbol}/sentiment`)
                ]);
                setHistory(historyRes.data);
                setPrediction(predRes.data);
                setSentiment(sentRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStaticData();

        // Real-time Listener for Price
        import('@/lib/firebase').then(({ db }) => {
            if (!db) return; // Skip if db is null (Mock Mode)
            import('firebase/firestore').then(({ doc, onSnapshot }) => {
                const unsub = onSnapshot(doc(db, "stocks", symbol as string), (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setInfo((prev: Stock | null) => ({
                            ...prev!,
                            symbol: data.symbol,
                            longName: prev?.longName || data.symbol,
                            currentPrice: data.price,
                            regularMarketPrice: data.price,
                            regularMarketChangePercent: data.change
                        }));
                        setLoading(false);
                    } else {
                        // Fallback to API
                        api.get(`/stocks/${symbol}`).then(res => {
                            setInfo(res.data);
                            setLoading(false);
                        }).catch(err => setLoading(false));
                    }
                });
                return () => unsub();
            });
        });
    }, [symbol]);

    if (loading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;
    if (!info) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Stock not found</div>;

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                    <Link href="/" className="p-2 rounded-full hover:bg-accent transition-colors mt-1">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex-1 flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold text-primary">{info.symbol}</h1>
                            <h2 className="text-xl text-muted-foreground">{info.longName}</h2>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">₹{info.currentPrice?.toFixed(2) || info.regularMarketPrice?.toFixed(2)}</div>
                            <div className={`text-lg ${(info.regularMarketChangePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {info.regularMarketChangePercent?.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-card p-6 rounded-xl shadow-lg mb-8 border border-border">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity /> Price History (1 Month)</h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="date" stroke="var(--muted-foreground)" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                                <YAxis stroke="var(--muted-foreground)" domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    labelStyle={{ color: 'var(--muted-foreground)' }}
                                />
                                <Line type="monotone" dataKey="close" stroke="var(--primary)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Prediction Card */}
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            {prediction?.trend === 'UP' ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />}
                            AI Prediction
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="text-muted-foreground">30-Day Forecast</span>
                                <span className="font-bold">₹{prediction?.predicted_price_30d?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="text-muted-foreground">Intraday Target</span>
                                <span className="font-bold">₹{prediction?.intraday_target?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Confidence</span>
                                <span className="font-bold text-primary">{((prediction?.confidence || 0) * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Card */}
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Newspaper /> Market Sentiment</h3>
                        <div className="mb-4">
                            <div className="text-2xl font-bold mb-1" style={{
                                color: sentiment?.sentiment_label === 'Positive' ? '#4ADE80' : sentiment?.sentiment_label === 'Negative' ? '#F87171' : '#9CA3AF'
                            }}>
                                {sentiment?.sentiment_label}
                            </div>
                            <div className="text-sm text-muted-foreground">Score: {sentiment?.sentiment_score?.toFixed(2)}</div>
                        </div>
                        <div className="space-y-2">
                            {sentiment?.headlines?.map((headline: string, i: number) => (
                                <div key={i} className="text-sm text-muted-foreground bg-accent p-2 rounded">
                                    {headline}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
