import fs from 'fs'

const mkdirSync = function (path) {
  try {
    fs.mkdirSync(path)
  } catch (e) {
    if (e.code !== 'EEXIST') throw e
  }
}

export default mkdirSync