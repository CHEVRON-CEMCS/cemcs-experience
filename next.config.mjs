/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'links.papareact.com', 'staging.chevroncemcs.com'], // Add the domain here
  },
};

export default nextConfig;
