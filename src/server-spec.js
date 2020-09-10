import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import xmldoc from 'xmldoc'
import fs from 'fs'
import server from './server'

chai.use(chaiHttp)

// describe('Runtime arguments', () => {
//   it('should clean the output directory when called with --clean', (done) => {
//     process.argv = ['--clean']
//     chai.request(server)
//   })
// })
const toAddress = 'to@email.com'
const fromEmail = 'from@email.com'

describe('/POST SendEmail', () => {
  const ccAddress = 'cc@email.com'
  const bccAddress = 'bcc@email.com'
  const replyToAddress = 'replyTo@email.com'
  const htmlEmail = '<p>HTML Email</p>'
  const textEmail = 'Text Email'
  const emailSubject = 'Email Subject 😊'
  it('should succeed if email has all params', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'SendEmail',
        'Destination.ToAddresses.member.1': toAddress,
        'Message.Body.Html.Data': htmlEmail,
        'Message.Body.Text.Data': textEmail,
        'Message.Subject.Data': emailSubject,
        'Destination.CcAddresses.member.1': ccAddress,
        'Destination.BccAddresses.member.1': bccAddress,
        'ReplyToAddresses.member.1': replyToAddress,
        Source: fromEmail,
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        const response = new xmldoc.XmlDocument(res.text)
        const path = response.valueWithPath('SendEmailResult.MessageId')
        expect(fs.readFileSync(path, 'utf8')).to.eq(htmlEmail)
        expect(fs.readFileSync(path.replace('body.html', 'body.txt'), 'utf8')).to.eq(textEmail)
        expect(fs.readFileSync(path.replace('body.html', 'headers.txt'), 'utf8')).to.eq(`Subject: ${emailSubject}\nTo Address: ${toAddress}\nCc Address: ${ccAddress}\nBcc Address: ${bccAddress}\nReply To Address: ${replyToAddress}\nSource: ${fromEmail}`)
        done()
      })
  })
  it('should succeed if only HTML body is missing', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'SendEmail',
        'Destination.ToAddresses.member.1': toAddress,
        'Message.Body.Text.Data': textEmail,
        'Message.Subject.Data': emailSubject,
        'Destination.CcAddresses.member.1': ccAddress,
        'Destination.BccAddresses.member.1': bccAddress,
        'ReplyToAddresses.member.1': replyToAddress,
        Source: fromEmail,
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })
  it('should succeed if only Text body is missing', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'SendEmail',
        'Destination.ToAddresses.member.1': toAddress,
        'Message.Body.Html.Data': htmlEmail,
        'Message.Subject.Data': emailSubject,
        'Destination.CcAddresses.member.1': ccAddress,
        'Destination.BccAddresses.member.1': bccAddress,
        'ReplyToAddresses.member.1': replyToAddress,
        Source: fromEmail,
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })
  it('should fail if one param is not sent', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'SendEmail',
        'Message.Body.Html.Data': htmlEmail,
        'Message.Body.Text.Data': textEmail,
        'Message.Subject.Data': emailSubject,
        Source: fromEmail,
      })
      .end((err, res) => {
        expect(res).to.have.status(500)
        const response = new xmldoc.XmlDocument(res.text)
        expect(response.valueWithPath('Code')).to.eq('MessageRejected')
        expect(response.valueWithPath('Message')).to.eq('One or more required fields was not sent')
        done()
      })
  })
})

describe('/POST Unsupported action', () => {
  it('should fail if the action is not unsupported', (done) => {
    chai.request(server)
      .post('/')
      .send({ Action: 'SomeRandomAction' })
      .end((err, res) => {
        expect(res).to.have.status(500)
        const response = new xmldoc.XmlDocument(res.text)
        expect(response.valueWithPath('Code')).to.eq('MessageRejected')
        expect(response.valueWithPath('Message')).to.eq('Unsupported action SomeRandomAction')
        done()
      })
  })
})

describe('/POST SendRawEmail', () => {
  it('should write the decoded message to disk', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'SendRawEmail',
        'Destinations.member.1': toAddress,
        'RawMessage.Data': Buffer.from('Some raw email data').toString('base64'),
        Source: fromEmail,
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        const response = new xmldoc.XmlDocument(res.text)
        const path = response.valueWithPath('SendEmailResult.MessageId')
        expect(fs.readFileSync(path, 'utf8')).to.eq('Some raw email data')
        done()
      })
  })

  it('should fail if the raw message data is not sent', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'SendRawEmail',
      })
      .end((err, res) => {
        expect(res).to.have.status(500)
        done()
      })
  })
})


describe('/POST GetAccountSendingEnabled', () => {
  it('should return enabled set to true', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'GetAccountSendingEnabled',
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        const response = new xmldoc.XmlDocument(res.text)
        const enabled = response.valueWithPath('GetAccountSendingEnabledResult.Enabled')
        expect(enabled).to.equal('true')
        done()
      })
  })
})