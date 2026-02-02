import { Injectable } from '@nestjs/common';
import { createSubcription } from '../../modules/payments/subscriptions/createSubcription';
import saveSubcriptionInDB from '../../modules/payments/subscriptions/saveSubcription';
@Injectable()
export class PaymentsService {
  async createSubscription(companyemail: string, price: number) {
    return await createSubcription(companyemail, price);
  }
  async saveSubscription(
    companyemail: string,
    startDate: Date,

    active: boolean,
    subscriptionID: string,
    endDate?: Date,
  ) {
    return await saveSubcriptionInDB(
      companyemail,
      startDate,

      active,
      subscriptionID,
      endDate,
    );
  }
}
