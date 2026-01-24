export interface CasPayConfig {
  apiKey: string;
  merchantId: string;
  walletAddress: string;
  network?: 'mainnet' | 'testnet';
  baseUrl?: string;
}

export interface PaymentCreateParams {
  senderAddress: string;
  transactionHash?: string;
  productId?: string;
  subscriptionPlanId?: string;
  amount: number;
  currency?: string;
}

export interface SubscriptionCreateParams {
  senderAddress: string;
  transactionHash?: string;
  planId: string;
  amount: number;
  currency?: string;
}

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

export interface CasPayError {
  error: string;
  code: string;
  status?: number;
}

export interface MakePaymentParams {
  productId?: string;
  subscriptionPlanId?: string;
  amount: number;
  currency?: string;
}

export interface MakePaymentResult {
  success: boolean;
  transactionHash: string;
  payment?: PaymentResponse;
  error?: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  locked: boolean;
}

export interface WalletInfo {
  isConnected: boolean;
  address: string | null;
}

export interface WalletError {
  code: 'WALLET_NOT_FOUND' | 'WALLET_LOCKED' | 'CONNECTION_REJECTED' | 'TRANSFER_REJECTED' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  installUrl?: string;
}

export interface TransferParams {
  recipientAddress: string;
  amount: number;
}

export interface TransferResult {
  deployHash: string;
  senderAddress: string;
  recipientAddress: string;
  amount: number;
}

export interface SubscriptionCheckParams {
  subscriberAddress: string;
  planId?: string;
  network?: 'testnet' | 'mainnet';
}

export interface SubscriptionCheckResponse {
  success: boolean;
  active: boolean;
  subscriptions?: Array<{
    id: string;
    plan_id: string;
    subscriber_address: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    created_at: string;
  }>;
  message?: string;
}
