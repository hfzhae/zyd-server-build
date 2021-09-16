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

function builder({ src = ".", dst, ignoreDir, ignoreFile, copyright = "", noBuildFile = [], noBuildDir = [] }) {
  console.log("Start build...")
  timer[0] = new Date()
  exists(dst)
  copy({ src, dst, ignoreDir, ignoreFile, copyright, noBuildFile, noBuildDir })
  console.log("build success √")
  console.log(`number of files: ${count[0]}`)
  console.log(`confusion number: ${count[1]}`)
  console.log(`size: ${bytesToSize(count[2])}`)
  console.log(`time consuming: ${formatDuration(new Date() - timer[0])}`)
}

function copy({ src, dst, ignoreDir, ignoreFile, copyright = "", noBuildFile = [], noBuildDir = [], confused = 1 }) {
  if (!src) {
    return
  }
  fs.readdirSync(src).forEach(file => {
    const _src = src + "/" + file
    const _dst = dst + "/" + file
    const st = fs.statSync(_src)
    if (st.isFile()) {
      count[2] += st.size
      count[0]++
      if (ignore(ignoreFile, _src)) {
        count[2] -= st.size
        console.log(_src, "=>", _dst, bytesToSize(st.size), "Skip x")
        count[0]--
        return
      }
      if (path.extname(_src) === ".js") {
        if (ignore(noBuildFile, _src) || confused === 0) {
          console.log(_src, "=>", _dst, bytesToSize(st.size), "√")
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
              toplevel: true,
              keep_fnames: true,
              eval: true,
              // properties: true,
            },
            compress: {
              drop_console: true,
              dead_code: true,
              drop_debugger: true,
              hoist_funs: true,
              join_vars: true,
              booleans: true,
              loops: true,
              hoist_vars: true,
              properties: false,
              unsafe_math: true,
              unused: true,
              pure_getters: true,
              keep_fnames: true,
              passes: 10,
              global_defs: {
                DEBUG: false
              }
            },
          });
          fs.writeFileSync(_dst, (copyright ? "/* " + copyright + " */" : "") + result.code)
          console.log(_src, "=>", _dst, bytesToSize(st.size), "Code confused √")
          count[1]++
        }
      } else {
        console.log(_src, "=>", _dst, bytesToSize(st.size), "√")
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
      copy({ src: _src, dst: _dst, ignoreDir, ignoreFile, copyright, noBuildFile, noBuildDir, confused: ignore(noBuildDir, _src) ? 0 : 1 })
    }
  })
}

function ignore(arr, str) {
  let d = false
  arr.forEach(item => {
    item === str && (d = true)
  })
  return d
}

function exists(dst) {
  if (!fs.existsSync(dst)) {
    makeDir(dst)
  } else {
    del(dst)
    makeDir(dst)
  }
}

function makeDir(dirpath) {
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

function del(dst) {
  fs.readdirSync(dst).forEach(path => {
    const _dst = dst + "/" + path
    const st = fs.statSync(_dst)
    if (st.isFile()) {
      fs.unlinkSync(_dst);
    } else if (st.isDirectory()) {
      del(_dst)
      fs.rmdir(_dst, (err) => {
        if (err) {
          // console.error(err)
          return
        }
      })
    }
  })
  fs.rmdir(dst, (err) => {
    if (err) {
      // console.error(err)
      return
    }
  })
}

function bytesToSize(bytes) {
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
function sleep(milliSeconds) {
  const startTime = new Date().getTime()
  while (new Date().getTime() < startTime + milliSeconds) { }
}

function formatDuration(ms) {
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

module.exports = {
  builder
}