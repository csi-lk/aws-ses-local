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

describe('/POST email', () => {
  const toAddress = 'to@email.com'
  const htmlEmail = '<p>HTML Email</p>'
  const textEmail = 'Text Email'
  const emailSubject = 'Email Subject 😊'
  const fromEmail = 'from@email.com'
  it('should succeed if email has all params', (done) => {
    chai.request(server)
      .post('/')
      .send({
        Action: 'SendEmail',
        'Destination.ToAddresses.member.1': toAddress,
        'Message.Body.Html.Data': htmlEmail,
        'Message.Body.Text.Data': textEmail,
        'Message.Subject.Data': emailSubject,
        Source: fromEmail,
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        const response = new xmldoc.XmlDocument(res.text)
        const path = response.valueWithPath('SendEmailResult.MessageId')
        expect(fs.readFileSync(path, 'utf8')).to.eq(htmlEmail)
        expect(fs.readFileSync(path.replace('body.html', 'body.txt'), 'utf8')).to.eq(textEmail)
        expect(fs.readFileSync(path.replace('body.html', 'headers.txt'), 'utf8')).to.eq(`Subject: ${emailSubject}\nDestination: ${toAddress}\nSource: ${fromEmail}`)
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