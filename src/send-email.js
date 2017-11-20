import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
import mkdir from './library/mkdir'

const successTemplate = fs.readFileSync(`${__dirname}/templates/success.xml`, { encoding: 'utf-8' })

const sendEmail = (req, res, dateDir, fullDir, log) => {
  const headers = `Subject: ${req.body['Message.Subject.Data']}\nTo Address: ${req.body['Destination.ToAddresses.member.1']}\nCc Address: ${req.body['Destination.CcAddresses.member.1']}\nBcc Address: ${req.body['Destination.BccAddresses.member.1']}\nReply To Address: ${req.body['ReplyToAddresses.member.1']}\nSource: ${req.body.Source}`

  if (!(req.body.Source && req.body['Message.Subject.Data'] && (req.body['Message.Body.Html.Data'] || req.body['Message.Body.Text.Data']) && req.body['Destination.ToAddresses.member.1'])) {
    throw new Error('One or more required fields was not sent')
  }

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
}

export default sendEmail