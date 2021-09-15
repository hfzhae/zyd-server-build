/**
 * Powered by zydsoft™
 * 2021-9-14
 * zz
 */
const axios = require("axios")
const fs = require("fs")
const path = require("path")
let t = 0

function builder({ src = ".", dst, ignoreDir, ignoreFile, vipCode = "free", copyright = "", delay = 3000, config }) {
  console.log("Start build")
  exists(dst)
  copy({ src, dst, ignoreDir, ignoreFile, vipCode, copyright, delay, config })
}

function copy({ src, dst, ignoreDir, ignoreFile, vipCode = "free", copyright = "", delay = 3000, config = {} }) {
  if (!src) {
    return
  }
  fs.readdirSync(src).forEach(async file => {
    const _src = src + "/" + file
    const _dst = dst + "/" + file
    const st = fs.statSync(_src)
    if (st.isFile()) {
      if (ignore(ignoreFile, file)) {
        return
      }
      if (path.extname(_src) === ".js") {
        t += delay
        await setTimeout(async () => {
          readable = fs.readFileSync(_src, 'utf-8')
          const res = await axios.post('https://www.jshaman.com:4430/submit_js_code/', {
            js_code: readable,
            vip_code: vipCode,
            config: config
          })
          console.log("build file:", _src, "=>", _dst, bytesToSize(st.size), res.data.message)
          if (res.data && res.data.status === 0) {
            fs.writeFileSync(_dst, (copyright ? "/* " + copyright + " */" : "") + res.data.content.substring(29, res.data.content.length))
          }
        }, t);
      } else {
        console.log("build file:", _src, "=>", _dst, bytesToSize(st.size))
        // 创建读取流
        readable = fs.createReadStream(_src);
        // 创建写入流
        writable = fs.createWriteStream(_dst);
        // 通过管道来传输流
        readable.pipe(writable);
      }
    } else if (st.isDirectory()) {
      if (ignore(ignoreDir, file)) {
        return
      }
      makeDir(_dst)
      copy({ src: _src, dst: _dst, ignoreDir, ignoreFile, vipCode, copyright, delay, config })
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

module.exports = {
  builder
}