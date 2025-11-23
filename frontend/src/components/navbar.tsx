'use client';

import { Button, useDisclosure, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link as NextUILink } from "@nextui-org/react";
import { auth, onAuthStateChanged, signOut } from '@/lib/auth';
import { User } from 'firebase/auth';
import CustomAuthModal from './CustomAuthModal';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();
    const { isOpen: isAuthOpen, onOpen: onAuthOpen, onOpenChange: onAuthOpenChange } = useDisclosure();

    useEffect(() => {
        setMounted(true);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (!mounted) return null;

    const navLinks = [
        { href: '/stocks', label: 'Stocks' },
        { href: '/ipo', label: 'IPO' },
        { href: '/mutual-funds', label: 'Mutual Funds' },
        { href: '/bonds', label: 'Bonds' },
        { href: '/govt-bonds', label: 'Govt Bonds' },
        { href: '/commodities', label: 'Commodities' },
    ];

    return (
        <>
            <CustomAuthModal isOpen={isAuthOpen} onOpenChange={onAuthOpenChange} />
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center space-x-2 font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        <span>Stock Predects</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-default-500"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        color="primary"
                                        name={user.displayName || "User"}
                                        size="sm"
                                        src={user.photoURL || undefined}
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat">
                                    <DropdownItem key="profile" className="h-14 gap-2">
                                        <p className="font-semibold">Signed in as</p>
                                        <p className="font-semibold">{user.email}</p>
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <Button
                                onPress={onAuthOpen}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/20"
                                variant="shadow"
                                radius="full"
                                size="md"
                            >
                                Login
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-default-500"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-default-500">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-b border-white/10 bg-background/95 backdrop-blur-xl overflow-hidden"
                        >
                            <div className="flex flex-col space-y-4 p-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {!user && (
                                    <Button
                                        color="primary"
                                        variant="solid"
                                        onPress={() => {
                                            setIsOpen(false);
                                            onAuthOpen();
                                        }}
                                        className="w-full font-semibold bg-gradient-to-r from-green-600 to-emerald-600"
                                        radius="full"
                                    >
                                        Login
                                    </Button>
                                )}
                                {user && (
                                    <Button
                                        color="danger"
                                        variant="flat"
                                        onPress={() => {
                                            setIsOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full font-semibold"
                                        radius="full"
                                    >
                                        Log Out
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}
