import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import parser from 'xml2json'
import fs from 'fs'
import server from './server'

chai.use(chaiHttp)

describe('/POST email', () => {
  const toAddress = 'to@email.com'
  const htmlEmail = '<p>HTML Email</p>'
  const textEmail = 'Text Email'
  const emailSubject = 'Email Subject 😊'
  const fromEmail = 'from@email.com'
  it('it should succeed if email has all params', (done) => {
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
        const json = parser.toJson(res.text, { object: true })
        expect(res).to.have.status(200)
        expect(json.SendEmailResponse.SendEmailResult).should.have.property('MessageId')
        expect(fs.readFileSync(json.SendEmailResponse.SendEmailResult.MessageId, 'utf8')).to.eq(htmlEmail)
        done()
      })
  })
})