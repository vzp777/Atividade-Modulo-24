const {getAccessToken} = require('../../../utils/request');

describe('Addresses Resource', () => {
    let token
    token = getAccessToken()

    it('Deve validar o schema de uma lista de Endereços', done => {
      const addressesList = Joi.array().items(Joi.object().keys({
        address_1: Joi.string().allow(null),
        address_2: Joi.string().allow(null),
        city: Joi.string().allow(null),
        createdAt: Joi.string().isoDate().required(),
        id: Joi.string().required(),
        state: Joi.string().allow(null),
        updatedAt: Joi.string().isoDate().allow(null),
        zip: Joi.number().allow(null)
      }));
  
      request
        .get("/addresses")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          joiAssert(res.body, addressesList);
          done(err);
        });
    });
  });