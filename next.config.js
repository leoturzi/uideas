/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'lh3.googleusercontent.com'],
    },
    experimental: {
        serverComponentsExternalPackages: ['cloudinary', 'graphql-request'],
    },
};

module.exports = nextConfig;
