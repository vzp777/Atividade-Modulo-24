const req = require('supertest');
const { getAccessToken, getAddressId, deleteAddress } = require('../utils/request');
const API_URL = process.env.API_URL

describe('Addresses Resource', () => {
    let token
    let addressId

    beforeAll(async () => {
        token = await getAccessToken('admin', 'admin')
    })

    it('(HealthCheck) Should create a new Address', async () => {
        await req(API_URL)
            .post('/addresses')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .send({
                "address_1": "Rua Teste",
                "address_2": "Centro",
                "city": "Curitiba",
                "state": "PR",
                "zip": 80010100
            })
            .then(response => {
                expect(response.statusCode).toEqual(201)
                expect(response.body.id).not.toBe(undefined)
                addressId = response.body.id
            })
    });

    it('Should not create a new Address without Authorization', async () => {
        await req(API_URL)
            .post('/addresses')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('(HealthCheck) Should list Addresses', async () => {
        await req(API_URL)
            .get('/addresses')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Array)
            })
    });

    it('Should not list Addresses without Authorization', async () => {
        await req(API_URL)
            .get('/addresses')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('(HealthCheck) Should alter all data from an Address', async () => {
        await req(API_URL)
            .patch(`/addresses/${addressId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .send({
                "address_1": "Avenida Teste",
                "address_2": "Jardim Campinas",
                "city": "Campinas",
                "state": "SP",
                "zip": 84010100
            })
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body.id).not.toBe(undefined)
                expect(response.body.city).toEqual("Campinas")
            })
    });

    it('Should not alter an Address without Authorization', async () => {
        await req(API_URL)
            .patch(`/addresses/${addressId}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('(HealthCheck) Should list a specific Address', async () => {
        await req(API_URL)
            .get(`/addresses/${addressId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body.id).toEqual(`${addressId}`)
            })
    });

    it('Should not list a specific Address without Authorization', async () => {
        await req(API_URL)
            .get(`/addresses/${addressId}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('Should return Not Found when search for an inexistent Address', async () => {
        await req(API_URL)
            .get('/addresses/0000')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(404)
                expect(response.body.error).toContain("Not Found")
            })
    });

    it('(HealthCheck) Should delete an Address', async () => {
        await req(API_URL)
            .delete(`/addresses/${addressId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body.id).toEqual(`${addressId}`)
            })
    });

    it('Should not delete an Address without Authorization', async () => {
        await req(API_URL)
            .delete(`/addresses/${addressId}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });
});