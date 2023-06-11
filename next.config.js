/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    transpilePackages: ['@react-three/postprocessing'],
};

module.exports = nextConfig;
