/**
 * Powered by zydsoft™
 * 2021-9-14
 * zz
 */
const { builder } = require("./loader")

class ZydBuild {
  constructor({
    src,
    dst,
    ignoreDir = [],
    ignoreFile = [],
    vipCode = "free",
    copyright = "",
    delay = 3000,
    config = {},
    noBuildFile = []
  } = {}) {
    this.src = src || "./"
    this.dst = dst || "./build"
    this.ignoreDir = ignoreDir || []
    this.ignoreFile = ignoreFile || []
    this.vipCode = vipCode || "free"
    this.copyright = copyright || ""
    this.delay = delay || 5000
    this.config = config || {}
    this.noBuildFile = noBuildFile || []
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
      config: this.config,
      noBuildFile: this.noBuildFile,
    })
  }
}

module.exports = ZydBuild
