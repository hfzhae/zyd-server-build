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
    copyright = "",
    noBuildFile = []
  } = {}) {
    this.src = src || "./"
    this.dst = dst || "./build"
    this.ignoreDir = ignoreDir || []
    this.ignoreFile = ignoreFile || []
    this.copyright = copyright || ""
    this.noBuildFile = noBuildFile || []
  }

  build() {
    builder({
      src: this.src,
      dst: this.dst,
      ignoreDir: this.ignoreDir,
      ignoreFile: this.ignoreFile,
      copyright: this.copyright,
      noBuildFile: this.noBuildFile,
    })
  }
}

module.exports = ZydBuild
