# [zyd-server-build](https://github.com/hfzhae/zyd-server-build)
<p>
  <a href="https://github.com/hfzhae/zyd-server-build/blob/main/LICENSE"><img style="margin-right:5px;" src="https://img.shields.io/badge/license-MIT-grren.svg"></a>
  <a href="http://www.jshaman.com/">
  <img style="margin-right:5px;" src="https://img.shields.io/badge/jshaman-blue.svg">
  </a>
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
  ignoreDir: ["client"], // 忽略文件夹
  ignoreFile: ["publicService.js", ".gitmodules"], // 忽略文件
  vipCode: "free", // jshaman 的 vip号码
  copyright: "Powered by zydsoft™"
}) 
app.build()
```
## License
[MIT](https://github.com/hfzhae/zyd-server-build/blob/main/LICENSE)