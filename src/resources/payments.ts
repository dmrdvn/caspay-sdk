import type { HttpClient } from '../core/client';
import type { Transfer } from '../core/transfer';
import type { Wallet } from './wallet';
import type { PaymentCreateParams, PaymentResponse, MakePaymentParams, MakePaymentResult } from '../types';

export class Payments {
  private client: HttpClient;
  private wallet: Wallet | null = null;
  private transfer: Transfer | null = null;

  constructor(client: HttpClient) {
    this.client = client;
  }

  setWallet(wallet: Wallet, transfer: Transfer): void {
    this.wallet = wallet;
    this.transfer = transfer;
  }

  async recordPayment(params: PaymentCreateParams): Promise<PaymentResponse> {
    if (!params.senderAddress) {
      throw {
        error: 'senderAddress is required',
        code: 'INVALID_PARAMS',
        status: 400,
      };
    }

    if (!params.amount || params.amount <= 0) {
      throw {
        error: 'amount must be greater than 0',
        code: 'INVALID_PARAMS',
        status: 400,
      };
    }

    if (!params.productId && !params.subscriptionPlanId) {
      throw {
        error: 'Either productId or subscriptionPlanId is required',
        code: 'INVALID_PARAMS',
        status: 400,
      };
    }

    const payload = {
      merchant_id: this.client.getMerchantId(),
      sender_address: params.senderAddress,
      transaction_hash: params.transactionHash || `mock_tx_${Date.now()}`,
      product_id: params.productId,
      subscription_plan_id: params.subscriptionPlanId,
      amount: params.amount,
      currency: params.currency || 'USD',
    };

    return this.client.request<PaymentResponse>(
      'POST',
      '/v1/payments/record',
      payload
    );
  }

  async recordSubscription(params: PaymentCreateParams): Promise<PaymentResponse> {
    if (!params.subscriptionPlanId) {
      throw {
        error: 'subscriptionPlanId is required for subscription recording',
        code: 'INVALID_PARAMS',
        status: 400,
      };
    }

    return this.recordPayment(params);
  }

  async makePayment(params: MakePaymentParams): Promise<MakePaymentResult> {
    if (!this.wallet || !this.transfer) {
      throw {
        error: 'Wallet not initialized. Make sure to use the SDK in browser environment.',
        code: 'WALLET_NOT_INITIALIZED',
        status: 500,
      };
    }

    if (!params.amount || params.amount <= 0) {
      throw {
        error: 'amount must be greater than 0',
        code: 'INVALID_PARAMS',
        status: 400,
      };
    }

    if (!params.productId && !params.subscriptionPlanId) {
      throw {
        error: 'Either productId or subscriptionPlanId is required',
        code: 'INVALID_PARAMS',
        status: 400,
      };
    }

    try {
      await this.client.validateApiKey();

      const isConnected = await this.wallet.isConnected();
      if (!isConnected) {
        await this.wallet.connect();
      }

      const senderAddress = await this.wallet.getAddress();
      if (!senderAddress) {
        throw {
          error: 'Failed to get wallet address',
          code: 'WALLET_ERROR',
          status: 500,
        };
      }

      const merchantWalletAddress = this.wallet.getMerchantWalletAddress();

      const transferResult = await this.transfer.execute({
        recipientAddress: merchantWalletAddress,
        amount: params.amount
      });

      try {
        const paymentRecord = await this.recordPayment({
          senderAddress: senderAddress,
          transactionHash: transferResult.deployHash,
          productId: params.productId,
          subscriptionPlanId: params.subscriptionPlanId,
          amount: params.amount,
          currency: params.currency || 'CSPR',
        });

        return {
          success: true,
          transactionHash: transferResult.deployHash,
          payment: paymentRecord,
        };
      } catch (recordError: any) {
        throw {
          error: `Payment transferred but recording failed: ${recordError.error || recordError.message}`,
          code: 'RECORDING_FAILED',
          status: recordError.status || 500,
          transactionHash: transferResult.deployHash,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        transactionHash: '',
        error: error.message || error.error || 'Payment failed',
      };
    }
  }
}
