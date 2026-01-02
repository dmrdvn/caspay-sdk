import type { CasPayConfig, CasPayError } from '../types';

/**
 * HTTP Client for CasPay API
 * Handles all API requests with authentication and error handling
 */
export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private merchantId: string;
  private readonly SDK_VERSION = '1.0.0';

  constructor(config: CasPayConfig) {
    // Use production API by default
    this.baseUrl = config.baseUrl || 'https://api.caspay.link';
    this.apiKey = config.apiKey;
    this.merchantId = config.merchantId;

    // Validate required config
    if (!this.apiKey) {
      throw new Error('CasPay SDK: apiKey is required');
    }
    if (!this.merchantId) {
      throw new Error('CasPay SDK: merchantId is required');
    }
  }

  async request<T>(
    method: string,
    path: string,
    body?: Record<string, any>
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CasPay-Key': this.apiKey,
          'X-CasPay-SDK-Version': this.SDK_VERSION,
          'User-Agent': `CasPay-SDK-JS/${this.SDK_VERSION}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: CasPayError = {
          error: data.error || 'Request failed',
          code: data.code || 'UNKNOWN_ERROR',
          status: response.status,
        };
        throw error;
      }

      return data;
    } catch (error: any) {
      // Re-throw CasPay errors
      if (error.error && error.code) {
        throw error;
      }
      // Wrap network errors
      throw {
        error: error.message || 'Network error',
        code: 'NETWORK_ERROR',
        status: 0,
      } as CasPayError;
    }
  }

  getMerchantId(): string {
    return this.merchantId;
  }
}
