## 项目配置问题

- instead of using `import Vue from 'vue'`, use `import {createApp} from 'vue'`

- instead of using `import VueRouter from 'vue-router'`, use `import { createRouter, createWebHashHistory } from 'vue-router';`

- instead of using `npm install vue-router`, use `npm install vue-router@next` or the step2 won't work. But you can stick to the first one and just use the fronter line in step2 to use vue-router.
  [vue3 vue-router tutorial](https://www.vuemastery.com/blog/vue-router-a-tutorial-for-vue-3/)
  [vue3 vuex tutorial](https://dev.to/daniel_adekoya_/how-to-initialize-vuex-in-the-new-vue-3-preview-49ef)

- there's no longer a build folder, just create a `vue.config.js` to manually configure the webpack

- there're some serious compatible issues with sass-loader and webpack. Sass-loader v10+ is needed to solve the problem

## Login 模块问题

- 深度选择器 修改 element 内置样式 `/deep/` -> `::v-deep`

- [provide/inject](https://v3.cn.vuejs.org/guide/component-provide-inject.html#%E5%A4%84%E7%90%86%E5%93%8D%E5%BA%94%E6%80%A7) pass value from parent component to child component

- js 切换图片闪屏问题，`<img>`加载比较慢，导致从 login.vue 到 sign.vue 切换时会闪屏：该用 router-view，不切换图片

- `<el-image>`的 `src` 引入本地图片，必须用 `require('...')`，因为 webpack 打包后会改变本地图片的名称，导致 `src` 找不到提供的路径

## Home 模块问题

### 嵌套命名视图

[嵌套命名视图](https://next.router.vuejs.org/zh/guide/essentials/named-views.html#%E5%B5%8C%E5%A5%97%E5%91%BD%E5%90%8D%E8%A7%86%E5%9B%BE)
给`<router-view>`命名，在同一个页面的不同页面结构中使用不同的组件：注意`components`末尾有个**s**!

/router/index.js:

```
children: [
  {
    path: 'me',
    components: {
      leftSidebar1: FriendChatList,
      mainCentral: FriendChatBox,
    },
  },
  {
    path: 'channels',
    components: { leftSidebar1: RoomList, mainCentral: RoomChatBox },
  },
],
```

### 布局问题

home page 布局，在 main-area 想设置左右两个布局，左边自适应宽度并且规定最小宽度，右边固定宽度，一旦左右整体空间剩余宽度小于右边的固定宽度，则右边消失

- 本来以为是 flex 布局做的，结果看 Discord 源码，她们是用 media query 做的
