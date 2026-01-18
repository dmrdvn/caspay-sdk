import { SDK_VERSION } from '../version';
import type { CasPayConfig, CasPayError } from '../types';

export class HttpClient {
  private readonly baseUrl: string;
  private apiKey: string;
  private merchantId: string;

  constructor(config: CasPayConfig) {
    this.apiKey = config.apiKey;
    this.merchantId = config.merchantId;
    this.baseUrl = config.baseUrl || 'https://caspay.link/api';

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
          'X-CasPay-SDK-Version': SDK_VERSION,
          'User-Agent': `CasPay-SDK-JS/${SDK_VERSION}`,
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
      if (error.error && error.code) {
        throw error;
      }
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

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async validateApiKey(): Promise<void> {
    const url = `${this.baseUrl}/v1/validate-key`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-CasPay-Key': this.apiKey,
          'X-CasPay-SDK-Version': SDK_VERSION,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        throw {
          error: data.error || 'Invalid API key',
          code: 'INVALID_API_KEY',
          status: response.status,
        } as CasPayError;
      }
    } catch (error: any) {
      if (error.code === 'INVALID_API_KEY') {
        throw error;
      }
      throw {
        error: error.message || 'API key validation failed',
        code: 'VALIDATION_ERROR',
        status: 0,
      } as CasPayError;
    }
  }
}
