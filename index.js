/**
 * Powered by zydsoft™
 * 2021-9-14
 * zz
 */
const { builder } = require("./loader")

class ZydBuild {
  constructor({ src, dst, ignoreDir = [], ignoreFile = [], vipCode = "free", copyright = "", delay = 3000 } = {}) {
    this.src = src || "./"
    this.dst = dst || "./build"
    this.ignoreDir = [".git", "build", "node_modules", ...ignoreDir]
    this.ignoreFile = ["build.js", ...ignoreFile]
    this.vipCode = vipCode || "free"
    this.copyright = copyright || ""
    this.delay = delay || 3000
  }

  build() {
    builder({
      src: this.src,
      dst: this.dst,
      ignoreDir: this.ignoreDir,
      ignoreFile: this.ignoreFile,
      vipCode: this.vipCode,
      copyright: this.copyright,
      delay: this.delay,
    })
  }
}

module.exports = ZydBuild
