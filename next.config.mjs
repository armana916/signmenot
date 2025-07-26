/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
module.exports = {
  i18n: {
    locales: ['en', 'es', 'fr', 'de'], // Add any languages you want to support
    defaultLocale: 'en',
  },
};
