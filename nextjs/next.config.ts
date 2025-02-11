// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   compress: false,
//   optimization: {
//     minimize: false,
//   },
//   swcMinify: false, // Disables SWC minification
//   webpack: (config) => {
//     if (config.mode === 'production') {
//       config.optimization.minimize = false; // Ensures Webpack doesn't minify JS
//     }
//     return config;
//   },
// };

module.exports = {
  output: "export",
  optimization: {
    minimize: false,
  }
};

// export default nextConfig;
