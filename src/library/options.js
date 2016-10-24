import nopt from 'nopt'
import path from 'path'

const opts = {
  outputDir : path
}
const shortOpts = {
  o : ['--outputDir']
}
const output = nopt(opts, shortOpts, process.argv, 2)

output.outputDir = (output.outputDir === undefined) ? './output' : output.outputDir;

export default output