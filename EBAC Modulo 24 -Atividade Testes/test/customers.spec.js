const req = require('supertest');
const { getAccessToken, getAddressId, deleteAddress } = require('../utils/request');
const API_URL = process.env.API_URL

describe('Customers Resource', () => {
    let token
    let customerId

    beforeAll(async () => {
        token = await getAccessToken('admin', 'admin')
        addressId = await getAddressId(token)
        secondAddressId = await getAddressId(token)
    })

    it('(HealthCheck) Should create a new Customer', async () => {
        await req(API_URL)
            .post('/customers')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .send({
                "address": {
                    "id": `${addressId}`
                  },
                  "email": "customer@test.com",
                  "firstName": "Customer",
                  "lastName": "Test",
                  "phone": "4234222020"
            })
            .then(response => {
                expect(response.statusCode).toEqual(201)
                expect(response.body.id).not.toBe(undefined)
                expect(response.body.address.id).toEqual(`${addressId}`)
                customerId = response.body.id
            })
    });

    it('Should not create a new Customer without Authorization', async () => {
        await req(API_URL)
            .post('/customers')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('(HealthCheck) Should list Customers', async () => {
        await req(API_URL)
            .get('/customers')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Array)
            })
    });

    it('Should not list Customers without Authorization', async () => {
        await req(API_URL)
            .get('/customers')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('(HealthCheck) Should list Customers by Address', async () => {
        await req(API_URL)
            .get(`/addresses/${addressId}/customers`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.text).toContain(`${customerId}`)
            })
    });

    it('Should not list Customers by Adress without Authorization', async () => {
        await req(API_URL)
            .get(`/addresses/${addressId}/customers`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('(HealthCheck) Should alter all data from a Customer', async () => {
        await req(API_URL)
            .patch(`/customers/${customerId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .send({
                "address": {
                    "id": `${secondAddressId}`
                  },
                  "email": "customer@test.com.br",
                  "firstName": "Customer Test",
                  "lastName": "Testing",
                  "phone": "42999457107"
            })
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body.id).not.toBe(undefined)
                expect(response.body.address.id).toEqual(`${secondAddressId}`)
            })
    });

    it('Should not alter a Customer without Authorization', async () => {
        await req(API_URL)
            .patch(`/customers/${customerId}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('(HealthCheck) Should list a specific Customer', async () => {
        await req(API_URL)
            .get(`/customers/${customerId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body.id).toEqual(`${customerId}`)
            })
    });

    it('Should not list a specific Customer without Authorization', async () => {
        await req(API_URL)
            .get(`/customers/${customerId}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    it('Should return Not Found when search for an inexistent Customer', async () => {
        await req(API_URL)
            .get('/customers/0000')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(404)
                expect(response.body.error).toContain("Not Found")
            })
    });

    it('(HealthCheck) Should delete a Customer', async () => {
        await req(API_URL)
            .delete(`/customers/${customerId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body.id).toEqual(`${customerId}`)
            })
    });

    it('Should not delete a Customer without Authorization', async () => {
        await req(API_URL)
            .delete(`/customers/${customerId}`)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toEqual(401)
                expect(response.body).toEqual({"message": "Unauthorized", "statusCode": 401})
            })
    });

    afterAll(async () => {
        deleteAddress(token, addressId)
        deleteAddress(token, secondAddressId)
    })
});