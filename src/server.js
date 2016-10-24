// Import 
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import mkdir from './library/mkdir'
import options from './library/options'

const app = express()
const args = process.argv.slice(2);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  if (req.body.Action === 'SendEmail') {
    console.log({
      From: req.body.Source,
      To: req.body['Destination.ToAddresses.member.1'],
      Subject: req.body['Message.Subject.Data'],
    })
    mkdir(path.join(options.outputDir || './output'))
    // Html: req.body['Message.Body.Html.Data']
    // Text: req.body['Message.Body.Text.Data']
  }
  res.send('Were up\n')
})

app.listen(3001)

console.log('Listening on port 3001...')