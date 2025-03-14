import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { extname, relative, resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { splitVendorChunkPlugin } from 'vite'
import packageJson from './package.json';

import { fileURLToPath } from 'node:url';
import { glob } from 'glob'

// https://vitejs.dev/config/
const namePackage = packageJson.name;
const nameComponent = 'dev-classes';
const entryPathLib = "src/lib"
export default defineConfig({
  plugins: [
    // libInjectCss(),
    // dts({ include: ['lib/**/!(*.spec|*.test).{ts,tsx}'] }),
    dts({ 
      include: entryPathLib,
      insertTypesEntry: false,
      rollupTypes: false, //  отключает создание единого файла декларации в корне (.d.ts) 
      copyDtsFiles: true , //Включает копирование сгенерированных файлов .d.ts в директорию вывода (dist)
     
    })
  ],
  resolve: {
    alias: {
      "@classes": resolve(__dirname, './src/lib/classes'),
      "@lib": resolve(__dirname, './src/lib/index'),
    }
  },
  server: {
    open: true,
    
  },
  
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, entryPathLib + '/index.ts'),
        // HTTPSApi: resolve(__dirname, entryPathLib + '/classes/HTTPSApi/index.ts')
      },
      formats: ['es'],
      name: nameComponent,
  
    },
    // sourcemap: true,
    rollupOptions: {
      //В пакет не входит external. Пользователь сам это ставит
      // external: ['react', 'react/jsx-runtime', 'react-dom','react-router-dom', 'styled-components'],//, '@emotion/react', '@emotion/styled', '@mui/material'
     
      input: Object.fromEntries(
          glob.sync(entryPathLib + '/**/*.{ts,tsx}').map(file => [
            relative(
              entryPathLib,
              file.slice(0, file.length - extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url))
          ])
        ),
      external:[],
      output: {
        // inlineDynamicImports: false,
        // assetFileNames: 'assets/[name][extname]',
        entryFileNames: (a) => {
          return '[name].[format].js'
        },
        // globals: {
        //   react: 'React',
        //   'react-dom': 'ReactDOM',
        //   "styled-components": "styled"
        // }
      }
    }
  },
})
