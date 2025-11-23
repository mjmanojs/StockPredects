'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DollarSign, TrendingUp, TrendingDown, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Commodity, HistoryPoint } from '@/lib/types';
import { auth, onAuthStateChanged } from '@/lib/auth';
import { User } from 'firebase/auth';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function CommoditiesPage() {
    const [commodities, setCommodities] = useState<Commodity[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryPoint[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return; // Don't fetch if not logged in

        import('@/lib/firebase').then(({ db }) => {
            if (!db) {
                // Fallback for Mock Mode
                api.get('/commodities').then(res => {
                    setCommodities(res.data.map((c: any) => ({ ...c, price: c.price * 84 })));
                    setLoading(false);
                });
                return;
            }
            import('firebase/firestore').then(({ collection, onSnapshot, query, where }) => {
                const q = query(collection(db, "stocks"), where("symbol", "in", ["GC=F", "SI=F"]));

                const unsub = onSnapshot(q, (snapshot) => {
                    const updates: Commodity[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        updates.push({
                            symbol: data.symbol,
                            name: data.symbol === 'GC=F' ? 'Gold' : 'Silver',
                            price: data.price * 84, // Convert to INR approx
                            change: data.change
                        });
                    });

                    if (updates.length > 0) {
                        setCommodities(updates);
                        setLoading(false);
                    } else {
                        api.get('/commodities').then(res => {
                            setCommodities(res.data.map((c: any) => ({ ...c, price: c.price * 84 })));
                            setLoading(false);
                        });
                    }
                });
                return () => unsub();
            });
        });
    }, [user]);

    // Fetch history when a commodity is selected
    useEffect(() => {
        if (selectedCommodity && user) {
            api.get(`/stocks/${selectedCommodity}/history?period=1mo&interval=1d`)
                .then(res => setHistory(res.data))
                .catch(err => console.error(err));
        }
    }, [selectedCommodity, user]);

    if (authLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
                <Lock size={64} className="text-primary mb-4" />
                <h1 className="text-3xl font-bold mb-2">Login Required</h1>
                <p className="text-default-500 mb-6 max-w-md">
                    Please log in to access real-time commodities market data and analytics.
                </p>
                <Button
                    color="primary"
                    size="lg"
                    onPress={() => router.push('/')}
                    className="font-semibold"
                >
                    Go to Home & Login
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background text-foreground p-8 overflow-y-auto">
            <div className="container mx-auto pb-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 rounded-full hover:bg-accent transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl font-bold text-yellow-500 flex items-center gap-3">
                        <DollarSign size={40} /> Commodities Market
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center text-muted-foreground">Loading market data...</div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {commodities.map((comm) => (
                                <div
                                    key={comm.symbol}
                                    onClick={() => setSelectedCommodity(comm.symbol)}
                                    className={`p-6 rounded-xl border cursor-pointer transition-all shadow-lg ${selectedCommodity === comm.symbol
                                        ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                                        : 'bg-card border-border hover:border-primary/50'
                                        }`}
                                >
                                    <h2 className="text-2xl font-bold mb-4">{comm.name}</h2>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-muted-foreground text-sm mb-1">Current Price (₹)</div>
                                            <div className="text-3xl font-bold">₹{comm.price?.toFixed(2)}</div>
                                        </div>
                                        <div className={`flex items-center gap-1 text-lg font-bold ${comm.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {comm.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                            {comm.change?.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedCommodity && (
                            <div className="bg-card p-6 rounded-xl shadow-lg border border-border animate-in fade-in slide-in-from-bottom-4">
                                <h3 className="text-xl font-bold mb-4">Price History (1 Month)</h3>
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
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
