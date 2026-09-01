import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service.js';

describe('CardService', () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardService],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it('should return true for a valid card number', () => {
    expect(service.validateCardNumber('4111111111111111')).toBe(true);
  });

  it('should return false for an invalid card number', () => {
    expect(service.validateCardNumber('4111111111111112')).toBe(false);
  });

  it('should support spaces in card numbers', () => {
    expect(service.validateCardNumber('4111 1111 1111 1111')).toBe(true);
  });

  it('should return false for non-numeric input', () => {
    expect(service.validateCardNumber('4111abcd11111111')).toBe(false);
  });
});