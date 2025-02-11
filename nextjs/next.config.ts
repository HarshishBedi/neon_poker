import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  swcMinify: false, // Disables SWC minification
  webpack: (config) => {
    if (config.mode === 'production') {
      config.optimization.minimize = false; // Ensures Webpack doesn't minify JS
    }
    return config;
  },
};

module.exports = {
  output: "export",
};

export default nextConfig;
