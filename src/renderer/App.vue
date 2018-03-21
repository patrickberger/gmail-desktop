<template>
    <webview id="wrapper" src="https://mail.google.com/mail/u/0/#inbox" :preload="preload" webpreferences="webSecurity=false" />
</template>

<style lang="less">
  html, body, #wrapper { height: 100% !important; margin: 0; padding: 0; }
</style>

<script type="ts">

  import Vue from 'vue';
  import * as path from 'path';

  // @see https://github.com/electron-userland/electron-webpack/issues/52
  // eslint-disable-next-line no-process-env
  const isDevelopment = process.env.NODE_ENV === 'development';
  const staticPath = isDevelopment ? __static : __dirname.replace(/app\.asar$/, 'static').replace(/\\/g, '\\\\');
  const injectScript = path.join(staticPath, 'inject.js');

  export default Vue.extend({
    data: () => {
      return {
        preload: `file://${injectScript}`
      }
    }
  });

</script>
