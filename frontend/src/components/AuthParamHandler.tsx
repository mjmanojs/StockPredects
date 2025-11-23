'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface AuthParamHandlerProps {
    onOpen: () => void;
}

export default function AuthParamHandler({ onOpen }: AuthParamHandlerProps) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const auth = searchParams.get('auth');
        if (auth === 'login' || auth === 'register') {
            // Small delay to ensure modal is ready/mounted
            setTimeout(() => {
                onOpen();
            }, 100);
        }
    }, [searchParams, onOpen]);

    return null;
}
