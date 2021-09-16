# [zyd-server-build](https://github.com/hfzhae/zyd-server-build)
<p>
  <a href="https://github.com/hfzhae/zyd-server-build/blob/main/LICENSE"><img style="margin-right:5px;" src="https://img.shields.io/badge/license-MIT-grren.svg"></a>
  <a href="https://www.npmjs.com/package/uglify-js"><img style="margin-right:5px;" src="https://img.shields.io/badge/uglifyJs-3.x-blue.svg"></a>
  <a href="https://www.npmjs.com/package/zyd-server-build"><img style="margin-right:5px;" src="https://img.shields.io/badge/npm-passing-yellow.svg"></a>
</p>

## Installation
```
$ npm install -s zyd-server-build
```

## Quickstart
```js
const Zsb = require("zyd-server-build")
const app = new Zsb({
  src: "../", // 源文件夹
  dst: "../build", // 目标文件夹
  noBuildFile: ["..//server/config/index.js"], // 不需要混淆压缩的文件，文件路径前需要包含src的内容，如实例，会被无改动打包到目标文件夹中
  noBuildDir: ["..//server/public/js"]. // 不需要混淆压缩的文件夹，文件路径前需要包含src的内容，如实例，会被无改动打包到目标文件夹中
  ignoreDir: [ // 需要忽略的文件夹，文件夹路径前需要包含src的内容，如实例，忽略后不会被打包到目标文件夹中
    "..//.git", 
    "..//build", 
    "..//server/node_modules", 
  ], 
  ignoreFile: ["..//.gitmodules"], // 需要忽略的文件，文件路径前需要包含src的内容，如实例，忽略后不会被打包到目标文件夹中
  copyright: "Powered by zydsoft™", // 版权申明
}) 
app.build()
```
## License
[MIT](https://github.com/hfzhae/zyd-server-build/blob/main/LICENSE)