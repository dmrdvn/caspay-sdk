import type { HttpClient } from '../core/client';
import type { PaymentCreateParams, PaymentResponse } from '../types';

/**
 * Payments Resource
 * Handle payment creation and verification
 */
export class Payments {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Create a new payment record
   * 
   * @param params - Payment parameters
   * @returns Payment response with transaction details
   * @throws {CasPayError} If payment creation fails
   * 
   * @example
   * ```typescript
   * const payment = await caspay.payments.create({
   *   senderAddress: '0x123...',
   *   productId: 'prod_abc123',
   *   amount: 100,
   *   currency: 'USD'
   * });
   * ```
   */
  async create(params: PaymentCreateParams): Promise<PaymentResponse> {
    // Validate required fields
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
}
