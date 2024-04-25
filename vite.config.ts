import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ViteStaticCopyOptions, viteStaticCopy } from 'vite-plugin-static-copy';
//import dts from 'vite-plugin-dts';

const jsToBottomNoModule = () => {
  return {
    name: 'no-attribute',
    transformIndexHtml(html: any) {
      const jss = [];
      const modules = [];
      console.log('');
      //Procura as tags scripts, coleta a propriedade src e remove a tag
      for (const matches of html.matchAll(/<script[^>]*src=['"](.*)['"][^>]*>(.*?)<\/script[^>]*>/g)) {
        const tag = matches[0];
        const src = matches[1];
        if (src.includes('bootloader.js')) {
          continue;
        }

        jss.push(src);

        console.log('SCRIPT TAG REMOVED: ' + tag);
        html = html.replace(tag, '');
      }

      //Procura as tags scripts, coleta a propriedade src e remove a tag
      for (const matches of html.matchAll(/<link[^>]*rel=['"]modulepreload['"][^>]*href=['"](.*)['"][^>]*>/g)) {
        const tag = matches[0];
        const href = matches[1];

        modules.push(href);

        console.log('SCRIPT TAG REMOVED: ' + tag);
        html = html.replace(tag, '');
      }

      console.log(jss);
      console.log(modules);

      html = html.replace('[BOOT_JSS]', JSON.stringify(jss));
      html = html.replace('[BOOT_MODULES]', JSON.stringify(modules));

      return html;
    },
  };
};

const staticCopy: ViteStaticCopyOptions = {
  targets: [{ src: 'src/bootloader.js', dest: '' }],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //
    react(),
    //dts(),
    viteStaticCopy(staticCopy),
    jsToBottomNoModule(),
  ],
  build: {
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
