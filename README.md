# chat-room-web

Vue3, Node.js, Express, Socket.io, Element plus

## Project setup

```
npm install
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

## Project start

### 启动前端

进入 `chat-room-web/client` 文件夹：

```shell
cd client
```

检查 node 环境：

```shell
node -v
```

如果 node 版本不是 16 或以下，则切换：

```shell
nvm use 16
```

执行：

```shell
npm run serve
```

看到：

```shell
  ...
  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.50.101:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```

成功启动前端。

### 启动后端

进入 `chat-room-web/server` 文件夹：

```shell
cd server
```

执行：

```shell
docker compose up -d
```

看到：

```shell
...
mysql connection success
...
All tables sync success
```

成功启动后端。

## 测试数据

用户名：13300000001

密码：test
