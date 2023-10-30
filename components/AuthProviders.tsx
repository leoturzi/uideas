'use client';

import { authOptions } from '@/lib/session';
import { getServerSession } from 'next-auth';
import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Define the provider type that will be used in the state
type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
};

type Providers = Record<string, Provider>;

export function AuthProviders() {
    // the provider can have a Provider type or null
    const [providers, setProviders] = useState<Providers | null>(null);

    useEffect(() => {
        const getProvidersData = async () => {
            const providers = await getProviders();
            setProviders(providers);
        };

        getProvidersData();
    }, []);

    if (!providers) return null;

    return (
        <div className='flexCenter gap-4'>
            {Object.values(providers).map((provider: Provider, providerIdx) => (
                <button
                    key={providerIdx}
                    className='btn btn-primary'
                    onClick={() => signIn(provider?.id)}
                >
                    {provider.name}
                </button>
            ))}
        </div>
    );
}
