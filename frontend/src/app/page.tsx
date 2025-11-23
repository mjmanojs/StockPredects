'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, auth } from '@/lib/auth';
import { User } from 'firebase/auth';
import api from '@/lib/api';
import { TrendingUp, Search, BarChart2, Globe, ArrowRight, Shield, Zap, Activity } from 'lucide-react';
import { Button, Input, Card, CardBody, CardHeader, useDisclosure } from "@nextui-org/react";
import { FadeIn, StaggerContainer } from '@/components/animations';
import { motion } from 'framer-motion';

import CustomAuthModal from '@/components/CustomAuthModal';
import AuthParamHandler from '@/components/AuthParamHandler';
import NewsSection from '@/components/NewsSection';
import MouseSpotlight from '@/components/MouseSpotlight';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleDemoLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, "manojsprivatemail@gmail.com", "manojs@421");
    } catch (error) {
      console.error("Demo Login failed", error);
      alert("Demo Login Failed: Enable Email/Password in Firebase Console.");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await api.get(`/stock/search/${searchQuery}`);
      setSearchResults(res.data.quotes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomAuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <Suspense fallback={null}>
        <AuthParamHandler onOpen={onOpen} />
      </Suspense>
      {!user ? (
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
            <FadeIn>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-default-600">Live Market Data Active</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Predict the Future of <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-gradient-x">
                  Indian Stocks
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-xl text-default-500 max-w-2xl mb-10 leading-relaxed">
                Advanced AI algorithms meet real-time NSE data. Get accurate predictions,
                sentiment analysis, and institutional-grade insights for the Indian market.
              </p>
            </FadeIn>

            <FadeIn delay={0.6} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button
                size="lg"
                color="primary"
                variant="shadow"
                className="font-semibold text-lg px-8 h-14 min-w-[200px] bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/20"
                startContent={<Globe className="w-5 h-5" />}
                onPress={onOpen}
                radius="full"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="font-semibold text-lg px-8 h-14 min-w-[200px] border-2 border-default-200 hover:border-primary hover:bg-primary/5"
                startContent={<Zap className="w-5 h-5" />}
                onPress={handleDemoLogin}
                radius="full"
              >
                Demo Login
              </Button>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
              {[
                { icon: TrendingUp, title: "AI Predictions", desc: "Deep learning models forecasting 30-day price trends with high accuracy.", color: "text-purple-500" },
                { icon: Activity, title: "Real-Time Data", desc: "Live NSE/BSE feeds with sub-second latency via Firestore.", color: "text-pink-500" },
                { icon: Shield, title: "Secure Platform", desc: "Enterprise-grade security with Firebase Authentication & Encryption.", color: "text-orange-500" }
              ].map((feature, index) => (
                <motion.div key={index} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                  <MouseSpotlight className="h-full">
                    <div className="glass-panel p-8 rounded-3xl h-full hover:scale-[1.02] transition-transform duration-300 relative z-10">
                      <div className={`p-4 rounded-2xl bg-black/5 dark:bg-white/5 w-fit mb-6 ${feature.color}`}>
                        <feature.icon size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-default-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </MouseSpotlight>
                </motion.div>
              ))}
            </StaggerContainer>

            <div className="w-full mt-24">
              <NewsSection />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-2">Welcome back, <span className="text-primary">{user.displayName?.split(' ')[0] || 'Trader'}</span></h2>
                <p className="text-default-500">Market is currently <span className="text-success font-semibold">Open</span>. Sensex is up 0.4%.</p>
              </div>
              <div className="flex gap-3">
                <Button color="primary" variant="flat" startContent={<BarChart2 size={18} />} radius="full">
                  Portfolio
                </Button>
                <Button color="secondary" variant="flat" startContent={<Activity size={18} />} radius="full">
                  Watchlist
                </Button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass-panel rounded-3xl p-8 mb-12">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full">
                  <Input
                    size="lg"
                    placeholder="Search for stocks (e.g., RELIANCE, TCS)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<Search className="text-default-400" />}
                    classNames={{
                      inputWrapper: "bg-default-100/50 hover:bg-default-100/80 transition-colors h-14",
                    }}
                  />
                </div>
                <Button
                  size="lg"
                  color="primary"
                  type="submit"
                  isLoading={searching}
                  className="h-14 px-8 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/20"
                  radius="full"
                >
                  Search Market
                </Button>
              </form>
            </div>
          </FadeIn>

          {searchResults.length > 0 && (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((stock) => (
                <motion.div key={stock.symbol} variants={{ hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}>
                  <Card
                    isPressable
                    onPress={() => router.push(`/stock/${stock.symbol}`)}
                    className="hover:scale-[1.02] transition-transform duration-200 border-none glass-panel"
                  >
                    <CardBody className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{stock.symbol}</h3>
                          <p className="text-sm text-default-500">{stock.shortname || stock.longname}</p>
                        </div>
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-default-100 text-default-600">
                          {stock.exchange}
                        </span>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-default-100 text-default-600">
                          {stock.quoteType}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          )}
        </div>
      )}
    </div>
  );
}
