1. instead of using `import Vue from 'vue'`, use `import {createApp} from 'vue'`
2. instead of using `import VueRouter from 'vue-router'`, use `import { createRouter, createWebHashHistory } from 'vue-router';`
3. instead of using `npm install vue-router`, use `npm install vue-router@next` or the step2 won't work. But you can stick to the first one and just use the fronter line in step2 to use vue-router.
   [vue3 vue-router tutorial](https://www.vuemastery.com/blog/vue-router-a-tutorial-for-vue-3/)
   [vue3 vuex tutorial](https://dev.to/daniel_adekoya_/how-to-initialize-vuex-in-the-new-vue-3-preview-49ef)
4. there's no longer a build folder, just create a `vue.config.js` to manually configure the webpack
