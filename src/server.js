// Import node libs
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
// Import local libs
import mkdir from './library/mkdir'
import options from './library/options'
import rmdir from './library/rmdir'

const app = express()
const log = console.log

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

log(`
${chalk.inverse('  AWS Simple Email Service Local 📪  ')}
  ${chalk.green('Listening on port:')} ${options.port}`)

if (options.clean !== undefined) {
  log(`  ${chalk.red('Cleaning directory:')} ${options.outputDir}`)
  rmdir(options.outputDir)
}

log(`  ${chalk.green('Creating output directory:')} ${options.outputDir}`)
mkdir(path.join(options.outputDir))

app.post('/', (req, res) => {
  const dateTime = new Date().toISOString()
  if (req.body.Action === 'SendEmail') {
    const dateDir = `${options.outputDir}/${dateTime.slice(0, 10)}`
    const fullDir = `${dateDir}/${dateTime.slice(11, 22).replace(/:\s*/g, '.')}`
    const headers = `Subject: ${req.body['Message.Subject.Data']}\nDestination: ${req.body['Destination.ToAddresses.member.1']}\nSource: ${req.body.Source}`
    mkdir(path.join(dateDir))
    mkdir(path.join(fullDir))
    log(`  📬  ${chalk.green('Email Recieved')}
      ${chalk.blue('From:')} ${req.body.Source}
      ${chalk.blue('To:')} ${req.body['Destination.ToAddresses.member.1']}
      ${chalk.blue('Subject:')} ${req.body['Message.Subject.Data']}
      ${chalk.blue('Html Email:')} ${process.cwd()}/${path.join(fullDir)}/body.html
      ${chalk.blue('Text Email:')} ${process.cwd()}/${path.join(fullDir)}/body.txt
    `)
    fs.writeFileSync(`${fullDir}/body.html`, req.body['Message.Body.Html.Data'])
    fs.writeFileSync(`${fullDir}/body.txt`, req.body['Message.Body.Text.Data'])
    fs.writeFileSync(`${fullDir}/headers.txt`, headers)
    res.status(200).send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <SendEmailResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
        <SendEmailResult>
          <MessageId>${process.cwd()}/${path.join(fullDir)}/body.html</MessageId>
        </SendEmailResult>
      </SendEmailResponse>
    `)
  }
})

app.listen(options.port)