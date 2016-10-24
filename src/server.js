// Import node libs
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
// Import local libs
import mkdir from './library/mkdir'
import options from './library/options'

const app = express()
const log = console.log
const dateTime = new Date().toISOString()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  if (req.body.Action === 'SendEmail') {
    log(`
    ${chalk.green('Email Recieved')}
      ${chalk.blue('From:')} ${req.body.Source},
      ${chalk.blue('To:')} ${req.body['Destination.ToAddresses.member.1']},
      ${chalk.blue('Subject:')} ${req.body['Message.Subject.Data']},
    `)
    let dir = `${options.outputDir}/${dateTime.slice(0, 10)}/${dateTime.slice(11, 22)}`
    mkdir(path.join(dir))
    fs.writeFileSync(`${dir}/body.html`, req.body['Message.Body.Html.Data']);
    fs.writeFileSync(`${dir}/body.txt`, req.body['Message.Body.Text.Data']);
  }
  res.status(200).send('Were up\n')
})

app.listen(options.port)

log(`
${chalk.inverse('  AWS Simple Email Service Local 📬  ')}
  ${chalk.green('Listening on port:')} ${options.port}
  ${chalk.green('Output directory:')} ${options.outputDir}
`)