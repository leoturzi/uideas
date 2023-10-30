import { getServerSession } from 'next-auth/next';
import { NextAuthOptions, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';
import { SessionInterface, UserProfile } from '@/common.types';

import { createUser, getUser } from './actions';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    jwt: {
        encode: ({ secret, token }) => {
            // Used to encode the JWT access token when connecting to grafbase
            const encodedToken = jsonwebtoken.sign(
                {
                    ...token,
                    issuer: 'grafbase',
                    expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day
                },
                secret
            );
            return encodedToken;
        },
        decode: ({ secret, token }) => {
            // Used to encode the JWT access token when connecting to grafbase
            const decodedToken = jsonwebtoken.verify(token!, secret);
            return decodedToken as JWT;
        },
    },
    theme: {
        colorScheme: 'light',
        logo: '/logo.svg',
    },
    callbacks: {
        async session({ session, token, user }) {
            // if there is an existing user, we want to return the user info
            // this info is not just google info, but also the info we have in our database
            const email = session?.user?.email as string;
            try {
                const data = (await getUser(email)) as { user?: UserProfile };
                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...data?.user,
                    },
                };
                return newSession;
            } catch (error: any) {
                console.log('error  retriving user data', error);
                return session;
            }
        },
        async signIn({ user }: { user: AdapterUser | User }) {
            // triggers every time a user signs in
            try {
                const userExists = (await getUser(user?.email as string)) as {
                    user?: UserProfile;
                };

                if (!userExists.user) {
                    await createUser(
                        user.name as string,
                        user.email as string,
                        user.image as string
                    );
                }
                return true;
            } catch (error: any) {
                console.error(error);
                return false;
            }
        },
    },
};

export async function getCurrentUser() {
    // Session interface extends the Session interface adding
    // in this case, google info
    const session = (await getServerSession(authOptions)) as SessionInterface;

    return session;
}
