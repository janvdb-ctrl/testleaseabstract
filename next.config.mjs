/** @type {import('next').NextConfig} */
const nextConfig = {
  // This repo often lives inside a large personal workspace (Tasks/, Knowledge/, etc.).
  // Watching those trees triggers EMFILE ("too many open files") and breaks `next dev`
  // (404 / flaky responses). Only watch app source and shared code.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/Tasks/**",
          "**/Projects/**",
          "**/Knowledge/**",
          "**/Meetings/**",
          "**/Workflows/**",
          "**/Templates/**",
          "**/Tools/**",
          "**/_temp/**",
          "**/_Registry/**",
          "**/.cursor/**",
          "**/.claude/**",
          "**/agent-transcripts/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
