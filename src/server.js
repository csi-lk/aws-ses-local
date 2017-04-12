#!/usr/bin/env node

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
const successTemplate = fs.readFileSync(`${__dirname}/templates/success.xml`, { encoding: 'utf-8' })
const errorTemplate = fs.readFileSync(`${__dirname}/templates/error.xml`, { encoding: 'utf-8' })

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
  if (req.body.Action === 'SendEmail') {
    const dateDir = `${options.outputDir}/${dateTime.slice(0, 10)}`
    const fullDir = `${dateDir}/${dateTime.slice(11, 22).replace(/:\s*/g, '.')}`
    const headers = `Subject: ${req.body['Message.Subject.Data']}\nTo Address: ${req.body['Destination.ToAddresses.member.1']}\nCc Address: ${req.body['Destination.CcAddresses.member.1']}\nBcc Address: ${req.body['Destination.BccAddresses.member.1']}\nReply To Address: ${req.body['ReplyToAddresses.member.1']}\nSource: ${req.body.Source}`
    try {
      if (req.body.Source && req.body['Message.Subject.Data'] && (req.body['Message.Body.Html.Data'] || req.body['Message.Body.Text.Data']) && req.body['Destination.ToAddresses.member.1']) {
        mkdir(path.join(dateDir))
        mkdir(path.join(fullDir))
        log(`  📬  ${chalk.green('Email Received')}
          ${chalk.blue('From:')} ${req.body.Source}
          ${chalk.blue('To:')} ${req.body['Destination.ToAddresses.member.1']}
          ${chalk.blue('Subject:')} ${req.body['Message.Subject.Data']}
          ${chalk.blue('Html Email:')} ${process.cwd()}/${path.join(fullDir)}/body.html
          ${chalk.blue('Text Email:')} ${process.cwd()}/${path.join(fullDir)}/body.txt
        `)
        fs.writeFileSync(`${fullDir}/body.html`, req.body['Message.Body.Html.Data'])
        fs.writeFileSync(`${fullDir}/body.txt`, req.body['Message.Body.Text.Data'])
        fs.writeFileSync(`${fullDir}/headers.txt`, headers)
        res.status(200).send(
          successTemplate.replace('{{message}}', `${process.cwd()}/${path.join(fullDir)}/body.html`)
        )
      } else {
        throw new Error('One or more required fields was not sent')
      }
    } catch (err) {
      log(`   ${chalk.red('Error Occured:')} ${err}`)
      res.status(500).send(
        errorTemplate.replace('{{code}}', 'MessageRejected').replace('{{message}}', err.message)
      )
    }
  }
})

app.listen(options.port)

export default app