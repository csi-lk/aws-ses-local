import fs from 'fs'

const mkdirSync = function mkdirSync(path) {
  try {
    fs.mkdirSync(path)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}

export default mkdirSync