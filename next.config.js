/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "http", hostname: "books.google.com" },
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
};

module.exports = nextConfig;
