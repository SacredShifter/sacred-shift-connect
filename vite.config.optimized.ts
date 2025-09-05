import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// Optimized Vite configuration for production
export default defineConfig(({ mode }) => {
  const plugins = [
    react({
      // Enable SWC optimizations
      jsxImportSource: '@emotion/react',
      plugins: mode === 'development' ? [] : [
        // Production-only optimizations
        ['@swc/plugin-emotion', {}]
      ]
    })
  ];

  // Add Sentry plugin for production
  if (mode === 'production' && process.env.SENTRY_AUTH_TOKEN) {
    plugins.push(sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }));
  }

  return {
    plugins,
    
    // Optimized server configuration
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      hmr: mode === 'development' ? {
        port: 5174,
        host: 'localhost'
      } : false,
      watch: mode === 'development' ? {
        ignored: ['**/node_modules/**', '**/dist/**']
      } : {
        ignored: ['**/*']
      },
      cors: {
        origin: mode === 'development' ? ['http://localhost:5173', 'http://127.0.0.1:5173'] : false,
        credentials: true
      }
    },

    // Optimized build configuration
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
            'supabase-vendor': ['@supabase/supabase-js'],
            'animation-vendor': ['framer-motion', 'gsap'],
            '3d-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'audio-vendor': ['tone'],
            'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge']
          },
          // Optimize chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name.split('.').pop();
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(extType)) {
              return `fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          }
        },
        // Tree shaking optimizations
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        }
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      // CSS code splitting
      cssCodeSplit: true,
      // Optimize dependencies
      commonjsOptions: {
        include: [/node_modules/]
      }
    },

    // Optimized resolve configuration
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "events": path.resolve(__dirname, "./src/lib/events-polyfill.ts")
      }
    },

    // Optimized dependency pre-bundling
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        'framer-motion',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        'tone',
        'simple-peer'
      ],
      exclude: ['@vite/client', '@vite/env']
    },

    // Performance optimizations
    esbuild: {
      target: 'esnext',
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      treeShaking: true
    },

    // CSS optimizations
    css: {
      devSourcemap: mode === 'development',
      postcss: {
        plugins: [
          require('autoprefixer'),
          require('tailwindcss')
        ]
      }
    }
  };
});
