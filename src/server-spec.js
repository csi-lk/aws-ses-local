import chai from 'chai'
import chaiHttp from 'chai-http'
import server from './server'

chai.use(chaiHttp)

describe('/POST email', () => {
  it('it should succeed if email has all params', (done) => {
    chai.request(server)
      .post('/')
      .send({ 
        "Action":"SendEmail"
      })
      .end((err, res) => {
        console.log(err, res)
        res.should.have.status(200)
        done()
      })
  })
})