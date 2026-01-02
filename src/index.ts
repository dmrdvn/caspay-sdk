import { HttpClient } from './core/client';
import { Payments } from './resources/payments';
import type { CasPayConfig } from './types';

/**
 * CasPay SDK
 * Official JavaScript/TypeScript SDK for CasPay payment gateway
 * 
 * @example
 * ```typescript
 * import CasPay from '@caspay/sdk';
 * 
 * const caspay = new CasPay({
 *   apiKey: 'cp_live_...',
 *   merchantId: 'MERCH_...'
 * });
 * 
 * const payment = await caspay.payments.create({
 *   senderAddress: '0x123...',
 *   productId: 'prod_abc',
 *   amount: 100
 * });
 * ```
 */
export default class CasPay {
  /** Payments resource for creating and managing payments */
  public payments: Payments;
  private client: HttpClient;

  /**
   * Create a new CasPay SDK instance
   * @param config - SDK configuration
   */
  constructor(config: CasPayConfig) {
    this.client = new HttpClient(config);
    this.payments = new Payments(this.client);
  }

  /**
   * Get SDK version
   */
  static get version(): string {
    return '1.0.0';
  }
}

// Named export for ESM
export { CasPay };

// Export all types
export * from './types';
