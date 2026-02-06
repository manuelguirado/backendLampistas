import { Injectable } from '@nestjs/common';
import { createSubcription } from '../../modules/payments/subscriptions/createSubcription';
import saveSubcriptionInDB from '../../modules/payments/subscriptions/saveSubcription';
import createAccount from '../../modules/payments/subscriptions/accounts/createAccount';
import createLoginLink from '../../modules/payments/subscriptions/accounts/createLoginLink';
import { createPayment } from '../../modules/payments/subscriptions/payments/createPayment';
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
  async createAccount(email: string) {
    return await createAccount(email);
  }
  async createLoginLink(email: string) {
    return await createLoginLink(email);
  }
  async createPayment(ammount: number, userID: number, companyID: number) {
    return await createPayment(ammount, userID, companyID);
  }
}
