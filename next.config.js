
/**@type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  // output: "export",
  reactStrictMode: false,
  trailingSlash: true,
  swcMinify: true,
  basePath: isProd ? "" : undefined,
  assetPrefix: isProd ? "" : undefined,
  images: {
    loader: "imgix",
    path: "/",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
