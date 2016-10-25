import nopt from 'nopt'
import path from 'path'

const opts = {
  outputDir: path,
  port: Number,
  clean: Boolean,
}
const shortOpts = {
  o: ['--outputDir'],
  p: ['--port'],
  c: ['--clean'],
}
const output = nopt(opts, shortOpts, process.argv, 2)

output.outputDir = (output.outputDir === undefined) ? './output' : output.outputDir
output.port = (output.port === undefined) ? '9001' : output.port

export default output