[toc]

## 待解决问题

- 封装一个类似 element-plus 里的 this.$alert/$message/\$confirm 的全局组件

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
  用`::v-deep`会报 warning：`[@vue/compiler-sfc] ::v-deep usage as a combinator has been deprecated. Use :deep(<inner-selector>) instead.`，按照 warning 改为`:deep(<selector-name>)`

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

### prettier 失效 报 Syntax error

[类似问题](https://developers.weixin.qq.com/community/develop/doc/000e86022282701cceaa6ed385c800)

就是在函数中用`await`的时候，没有加`async`，prettier 会报错

```
const user = await User.findOne();

SyntaxError: Unexpected token, expected ";" (78:21)
```

## 卡了三天的 bug：socket.io 连接问题

首先，`vue-socket.io`和`vue-3-socket.io`都不能用，都是坑（对于 Vue3 来说）

然后。主要问题处在`passport`上。具体原因和更深的原理未知，现在只能根据直觉讲一下大概的问题。

刚开始只用了`passport-jwt`的 jwt 策略，这个策略是没有生成 session 的！因而后面`passport-socket.io`会报`Passport not initialized`的错误，因为 passport 确实没有初始化成功，序列化和反序列化代码根本就没有调用。

怎么发现 passport 没有初始化成功呢？首先是通过 console 的 log，找到`passport-socket.io`报错的代码行，发现这个包在传入的`store: store`（也就是通过`express-mysql-session`生成的`MysqlStore`实例，把 session 相关信息存在表 sessions 里面。报错的代码行是在数据库中找 session 行里的`'passport'`字段。然后直接在数据库中看，发现根本就没有这个字段生成。说明 session 中没有 passport 相关的信息，也就是 passport 的 session 没有生效。

中间还用了另一个连接 mysql 的包`connect-mysql`，不过在看到数据库没有 passport 字段的时候，以为是这个包的问题，所以换成了`express-mysql-session`，结果问题还是存在。不过现在这个包用的人更多，就干脆不改回去了。

经过了好多弯弯坎坎最后发现必须要在`/login`的时候用`passport.authenticate('local')`，生成 sessionID 放到 cookie 中，这个函数才成功调用序列化和反序列化函数，这样才算初始化了 passport。

错误有以下表现：

1. websocket 会一直发 101，浏览器 network 会看到一长串 websocket 的请求和响应；而正确的状况是只有一条 websocket
2. io.on()监听不到 connect 事件
3. passport-socket.io 监听不到 connection 事件
4. 当然前端也监听不到 connect
5. 如果在登录后的状态下，把数据库中的 sessions 表删掉，会突然 connect，上述事件全部响应；但是一旦 logout 然后再 login，问题就再次出现（因为此时数据库又把 sessions 表建回来了，但是为什么没有表反而能 work 就不知道了）
6. 登录跳转 user 首页后，后端会报`Passport is not initialized`

## ！数据库加外键问题！

id 是 unsigned int！！！注意 unsigned！！不是 int！

因此所有 id 的外键都要强调：`type: DataTypes.INTEGER.UNSIGNED`！！！
