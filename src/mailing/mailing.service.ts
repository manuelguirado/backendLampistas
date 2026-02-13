import { Injectable } from '@nestjs/common';
import { subscribeToNewsletter } from '../modules/mailing/subcribe';
import { getSubscribers } from '../modules/mailing/getSubcribers';
import { sendNewsLetter } from '../modules/mailing/sendNewsLetter';
@Injectable()
export class MailingService {
  async subscribe(email: string) {
    try {
      const result = await subscribeToNewsletter(email);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllSubscribers() {
    try {
      const subscribers = await getSubscribers();
      return subscribers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendNewsletter(title: string, content: string) {
    try {
      const result = await sendNewsLetter(title, content);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
