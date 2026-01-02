/**
 * CasPay SDK Configuration
 */
export interface CasPayConfig {
  /** Your CasPay API key (starts with cp_live_ or cp_test_) */
  apiKey: string;
  /** Your merchant ID (starts with MERCH_) */
  merchantId: string;
  /** Optional: Override API base URL (default: https://api.caspay.link) */
  baseUrl?: string;
}

/**
 * Payment Creation Parameters
 */
export interface PaymentCreateParams {
  /** Sender's Casper wallet address */
  senderAddress: string;
  /** Optional: Casper transaction hash (auto-generated in mock mode) */
  transactionHash?: string;
  /** Product ID for one-time payments */
  productId?: string;
  /** Subscription plan ID for recurring payments */
  subscriptionPlanId?: string;
  /** Payment amount */
  amount: number;
  /** Currency code (default: USD) */
  currency?: string;
}

/**
 * Subscription Creation Parameters
 */
export interface SubscriptionCreateParams {
  /** Subscriber's Casper wallet address */
  senderAddress: string;
  /** Optional: Casper transaction hash */
  transactionHash?: string;
  /** Subscription plan ID */
  planId: string;
  /** Payment amount */
  amount: number;
  /** Currency code (default: USD) */
  currency?: string;
}

/**
 * Payment Response
 */
export interface PaymentResponse {
  success: boolean;
  payment: {
    id: string;
    transaction_hash: string;
    amount: number;
    token: string;
    status: string;
    invoice_number: string;
    created_at: string;
  };
  verification?: {
    verified: boolean;
    transaction_hash: string;
    amount: number;
  };
  duplicate?: boolean;
  responseTime?: string;
}

/**
 * Subscription Response
 */
export interface SubscriptionResponse {
  success: boolean;
  payment: {
    id: string;
    subscription_plan_id: string;
    amount: number;
    status: string;
  };
  subscription_id?: string;
}

/**
 * API Error Response
 */
export interface CasPayError {
  error: string;
  code: string;
  status?: number;
}
