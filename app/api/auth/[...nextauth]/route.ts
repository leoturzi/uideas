import NextAuth from 'next-auth/next';

import { authOptions } from '@/lib/session';

const handler = NextAuth(authOptions);

// allow us to use nextAuth for both GET and POST requests
export { handler as GET, handler as POST };
