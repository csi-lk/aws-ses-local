#!/usr/bin/env node

// Import node libs
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import chalk from 'chalk'
// Import local libs
import mkdir from './library/mkdir'
import options from './library/options'
import rmdir from './library/rmdir'
import sendEmail from './send-email'

const app = express()
const log = console.log //eslint-disable-line

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

log(`
${chalk.inverse('  AWS Simple Email Service Local 📪   ')}
  ${chalk.green('Listening on port:')} ${options.port}`)

if (options.clean !== undefined) {
  log(`  ${chalk.red('Cleaning directory:')} ${options.outputDir}`)
  rmdir(options.outputDir)
}

log(`  ${chalk.green('Creating output directory:')} ${options.outputDir}`)
mkdir(path.join(options.outputDir))

app.post('/', (req, res) => {
  const dateTime = new Date().toISOString()
  const dateDir = `${options.outputDir}/${dateTime.slice(0, 10)}`
  const fullDir = `${dateDir}/${dateTime.slice(11, 22).replace(/:\s*/g, '.')}`

  if (req.body.Action === 'SendEmail') {
    sendEmail(req, res, dateDir, fullDir, log)
  }
})

app.listen(options.port)

export default app