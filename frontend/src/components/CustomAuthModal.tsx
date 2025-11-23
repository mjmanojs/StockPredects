'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, auth, createUserWithEmailAndPassword, updateProfile } from '@/lib/auth';
import { Button, Input, Divider, Tab, Tabs } from "@nextui-org/react";
import { Mail, Lock, Globe, User, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export default function CustomAuthModal({ isOpen, onOpenChange }: AuthModalProps) {
    const [selected, setSelected] = useState<string>("login");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setLoading(false);
            setErrors({});
            setEmail('');
            setPassword('');
            setFullName('');
            setConfirmPassword('');
        }
    }, [isOpen]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateLogin = () => {
        const newErrors: { [key: string]: string } = {};
        if (!email) newErrors.email = "Email is required";
        else if (!validateEmail(email)) newErrors.email = "Invalid email format";

        if (!password) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegister = () => {
        const newErrors: { [key: string]: string } = {};
        if (!fullName) newErrors.fullName = "Full Name is required";

        if (!email) newErrors.email = "Email is required";
        else if (!validateEmail(email)) newErrors.email = "Invalid email format";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateLogin()) return;

        console.log("Login attempt starting...", { email });
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful");
            onOpenChange(); // Close modal
            router.push('/');
            // Force reload to ensure auth state is picked up if listener fails
            setTimeout(() => window.location.reload(), 100);
        } catch (error: any) {
            console.error("Login Error Full Object:", error);
            console.error("Login Error Code:", error.code);
            console.error("Login Error Message:", error.message);

            // Map Firebase errors to user-friendly messages
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setErrors({ ...errors, form: "Invalid email or password" });
            } else if (error.code === 'auth/network-request-failed') {
                setErrors({ ...errors, form: "Network error. Check your connection." });
            } else {
                setErrors({ ...errors, form: `Login failed: ${error.message}` });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateRegister()) return;

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: fullName });

            // Sync with backend (optional)
            try {
                await api.post('/auth/register', { email, password, full_name: fullName });
            } catch (err) { console.warn("Backend sync failed", err); }

            onOpenChange();
            router.push('/');
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                setErrors({ ...errors, email: "Email is already in use" });
            } else {
                setErrors({ ...errors, form: "Registration failed. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            onOpenChange();
            router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onOpenChange}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-[95%] sm:w-full max-w-md max-h-[90vh] overflow-y-auto bg-background/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onOpenChange}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-default-100 text-default-500 transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col gap-1 items-center pt-8 pb-2 px-6">
                            <h1 className="text-2xl font-bold text-primary text-center">Welcome to Stock Predects</h1>
                            <p className="text-default-500 font-normal text-sm text-center">Your gateway to AI-powered trading</p>
                        </div>

                        <div className="px-4 sm:px-8 pb-8">
                            <Tabs
                                fullWidth
                                size="md"
                                aria-label="Auth Tabs"
                                selectedKey={selected}
                                onSelectionChange={(key) => {
                                    setSelected(key as string);
                                    setErrors({}); // Clear errors on tab switch
                                }}
                                color="primary"
                                variant="underlined"
                                classNames={{
                                    cursor: "w-full bg-primary",
                                    tabContent: "group-data-[selected=true]:text-primary font-semibold"
                                }}
                            >
                                <Tab key="login" title="Login">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-4">
                                            {errors.form && (
                                                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                                                    {errors.form}
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-foreground">Email</label>
                                                <Input
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    variant="bordered"
                                                    startContent={<Mail className="text-default-400 pointer-events-none mr-2" size={20} />}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    isInvalid={!!errors.email}
                                                    errorMessage={errors.email}
                                                    classNames={{
                                                        inputWrapper: "h-12 bg-default-100/50 border-default-200 group-data-[focus=true]:border-primary",
                                                        input: "text-foreground",
                                                        label: "text-foreground"
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-foreground">Password</label>
                                                <Input
                                                    placeholder="Enter your password"
                                                    type="password"
                                                    variant="bordered"
                                                    startContent={<Lock className="text-default-400 pointer-events-none mr-2" size={20} />}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    isInvalid={!!errors.password}
                                                    errorMessage={errors.password}
                                                    classNames={{
                                                        inputWrapper: "h-12 bg-default-100/50 border-default-200 group-data-[focus=true]:border-primary",
                                                        input: "text-foreground"
                                                    }}
                                                />
                                            </div>
                                            <Button
                                                color="primary"
                                                type="submit"
                                                isLoading={loading}
                                                className="w-full font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white border border-white/20 dark:border-white/10"
                                                size="lg"
                                            >
                                                Login
                                            </Button>
                                        </form>
                                    </motion.div>
                                </Tab>
                                <Tab key="register" title="Sign Up">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <form onSubmit={handleRegister} className="flex flex-col gap-6 mt-4">
                                            {errors.form && (
                                                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                                                    {errors.form}
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-foreground">Full Name</label>
                                                <Input
                                                    placeholder="Enter your full name"
                                                    type="text"
                                                    variant="bordered"
                                                    startContent={<User className="text-default-400 pointer-events-none mr-2" size={20} />}
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    isInvalid={!!errors.fullName}
                                                    errorMessage={errors.fullName}
                                                    classNames={{
                                                        inputWrapper: "h-12 bg-default-100/50 border-default-200 group-data-[focus=true]:border-primary",
                                                        input: "text-foreground"
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-foreground">Email</label>
                                                <Input
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    variant="bordered"
                                                    startContent={<Mail className="text-default-400 pointer-events-none mr-2" size={20} />}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    isInvalid={!!errors.email}
                                                    errorMessage={errors.email}
                                                    classNames={{
                                                        inputWrapper: "h-12 bg-default-100/50 border-default-200 group-data-[focus=true]:border-primary",
                                                        input: "text-foreground"
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-foreground">Password</label>
                                                <Input
                                                    placeholder="Create a password"
                                                    type="password"
                                                    variant="bordered"
                                                    startContent={<Lock className="text-default-400 pointer-events-none mr-2" size={20} />}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    isInvalid={!!errors.password}
                                                    errorMessage={errors.password}
                                                    classNames={{
                                                        inputWrapper: "h-12 bg-default-100/50 border-default-200 group-data-[focus=true]:border-primary",
                                                        input: "text-foreground"
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                                                <Input
                                                    placeholder="Confirm your password"
                                                    type="password"
                                                    variant="bordered"
                                                    startContent={<CheckCircle className="text-default-400 pointer-events-none mr-2" size={20} />}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    isInvalid={!!errors.confirmPassword}
                                                    errorMessage={errors.confirmPassword}
                                                    classNames={{
                                                        inputWrapper: "h-12 bg-default-100/50 border-default-200 group-data-[focus=true]:border-primary",
                                                        input: "text-foreground"
                                                    }}
                                                />
                                            </div>
                                            <Button
                                                color="primary"
                                                type="submit"
                                                isLoading={loading}
                                                className="w-full font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white border border-white/20 dark:border-white/10"
                                                size="lg"
                                            >
                                                Create Account
                                            </Button>
                                        </form>
                                    </motion.div>
                                </Tab>
                            </Tabs>

                            <div className="flex items-center gap-4 my-6">
                                <Divider className="flex-1" />
                                <span className="text-default-400 text-xs">OR</span>
                                <Divider className="flex-1" />
                            </div>

                            <Button
                                variant="bordered"
                                startContent={
                                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.424 44.599 -10.174 45.789 L -6.704 42.319 C -8.804 40.359 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                        </g>
                                    </svg>
                                }
                                onPress={handleGoogleLogin}
                                className="w-full border-2 border-default-200 hover:border-default-400"
                                size="lg"
                            >
                                {selected === "login" ? "Login with Google" : "Sign up with Google"}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
