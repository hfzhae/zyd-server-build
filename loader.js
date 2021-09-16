/**
 * Powered by zydsoft™
 * 2021-9-14
 * zz
 */
const UglifyJS = require("uglify-js")
const fs = require("fs")
const path = require("path")

function builder({ src = ".", dst, ignoreDir, ignoreFile, copyright = "", noBuildFile = [] }) {
  console.log("Start build")
  exists(dst)
  copy({ src, dst, ignoreDir, ignoreFile, copyright, noBuildFile })
}

function copy({ src, dst, ignoreDir, ignoreFile, copyright = "", noBuildFile = [] }) {
  if (!src) {
    return
  }
  fs.readdirSync(src).forEach(file => {
    const _src = src + "/" + file
    const _dst = dst + "/" + file
    const st = fs.statSync(_src)
    if (st.isFile()) {
      if (ignore(ignoreFile, _src)) {
        return
      }
      if (path.extname(_src) === ".js") {
        if (ignore(noBuildFile, _src)) {
          console.log("build file:", _src, "=>", _dst, bytesToSize(st.size))
          readable = fs.createReadStream(_src);
          writable = fs.createWriteStream(_dst);
          readable.pipe(writable);
        } else {
          readable = fs.readFileSync(_src, 'utf-8')
          const result = UglifyJS.minify(readable, {
            mangle: { toplevel: true, keep_fnames: true, eval: true },
          });
          fs.writeFileSync(_dst, (copyright ? "/* " + copyright + " */" : "") + result)
          console.log("build file:", _src, "=>", _dst, bytesToSize(st.size), "JS代码已混淆")
        }
      } else {
        console.log("build file:", _src, "=>", _dst, bytesToSize(st.size))
        readable = fs.createReadStream(_src);
        writable = fs.createWriteStream(_dst);
        readable.pipe(writable);
      }
    } else if (st.isDirectory()) {
      if (ignore(ignoreDir, _src)) {
        return
      }
      makeDir(_dst)
      copy({ src: _src, dst: _dst, ignoreDir, ignoreFile, copyright, noBuildFile })
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