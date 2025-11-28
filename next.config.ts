import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable turbopack configuration for Next.js 16+
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    // Exclude TensorFlow and MediaPipe from server-side bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@tensorflow/tfjs': 'commonjs @tensorflow/tfjs',
        '@tensorflow/tfjs-core': 'commonjs @tensorflow/tfjs-core',
        '@tensorflow/tfjs-backend-webgl': 'commonjs @tensorflow/tfjs-backend-webgl',
        '@tensorflow-models/hand-pose-detection': 'commonjs @tensorflow-models/hand-pose-detection',
        '@mediapipe/hands': 'commonjs @mediapipe/hands',
      });
    }
    
    // Fix for canvas module (used by TensorFlow.js)
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };

    return config;
  },
};

export default nextConfig;
