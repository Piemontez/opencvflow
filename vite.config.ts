import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ViteStaticCopyOptions, viteStaticCopy } from 'vite-plugin-static-copy';
//import dts from 'vite-plugin-dts';

const isProduction = process.env.NODE_ENV == 'production';
const scriptSearch = '[BOOT_SCRIPT_MODULE]';
const moduleSearch = '[BOOT_LINK_MODULE]';

/**
 * Coleta as tag scripts e adicionado em uma variavel do json no HTML do projeto
 * @returns
 */
const jsToBottomNoModule = () => {
  return {
    name: 'no-attribute',
    transformIndexHtml(html: any) {
      const jss = [];
      const modules = [];
      //Procura as tags scripts, coleta a propriedade src e remove a tag
      for (const matches of html.matchAll(/<script[^>]*src=['"](.*)['"][^>]*>(.*?)<\/script[^>]*>/g)) {
        const tag = matches[0];
        const src = matches[1];
        if (src.includes('bootloader.js')) {
          continue;
        }

        jss.push(src);

        html = html.replace(tag, '');
      }

      //Procura as tags scripts, coleta a propriedade src e remove a tag
      for (const matches of html.matchAll(/<link[^>]*rel=['"]modulepreload['"][^>]*href=['"](.*)['"][^>]*>/g)) {
        const tag = matches[0];
        const href = matches[1];

        modules.push(href);

        html = html.replace(tag, '');
      }

      return html //
        .replace(scriptSearch, JSON.stringify(jss))
        .replace(moduleSearch, JSON.stringify(modules));
    },
  };
};

const staticCopy: ViteStaticCopyOptions = {
  targets: [{ src: 'src/bootloader.js', dest: 'src' }],
};

const clearProdBootLoaderVariables = () => {
  return {
    name: 'no-attribute',
    transformIndexHtml(html: any) {
      return html //
        .replace(scriptSearch, '[]')
        .replace(moduleSearch, '[]');
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //
    react(),
    //dts(),
    viteStaticCopy(staticCopy),
    isProduction ? jsToBottomNoModule() : clearProdBootLoaderVariables(),
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          monacoeditor: ['@monaco-editor/react'],
          opencvts: ['opencv-ts'],
        },
        entryFileNames: '[name]_[hash].js',
        chunkFileNames: 'deps/[name].js',
      },
    },
  },
});
