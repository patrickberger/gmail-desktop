<template>
    <webview id="wrapper" src="https://mail.google.com/mail/u/0/#inbox" :preload="preload" webpreferences="webSecurity=false" />
</template>

<style lang="less">
  html, body, #wrapper { height: 100% !important; margin: 0; padding: 0; }
</style>

<script type="ts">

  import Vue from 'vue';
  import * as path from 'path';

  export default Vue.extend({
    data: () => {
      return {
        preload: `file://${path.join(__static, 'inject.js')}`
      }
    }
  });

</script>
