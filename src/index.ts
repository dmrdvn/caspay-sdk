import { HttpClient } from './core/client';
import { Transfer } from './core/transfer';
import { Payments } from './resources/payments';
import { Subscriptions } from './resources/subscriptions';
import { Wallet } from './resources/wallet';
import { SDK_VERSION } from './version';
import type { CasPayConfig } from './types';

export default class CasPay {
  public payments: Payments;
  public subscriptions: Subscriptions;
  public wallet: Wallet;
  private client: HttpClient;
  private transfer: Transfer;
  private config: CasPayConfig;

  constructor(config: CasPayConfig) {
    if (!config.walletAddress) {
      throw new Error('CasPay SDK: walletAddress is required');
    }

    this.config = config;
    this.client = new HttpClient(config);
    this.wallet = new Wallet(config);
    
    const apiBaseUrl = this.client.getBaseUrl();
    this.transfer = new Transfer(this.wallet, apiBaseUrl);
    
    this.payments = new Payments(this.client);
    this.payments.setWallet(this.wallet, this.transfer);
    
    this.subscriptions = new Subscriptions(this.client, config);
  }

  static get version(): string {
    return SDK_VERSION;
  }

  getConfig(): CasPayConfig {
    return { ...this.config };
  }
}

export { CasPay };
export * from './types';
