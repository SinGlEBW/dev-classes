import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { extname, relative, resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { splitVendorChunkPlugin } from 'vite'
import packageJson from './package.json';

import { fileURLToPath } from 'node:url';



const namePackage = packageJson.name;
const entryPathLib = "src/lib"
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dts({ include: entryPathLib }),
    libInjectCss()
  ],
  resolve: {
    alias: {
      "@classes": resolve(__dirname, `./${entryPathLib}/classes`),
      "@lib": resolve(__dirname, `./${entryPathLib}/index`),
    }
  },
  server: { open: true },
  css: {
    modules: { localsConvention: 'camelCase' }
  },
  build: {
    copyPublicDir: false,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: entryPathLib + '/index.ts',
    
      },
      formats: ['es'],
      name: namePackage,
  
    },
    rollupOptions: {
      external: [
        "react/jsx-runtime",
        /^@mui\/.*/,
        /^@emotion\/.*/,
        ...Object.keys(packageJson.peerDependencies)
      ],
 
      output: {
        entryFileNames: '[name].js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          "styled-components": "styled"
        }
      }
    }
  },
})
