// express 服务器入口文件
// node 后端服务器
const userApi = require('./api/userApi');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 后端api路由
app.use('/api/user', userApi);

// 监听端口
app.listen(3000);
console.log('suceess listen at port: 3000......');
