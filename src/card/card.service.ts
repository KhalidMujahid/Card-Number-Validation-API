import { Injectable } from '@nestjs/common';

@Injectable()
export class CardService {
  validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s+/g, '');

    if (!/^\d+$/.test(digits)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let index = digits.length - 1; index >= 0; index--) {
      let digit = Number(digits[index]);

      if (shouldDouble) {
        digit *= 2;

        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }
}