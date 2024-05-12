const {getAccessToken} = require('../../../utils/request');

describe('Customers Resource', () => {
    let token
    token = getAccessToken()
    
    it('Deve validar o schema de uma lista de Clientes', done => {
      const customersList = Joi.array().items(Joi.object().keys({
        address: Joi.object().allow(null),
        createdAt: Joi.string().isoDate().required(),
        email: Joi.string().allow(null),
        firstName: Joi.string().allow(null),
        id: Joi.string().required(),
        lastName: Joi.string().allow(null),
        phone: Joi.string().allow(null),
        updatedAt: Joi.string().isoDate().allow(null)
      }));
  
      request
        .get("/customers")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          joiAssert(res.body, customersList);
          done(err);
        });
    });
  });