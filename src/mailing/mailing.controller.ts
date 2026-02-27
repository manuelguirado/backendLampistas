import { Controller } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { Post, Body, Get } from '@nestjs/common';
@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post('subscribeNewsletter')
  async subscribe(@Body('email') email: string) {
    return this.mailingService.subscribe(email);
  }
  @Get('subscribers')
  async getSubscribers() {
    return this.mailingService.getAllSubscribers();
  }
  @Post('createNewsletter')
  async sendNewsletter(
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.mailingService.sendNewsletter(title, content);
  }
}
