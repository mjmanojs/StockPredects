'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, auth } from '@/lib/auth';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, Divider } from "@nextui-org/react";
import { Mail, Lock, Globe } from 'lucide-react';
import Link from 'next/link';

interface LoginModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export default function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            onOpenChange(); // Close modal
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
                base: "bg-content1/80 backdrop-blur-md",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 items-center pt-8">
                            <h1 className="text-2xl font-bold">Welcome Back</h1>
                            <p className="text-default-500 font-normal text-sm">Sign in to access your portfolio</p>
                        </ModalHeader>
                        <ModalBody className="px-8 pb-8">
                            <form onSubmit={handleLogin} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-default-700">Email Address</label>
                                    <Input
                                        placeholder="Enter your email"
                                        type="email"
                                        variant="bordered"
                                        startContent={<Mail className="text-default-400 pointer-events-none" size={20} />}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        isRequired
                                        classNames={{
                                            inputWrapper: "h-12 bg-default-100/50",
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-default-700">Password</label>
                                    <Input
                                        placeholder="Enter your password"
                                        type="password"
                                        variant="bordered"
                                        startContent={<Lock className="text-default-400 pointer-events-none" size={20} />}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        isRequired
                                        classNames={{
                                            inputWrapper: "h-12 bg-default-100/50",
                                        }}
                                    />
                                </div>

                                <Button
                                    color="primary"
                                    type="submit"
                                    isLoading={loading}
                                    className="w-full font-semibold bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20"
                                    size="lg"
                                >
                                    Sign In
                                </Button>
                            </form>

                            <div className="flex items-center gap-4 my-4">
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

                            <div className="mt-4 text-center text-sm text-default-500">
                                Don't have an account? <Link href="/register" className="text-primary hover:underline" onClick={onClose}>Sign up</Link>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
