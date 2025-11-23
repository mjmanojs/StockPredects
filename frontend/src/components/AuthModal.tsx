'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, auth, createUserWithEmailAndPassword, updateProfile } from '@/lib/auth';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, Divider, Tab, Tabs } from "@nextui-org/react";
import { Mail, Lock, Globe, User, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface AuthModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export default function AuthModal({ isOpen, onOpenChange }: AuthModalProps) {
    const [selected, setSelected] = useState<string>("login");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onOpenChange(); // Close modal
            router.push('/');
        } catch (error: any) {
            console.error(error);
            alert('Login Failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            setLoading(false);
            return;
        }
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
            alert('Registration Failed: ' + error.message);
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
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            backdrop="blur"

            classNames={{
                base: "bg-content1/90 backdrop-blur-md border border-primary/20 rounded-md",
                backdrop: "bg-black/50 backdrop-blur-sm",
                closeButton: "hover:bg-default-100 active:bg-default-200",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 items-center pt-8">
                            <h1 className="text-2xl font-bold text-primary">Welcome to Stock Predects</h1>
                            <p className="text-default-500 font-normal text-sm">Your gateway to AI-powered trading</p>
                        </ModalHeader>
                        <ModalBody className="px-8 pb-8">
                            <Tabs
                                fullWidth
                                size="md"
                                aria-label="Auth Tabs"
                                selectedKey={selected}
                                onSelectionChange={(key) => setSelected(key as string)}
                                color="primary"
                                variant="underlined"
                                classNames={{
                                    cursor: "w-full bg-primary",
                                    tabContent: "group-data-[selected=true]:text-primary font-semibold"
                                }}
                            >
                                <Tab key="login" title="Login">
                                    <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-4">
                                        <Input
                                            label="Email"
                                            labelPlacement="outside"
                                            placeholder="Enter your email"
                                            type="email"
                                            variant="bordered"
                                            startContent={<Mail className="text-default-400 pointer-events-none" size={20} />}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            isRequired
                                            classNames={{ inputWrapper: "h-12 bg-default-100/50" }}
                                        />
                                        <Input
                                            label="Password"
                                            labelPlacement="outside"
                                            placeholder="Enter your password"
                                            type="password"
                                            variant="bordered"
                                            startContent={<Lock className="text-default-400 pointer-events-none" size={20} />}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            isRequired
                                            classNames={{ inputWrapper: "h-12 bg-default-100/50" }}
                                        />
                                        <Button
                                            color="primary"
                                            type="submit"
                                            isLoading={loading}
                                            className="w-full font-semibold shadow-lg shadow-primary/20"
                                            size="lg"
                                        >
                                            Login
                                        </Button>
                                    </form>
                                </Tab>
                                <Tab key="register" title="Sign Up">
                                    <form onSubmit={handleRegister} className="flex flex-col gap-5 mt-4">
                                        <Input
                                            label="Full Name"
                                            labelPlacement="outside"
                                            placeholder="Enter your full name"
                                            type="text"
                                            variant="bordered"
                                            startContent={<User className="text-default-400 pointer-events-none" size={20} />}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            isRequired
                                            classNames={{ inputWrapper: "h-12 bg-default-100/50" }}
                                        />
                                        <Input
                                            label="Email"
                                            labelPlacement="outside"
                                            placeholder="Enter your email"
                                            type="email"
                                            variant="bordered"
                                            startContent={<Mail className="text-default-400 pointer-events-none" size={20} />}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            isRequired
                                            classNames={{ inputWrapper: "h-12 bg-default-100/50" }}
                                        />
                                        <Input
                                            label="Password"
                                            labelPlacement="outside"
                                            placeholder="Create a password"
                                            type="password"
                                            variant="bordered"
                                            startContent={<Lock className="text-default-400 pointer-events-none" size={20} />}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            isRequired
                                            classNames={{ inputWrapper: "h-12 bg-default-100/50" }}
                                        />
                                        <Input
                                            label="Confirm Password"
                                            labelPlacement="outside"
                                            placeholder="Confirm your password"
                                            type="password"
                                            variant="bordered"
                                            startContent={<CheckCircle className="text-default-400 pointer-events-none" size={20} />}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            isRequired
                                            classNames={{ inputWrapper: "h-12 bg-default-100/50" }}
                                        />
                                        <Button
                                            color="primary"
                                            type="submit"
                                            isLoading={loading}
                                            className="w-full font-semibold shadow-lg shadow-primary/20"
                                            size="lg"
                                        >
                                            Create Account
                                        </Button>
                                    </form>
                                </Tab>
                            </Tabs>

                            <div className="flex items-center gap-4 my-6">
                                <Divider className="flex-1" />
                                <span className="text-default-400 text-xs">OR</span>
                                <Divider className="flex-1" />
                            </div>

                            <Button
                                variant="bordered"
                                startContent={<Globe size={20} />}
                                onPress={handleGoogleLogin}
                                className="w-full"
                                size="lg"
                            >
                                Continue with Google
                            </Button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
