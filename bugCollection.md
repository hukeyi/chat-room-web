### 项目配置问题

- instead of using `import Vue from 'vue'`, use `import {createApp} from 'vue'`

- instead of using `import VueRouter from 'vue-router'`, use `import { createRouter, createWebHashHistory } from 'vue-router';`

- instead of using `npm install vue-router`, use `npm install vue-router@next` or the step2 won't work. But you can stick to the first one and just use the fronter line in step2 to use vue-router.
  [vue3 vue-router tutorial](https://www.vuemastery.com/blog/vue-router-a-tutorial-for-vue-3/)
  [vue3 vuex tutorial](https://dev.to/daniel_adekoya_/how-to-initialize-vuex-in-the-new-vue-3-preview-49ef)

- there's no longer a build folder, just create a `vue.config.js` to manually configure the webpack

- there're some serious compatible issues with sass-loader and webpack. Sass-loader v10+ is needed to solve the problem

### Login 模块问题

- 深度选择器 修改 element 内置样式 `/deep/` -> `::v-deep`

- [provide/inject](https://v3.cn.vuejs.org/guide/component-provide-inject.html#%E5%A4%84%E7%90%86%E5%93%8D%E5%BA%94%E6%80%A7) pass value from parent component to child component

- js 切换图片闪屏问题，`<img>`加载比较慢，导致从 login.vue 到 sign.vue 切换时会闪屏：该用 router-view，不切换图片

- `<el-image>`的 `src` 引入本地图片，必须用 `require('...')`，因为 webpack 打包后会改变本地图片的名称，导致 `src` 找不到提供的路径
