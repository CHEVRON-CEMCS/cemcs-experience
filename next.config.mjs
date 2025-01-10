/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'links.papareact.com', 'staging.chevroncemcs.com', 'shop.chevroncemcs.com', 'i.ibb.co'], // Add the domain here
  },
};

export default nextConfig;
