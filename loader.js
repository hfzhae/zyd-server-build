/**
 * Powered by zydsoft™
 * 2021-9-14
 * zz
 */
const axios = require("axios")
const fs = require("fs")

function builder({ src = ".", dst, ignoreDir, ignoreFile }) {
  exists(dst)
  copy({ src, dst, ignoreDir, ignoreFile })
}

function copy({ src, dst, ignoreDir, ignoreFile }) {
  fs.readdirSync(src).forEach(path => {
    const _src = dir + "/" + path
    const _dst = dst + "/" + path
    const st = fs.statSync(_src)
    if (st.isFile()) {
      if (ignoreFile == path) {
        return
      }
      // 创建读取流
      readable = fs.createReadStream(_src);
      // 创建写入流
      writable = fs.createWriteStream(_dst);
      // 通过管道来传输流
      readable.pipe(writable);
    } else if (st.isDirectory()) {
      if (ignoreDir == path) {
        return
      }
      exists(dst)
      copy({ _src, _dst, ignoreDir, ignoreFile })
    }
  })
}

function exists(dst) {
  if (fs.existsSync(dst)) {
    fs.mkdirSync(dst)
  } else {
    del(dst)
    fs.mkdirSync(dst)
  }
}

function del(dst) {
  fs.readdirSync(src).forEach(path => {
    const _dst = dst + "/" + path
    const st = fs.statSync(_dst)
    if (st.isFile()) {
      fs.unlinkSync(_dst);
    } else if (st.isDirectory()) {
      del(_dst)
      fs.rmdir(_dst, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
  fs.rmdir(_dst, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
}

module.exports = {
  builder
}