const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

// ---> DEBUT
/**
  * Génération des nouvelles couleurs et enregistrement de ces
  * couleurs dans un tableau.
  */
const newValues = []
const colorKey = 'NEW_COLOR_'
let nextCursor = 0;
const payloadColor = () => {
  const nextColor = `${colorKey}${nextCursor}`
  newValues.push(nextColor)
  nextCursor++;
  return { 'color': nextColor }
}
const newColor = payloadColor();

const getCurrentCulor = () => {
  return nextCursor > 0 ? `${colorKey}${nextCursor - 1}` : `${colorKey}O`
}
// <-- FIN

it('should return all colors', function (done) {
  const expectedColors = ['RED', 'GREEN', 'BLUE'];
  chai.request(app)
    .get('/colors')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.results).to.be.an('array');
      expect(res.body.results).to.eql(expectedColors)
      console.log(res.body.results, expectedColors)
      done();
    });
});


it('should return bad request', function (done) {
  chai.request(app)
    .get('/colo')
    .end((err, res) => {
      expect(res).to.have.status(404)
      done();
    });
});

it('should add new color', function (done) {
  chai.request(app)
    .post('/colors')
    .send(newColor)
    .then((res) => {
      expect(res).to.have.status(201);
      expect(res.body).is.an.instanceof(Object);
      expect(res.body.results).to.be.an('array');
      expect(res.body.results).to.contain(newColor.color)
      done();
    })
});

it('should return new color list Request', function (done) {
  chai.request(app)
    .get('/colors')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an.instanceof(Object);
      expect(res.body.results).to.be.an('array');
      expect(res.body.results).to.contain(newColor.color)
      done();
    });
});



