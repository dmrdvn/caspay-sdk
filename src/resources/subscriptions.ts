import type { HttpClient } from '../core/client';
import type { SubscriptionCheckParams, SubscriptionCheckResponse, CasPayConfig } from '../types';

export class Subscriptions {
  private client: HttpClient;
  private config: CasPayConfig;

  constructor(client: HttpClient, config: CasPayConfig) {
    this.client = client;
    this.config = config;
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
    const network = params.network || this.config.network || 'testnet';
    
    let url = `/v1/subscriptions/check?merchant_id=${merchantId}&subscriber=${params.subscriberAddress}&network=${network}`;
    
    if (params.planId) {
      url += `&plan_id=${params.planId}`;
    }

    return this.client.request<SubscriptionCheckResponse>('GET', url);
  }
}
