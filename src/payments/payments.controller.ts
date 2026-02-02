import { PaymentsService } from './payments/payments.service';
import { Controller, Post, Req, Res, HttpStatus, Get } from '@nestjs/common';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsModule: PaymentsService) {}
  @Get('config')
  getConfig(@Res() res: any) {
    res.status(HttpStatus.OK).json({
      publishedKey: process.env.STRIPE_PUBLIC_KEY,
      clientSecret: process.env.STRIPE_SECRET_KEY,
    });
    console.log(
      'Published Key:',
      process.env.STRIPE_PUBLIC_KEY,
      'Client Secret:',
      process.env.STRIPE_SECRET_KEY,
    );
  }
  @Post('webhook')
  handleStripeWebhook(@Req() req: any, @Res() res: any) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-12-15.clover',
    });
    const sig = req.headers['stripe-signature'] as string;
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    // Maneja los eventos que te interesen
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session);
        break;
      case 'invoice.paid':
        const invoice = event.data.object;
        console.log('Invoice paid:', invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(HttpStatus.OK).json({ received: true });
  }
  @Post('create-subscription')
  async createSubscription(@Req() request: any, @Res() response: any) {
    const { companyemail, price } = request.body;
    console.log('Received create-subscription request:', {
      companyemail,
      price,
    });
    try {
      const subscription = await this.paymentsModule.createSubscription(
        companyemail,
        price,
      );
      console.log('Subscription created:', subscription);
      console.log('secret controller:', subscription.clientSecret);
      //then save the subscription in the database
      if (!subscription?.subscriptionId) {
        throw new Error('Subscription ID is missing');
      }
      const savedata = await this.paymentsModule.saveSubscription(
        companyemail,
        new Date(),
        true,
        subscription.subscriptionId,
      );
      console.log('Subscription saved in DB:', savedata);
      console.log('clientSecret:', subscription.clientSecret);
      return response.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Subscription created successfully',
        clientSecret: subscription.clientSecret,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }
}
