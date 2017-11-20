import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
import mkdir from './library/mkdir'

const successTemplate = fs.readFileSync(`${__dirname}/templates/success.xml`, { encoding: 'utf-8' })

const sendRawEmail = (req, res, dateDir, fullDir, log) => {
  if (!req.body['RawMessage.Data']) {
    throw new Error('RawMessage.Data is required and was not sent')
  }

  mkdir(path.join(dateDir))
  mkdir(path.join(fullDir))
  log(`  🍣  ${chalk.green('Raw Email Received')}
    ${chalk.blue('From:')} ${req.body.Source}
    ${chalk.blue('To:')} ${req.body['Destinations.member.1']}
    ${chalk.blue('Raw Message:')} ${process.cwd()}/${path.join(fullDir)}/raw-message
  `)
  const decodedBody = Buffer.from(req.body['RawMessage.Data'], 'base64').toString()
  fs.writeFileSync(`${fullDir}/raw-message`, decodedBody)

  res.status(200).send(
    successTemplate.replace('{{message}}', `${process.cwd()}/${path.join(fullDir)}/raw-message`)
  )
}

module.exports = sendRawEmail