import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  if (req.body.Action === 'SendEmail') {
    console.log({
      From: req.body.Source,
      To: req.body['Destination.ToAddresses.member.1'],
      Subject: req.body['Message.Subject.Data'],
    })
    // Html: req.body['Message.Body.Html.Data']
    // Text: req.body['Message.Body.Text.Data']
  }
  res.send('Were up\n')
})

app.listen(3001)

console.log('Listening on port 3001...')