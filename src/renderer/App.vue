<template>
    <webview id="wrapper" src="https://mail.google.com/mail/u/0/#inbox" :preload="preload" nodeintegration disablewebsecurity />
</template>

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