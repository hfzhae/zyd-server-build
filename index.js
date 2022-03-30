/**
 * Powered by zydsoft™
 * 2021-9-14
 * zz
 */
const UglifyJS = require("uglify-js")
const fs = require("fs")
const path = require("path")
const count = [0, 0, 0]
const timer = []

function build ({ src, dst, ignoreDir = [], ignoreFile = [], copyright = "", noBuildFile = [], noBuildDir = [], confused = 1 }) {
  if (!src || !dst) {
    return
  }
  ignoreDir.length > 0 && ignoreDir.push(dst)
  fs.readdirSync(src).forEach(file => {
    const _src = src + "/" + file
    const _dst = dst + "/" + file
    const st = fs.statSync(_src)
    if (st.isFile()) {
      count[2] += st.size
      count[0]++
      if (ignore(ignoreFile, _src)) {
        count[2] -= st.size
        console.log(_src, "\x1B[36m=>\x1B[0m", _dst, `\x1B[33m${bytesToSize(st.size)}\x1B[0m`, "\x1B[31mSkip x\x1B[0m")
        count[0]--
        return
      }
      if (path.extname(_src) === ".js") {
        if (ignore(noBuildFile, _src) || confused === 0) {
          console.log(_src, "\x1B[36m=>\x1B[0m", _dst, `\x1B[33m${bytesToSize(st.size)}\x1B[0m`, "\x1B[32m√\x1B[0m")
          readable = fs.createReadStream(_src);
          writable = fs.createWriteStream(_dst);
          readable.pipe(writable);
        } else {
          readable = fs.readFileSync(_src, 'utf-8')
          const result = UglifyJS.minify(readable, {
            output: {
              ascii_only: true,
            },
            mangle: {
              toplevel: true, // 干掉顶层作用域中没有被引用的函数 ("funcs")和/或变量("vars") (默认是false , true 的话即函数变量都干掉)
              keep_fnames: true, // 默认 false。传 true来防止压缩器干掉函数名。对那些依赖
              eval: true, // 混淆那些在with或eval中出现的名字（默认禁用）。
            },
            compress: {
              drop_console: true, // 删除console
              dead_code: true, // 移除没被引用的代码
              drop_debugger: true, // 移除 debugger;
              hoist_funs: true, // 提升函数声明
              join_vars: true, // 合并连续 var 声明
              booleans: true, // 优化布尔运算，例如 !!a? b : c → a ? b : c
              loops: true, // 当do、while 、 for循环的判断条件可以确定是，对其进行优化。
              hoist_vars: true, //  (默认 false) -- 提升 var 声明 (默认是false,因为那会加大文件的size)
              properties: false, // (默认 false) — 传一个对象来自定义指明混淆对象属性的选项。
              unsafe_math: true, // (默认 false) -- 优化数字表达式，例如2 * x * 3 变成 6 * x, 可能会导致不精确的浮点数结果。
              unused: true, //  干掉没有被引用的函数和变量。（除非设置"keep_assign"，否则变量的简单直接赋值也不算被引用。）
              pure_getters: true, // 默认是 false. 如果你传入true，UglifyJS会假设对象属性的引用（例如foo.bar 或 foo["bar"]）没有函数副作用。
              keep_fnames: true, // 默认 false。传 true来防止压缩器干掉函数名。对那些依赖
              passes: 10, // 默认 1。运行压缩的次数。在某些情况下，用一个大于1的数字参数可以进一步压缩代码大小。注意：数字越大压缩耗时越长。
              global_defs: {
                DEBUG: false
              }
            },
          });
          fs.writeFileSync(_dst, (copyright ? "/* " + copyright + " */" : "") + result.code)
          console.log(_src, "\x1B[36m=>\x1B[0m", _dst, `\x1B[33m${bytesToSize(st.size)}\x1B[0m`, "\x1B[32mCode confused √\x1B[0m")
          count[1]++
        }
      } else {
        console.log(_src, "\x1B[36m=>\x1B[0m", _dst, `\x1B[33m${bytesToSize(st.size)}\x1B[0m`, "\x1B[32m√\x1B[0m")
        readable = fs.createReadStream(_src);
        writable = fs.createWriteStream(_dst);
        readable.pipe(writable);
      }
      // sleep(100)
      // count[3] += fs.statSync(_dst).size
    } else if (st.isDirectory()) {
      if (ignore(ignoreDir, _src)) {
        return
      }
      makeDir(_dst)
      build({ src: _src, dst: _dst, ignoreDir, ignoreFile, copyright, noBuildFile, noBuildDir, confused: ignore(noBuildDir, _src) ? 0 : 1 })
    }
  })
}

function ignore (arr, str) {
  let d = false
  arr.forEach(item => {
    item === str && (d = true)
  })
  return d
}

function exists (dst, noDeleteDir) {
  if (!fs.existsSync(dst)) {
    makeDir(dst)
  } else {
    // del(dst)
    delDir(dst, noDeleteDir)
    // makeDir(dst)
  }
}

function makeDir (dirpath) {
  if (!fs.existsSync(dirpath)) {
    var pathtmp;
    dirpath.split("/").forEach(dirname => {
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname);
      }
      else {
        //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
        if (dirname) {
          pathtmp = dirname;
        } else {
          pathtmp = "/";
        }
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp)) {
          return false;
        }
      }
    });
    // } else {
    // deleteFolderFiles(dirpath);
  }
  return true;
}

const delDir = (url, noDeleteDir) => {
  var files = []
  files = fs.readdirSync(url)
  for (var i = 0; i < files.length; i++) {
    if (!noDeleteDir.find(item => item === files[i])) {
      var path = url + '/' + files[i]
      if (fs.statSync(path).isFile()) {
        fs.unlinkSync(path)
      } else {
        delDir(path, noDeleteDir)
      }
    }
  }
}


function bytesToSize (bytes) {
  if (bytes === 0) return '0 B';
  var k = 1024;
  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  i = Math.floor(Math.log(bytes) / Math.log(k))
  //return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  //toPrecision(3) 后面保留两位小数，如1.00GB  
}

/**
 * 阻塞函数
 * @param {Number} milliSeconds 毫秒数 
 */
function sleep (milliSeconds) {
  const startTime = new Date().getTime()
  while (new Date().getTime() < startTime + milliSeconds) { }
}

function formatDuration (ms) {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000
  };
  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
}

module.exports = ({
  src = ".",
  dst = "./build",
  ignoreDir = ["./.git", "./node_modules"],
  ignoreFile = ["./build.js"],
  copyright = "",
  noBuildFile = [],
  noBuildDir = [],
  noDeleteDir = [".git", "node_modules"],
} = {}) => {
  console.log(`\x1B[33m
 ┌─────────────────────┐
 │ Powered by zydsoft™ │
 │  zyd-server-build   │
 └─────────────────────┘
 \x1B[0m`)
  console.log("\x1B[36m\x1B[1mStart build...\x1B[0m\x1B[0m")
  timer[0] = new Date()
  exists(dst, noDeleteDir)
  build({ src, dst, ignoreDir, ignoreFile, copyright, noBuildFile, noBuildDir })
  console.log("")
  console.log(`number of files: \x1B[36m${count[0]}\x1B[0m`)
  console.log(`confusion number: \x1B[36m${count[1]}\x1B[0m`)
  console.log(`size: \x1B[36m${bytesToSize(count[2])}\x1B[0m`)
  console.log(`time consuming: \x1B[36m${formatDuration(new Date() - timer[0])}\x1B[0m`)
  // console.log("\x1B[1m\x1B[32mbuild success √\x1B[0m\x1B[0m")
  console.log(`\x1B[1m\x1B[32m
 ┌─────────────────┐
 │ build success √ │
 └─────────────────┘
 \x1B[0m\x1B[0m`)
}