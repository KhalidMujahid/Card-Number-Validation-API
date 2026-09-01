import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

describe('Card Validation API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /cards/validate', () => {
    it('should return true for a valid card number', async () => {
      const response = await request(app.getHttpServer())
        .post('/cards/validate')
        .send({
          cardNumber: '4111111111111111',
        })
        .expect(201);

      expect(response.body).toEqual({
        valid: true,
      });
    });

    it('should return false for an invalid card number', async () => {
      const response = await request(app.getHttpServer())
        .post('/cards/validate')
        .send({
          cardNumber: '4111111111111112',
        })
        .expect(201);

      expect(response.body).toEqual({
        valid: false,
      });
    });

    it('should accept a card number containing spaces', async () => {
      const response = await request(app.getHttpServer())
        .post('/cards/validate')
        .send({
          cardNumber: '4111 1111 1111 1111',
        })
        .expect(201);

      expect(response.body).toEqual({
        valid: true,
      });
    });

    it('should return 400 when card number is missing', async () => {
      await request(app.getHttpServer())
        .post('/cards/validate')
        .send({})
        .expect(400);
    });

    it('should return 400 when card number is not a string', async () => {
      await request(app.getHttpServer())
        .post('/cards/validate')
        .send({
          cardNumber: 4111111111111111,
        })
        .expect(400);
    });

    it('should return 400 when an unexpected field is provided', async () => {
      await request(app.getHttpServer())
        .post('/cards/validate')
        .send({
          cardNumber: '4111111111111111',
          extraField: 'unexpected',
        })
        .expect(400);
    });
  });
});