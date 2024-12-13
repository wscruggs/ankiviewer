import app from '../src/server.js';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);

describe('Get API functions', () => {
  describe('/api/deck/', () => {
    it('should get a list of all anki cards', async () => {
      const response = await chai.request(app).get('/api/deck');
      response.should.have.status(200);
      response.type.should.equal('application/json');
      response.body[0].should.include.keys(
        'Id', 'Japanese', 'Link', 'Meaning', 'Note', 'Reading', 'Sentence', 'Sentence_Meaning');
    });
  });

  //1666226332917 is first note id in current deck.  probably not the best way to test this, but oh well.
  describe('/api/card/:id', () => {
    it('should return the card with the given id', async () => {
      const response3 = await chai.request(app).get('/api/card/1666226332917');
      response3.should.have.status(200);
      response3.type.should.equal('application/json');
      response3.body.should.include.keys(
        'Id', 'Japanese', 'Link', 'Meaning', 'Note', 'Reading', 'Sentence', 'Sentence_Meaning');
    });
  });

});