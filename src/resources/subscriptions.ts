import type { HttpClient } from '../core/client';
import type { SubscriptionCheckParams, SubscriptionCheckResponse } from '../types';

export class Subscriptions {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async checkStatus(params: SubscriptionCheckParams): Promise<SubscriptionCheckResponse> {
    if (!params.subscriberAddress) {
      throw {
        error: 'subscriberAddress is required',
        code: 'INVALID_PARAMS',
        status: 400,
      };
    }

    const merchantId = this.client.getMerchantId();
    let url = `/v1/subscriptions/check?merchant_id=${merchantId}&subscriber=${params.subscriberAddress}`;
    
    if (params.planId) {
      url += `&plan_id=${params.planId}`;
    }

    return this.client.request<SubscriptionCheckResponse>('GET', url);
  }
}
