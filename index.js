/**
 * Powered by zydsoft™
 * 2021-9-14
 * zz
 */
const { builder } = require("./loader")

class ZydBuild {
  constructor(conf) {
    this.src = conf.src || "."
    this.dst = conf.dst || "./build/server"
    this.ignoreDir = ["node_modules", ...conf.ignoreDir]
    this.ignoreFile = ["build.js", ...conf.ignoreFile]
  }

  build() {
    builder({
      src: this.src,
      dst: this.dst,
      ignoreDir: this.ignoreDir,
      ignoreFile: this.ignoreFile
    })
  }
}

module.exports = ZydBuild
