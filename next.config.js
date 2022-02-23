const withPWA = require("next-pwa")
const runtimeCaching = require("next-pwa/cache")
const prod = process.env.NODE_ENV === "production"

/** @type {import('next').NextConfig} */
const nextConfig = {
  pwa: {
    dest: "public",
    runtimeCaching,
    disable: !process.env.ENABLE_PWA && !prod,
    register: false,
    skipWaiting: false,
    publicExcludes: ["!noprecache/**/*", "!vendor/**/*"],
  },
  webpack(config, { dev, isServer }) {
    // Replace React with Preact in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      })
    }

    config.experiments = config.experiments || {}
    Object.assign(config.experiments, {
      asyncWebAssembly: true,
    })

    return config
  },
}

module.exports = withPWA(nextConfig)
