import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const apiBaseUrl = env.VITE_API_BASE_URL
    || (mode === "development" ? "http://localhost:5050/api" : "");
  const apiOrigin = apiBaseUrl ? new URL(apiBaseUrl).origin : null;
  const preconnectTags = [
    {
      tag: "link",
      attrs: {
        rel: "preconnect",
        href: "https://image.tmdb.org",
      },
      injectTo: "head-prepend",
    },
  ];

  if (apiOrigin) {
    preconnectTags.unshift({
      tag: "link",
      attrs: {
        rel: "preconnect",
        href: apiOrigin,
        crossorigin: "use-credentials",
      },
      injectTo: "head-prepend",
    });
  }

  return {
    plugins: [
      react(),
      {
        name: "mediavault-preconnects",
        transformIndexHtml: {
          order: "pre",
          handler: () => preconnectTags,
        },
      },
    ],
  };
})
