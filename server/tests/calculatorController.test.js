import request from 'supertest';
import express from 'express';
import calculatorRoutes from '../routes/calculatorRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/calculate', calculatorRoutes);

describe('Calculator API', () => {
  test('POST /api/calculate - add', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'add', num1: 5, num2: 3 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.result).toBe(8);
  });

  test('POST /api/calculate - subtract', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'subtract', num1: 10, num2: 4 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.result).toBe(6);
  });

  test('POST /api/calculate - multiply', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'multiply', num1: 7, num2: 6 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.result).toBe(42);
  });

  test('POST /api/calculate - divide', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'divide', num1: 15, num2: 3 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.result).toBe(5);
  });

  test('POST /api/calculate - divide by zero', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'divide', num1: 10, num2: 0 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Division by zero');
  });

  test('POST /api/calculate - invalid operation', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'invalid', num1: 5, num2: 3 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid operation. Supported: add, subtract, multiply, divide');
  });

  test('POST /api/calculate - invalid numbers', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ operation: 'add', num1: 'five', num2: 3 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('num1 and num2 must be numbers');
  });
});