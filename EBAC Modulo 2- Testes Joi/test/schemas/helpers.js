import supertest from 'supertest';
import Joi from 'joi';
import joiAssert from 'joi-assert';

global. Joi = Joi;
global.joiAssert = joiAssert;
global.request = supertest("http://localhost:3000/api");
