/**
 * Powered by zydsoft™
 * 2021-9-14
 * zz
 */
const { builder } = require("./loader")

class ZydBuild {
  constructor({ src, dst, ignoreDir = [], ignoreFile = [] } = {}) {
    this.src = src || "./"
    this.dst = dst || "./build"
    this.ignoreDir = [".git", "build", "node_modules", ...ignoreDir]
    this.ignoreFile = ["build.js", ...ignoreFile]
    this.vipCode = "free"
  }

  build() {
    builder({
      src: this.src,
      dst: this.dst,
      ignoreDir: this.ignoreDir,
      ignoreFile: this.ignoreFile,
      vipCode: this.vipCode
    })
  }
}

module.exports = ZydBuild
