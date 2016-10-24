// Import node libs
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import chalk from 'chalk'
// Import local libs
import mkdir from './library/mkdir'
import options from './library/options'

const app = express()
const log = console.log

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
    mkdir(path.join(options.outputDir || './output'))
    // Html: req.body['Message.Body.Html.Data']
    // Text: req.body['Message.Body.Text.Data']
  }
  res.status(200).send('Were up\n')
})

app.listen(options.port)

log(`
  ${chalk.green('Listening on port:')} ${options.port}
`)