import { Body, Controller, Post } from '@nestjs/common';
import { CardService } from './card.service.js';
import { ValidateCardDto } from './dto/validate-card.dto.js';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('validate')
  validateCard(@Body() dto: ValidateCardDto) {
    const valid = this.cardService.validateCardNumber(dto.cardNumber);

    return {
      valid,
    };
  }
}