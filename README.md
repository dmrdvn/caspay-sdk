# CasPay SDK

Official JavaScript/TypeScript SDK for CasPay - Accept crypto payments with Casper blockchain.

[![npm version](https://img.shields.io/npm/v/@caspay/sdk)](https://www.npmjs.com/package/@caspay/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **Two Integration Modes:**
  - **Full Management**: CasPay handles wallet connection, transfer & recording
  - **Tracking Only**: Merchant handles payment, CasPay tracks analytics
- **Casper Wallet Integration**: Seamless wallet connection and payments
- **Subscription Management**: Recurring payments with automatic tracking
- **TypeScript Support**: Full type definitions included
- **Framework Agnostic**: Works with React, Next.js, Vue, Vanilla JS, PHP

## 📦 Installation

### NPM / Yarn (React, Next.js, Node.js)

```bash
npm install @caspay/sdk
# or
yarn add @caspay/sdk
```

### CDN (PHP, HTML)

```html
<script src="https://cdn.jsdelivr.net/npm/@caspay/sdk@1.1.2/dist/caspay.min.js"></script>
```

> **Note**: Users only need to install **Casper Wallet browser extension**. No additional dependencies required.

## 📚 Quick Start

### Mode 1: Full Management (CasPay Handles Everything)

CasPay SDK manages wallet connection, blockchain transfer, and payment recording.

#### React / Next.js

```typescript
import CasPay from '@caspay/sdk';

const caspay = new CasPay({
  apiKey: 'cp_live_...',
  merchantId: 'MERCH_...',
  walletAddress: '01ab...', // Your wallet to receive payments
  network: 'testnet'
});

// One-time payment
const result = await caspay.payments.makePayment({
  productId: 'prod_abc123',
  amount: 10.5, // CSPR
});

// Subscription payment
const subResult = await caspay.payments.makePayment({
  subscriptionPlanId: 'plan_xyz789',
  amount: 29.99
});
```

#### PHP / Vanilla JS

```html
<script src="https://cdn.jsdelivr.net/npm/@caspay/sdk@1.1.2/dist/caspay.min.js"></script>

<button id="payBtn">Pay 10 CSPR</button>

<script>
  const caspay = new CasPay({
    apiKey: 'cp_live_...',
    merchantId: 'MERCH_...',
    walletAddress: '01ab...',
    network: 'testnet'
  });

  document.getElementById('payBtn').onclick = async () => {
    const result = await caspay.payments.makePayment({
      productId: 'prod_abc',
      amount: 10
    });
  };
</script>
```

### Mode 2: Tracking Only (Merchant Handles Payment)

Merchant integrates Casper Wallet separately, makes the payment, then records it with CasPay for analytics.

```typescript
// After merchant processes the payment with their own wallet integration:

const result = await caspay.payments.recordPayment({
  senderAddress: '0145ab...', // Customer's wallet address
  transactionHash: 'abc123...', // Casper blockchain tx hash
  productId: 'prod_abc123',
  amount: 10.5,
  currency: 'CSPR'
});


// For subscriptions:
const subResult = await caspay.payments.recordSubscription({
  senderAddress: '0145ab...',
  transactionHash: 'xyz789...',
  subscriptionPlanId: 'plan_monthly',
  amount: 29.99,
  currency: 'CSPR'
});
```

## 🔧 Configuration

### Constructor Options

```typescript
const caspay = new CasPay({
  apiKey: string;         // Required: Your CasPay API key
  merchantId: string;     // Required: Your merchant ID
  walletAddress: string;  // Required: Merchant wallet to receive payments
  network?: 'mainnet' | 'testnet';  // Optional: Default is testnet
  baseUrl?: string;       // Optional: API base URL (for development)
});
```

### Get API Keys

1. Sign up at [caspay.link](https://caspay.link)
2. Create and go the merchant page → API Keys
3. Generate a new API key

## 📚 API Reference

### Wallet

#### `caspay.wallet.connect()`

Connect to Casper Wallet extension.

```typescript
const address = await caspay.wallet.connect();
console.log('Connected:', address);
```

#### `caspay.wallet.disconnect()`

Disconnect from wallet.

```typescript
await caspay.wallet.disconnect();
```

#### `caspay.wallet.getAddress()`

Get current connected wallet address.

```typescript
const address = await caspay.wallet.getAddress();
console.log('Address:', address);
```

#### `caspay.wallet.getInfo()`

Get cached wallet connection info (synchronous).

```typescript
const info = caspay.wallet.getInfo();
console.log('Connected:', info.isConnected);
console.log('Address:', info.address);
```

#### `caspay.wallet.getState()`

Get complete wallet state (asynchronous).

```typescript
const state = await caspay.wallet.getState();
console.log('Connected:', state.connected);
console.log('Address:', state.address);
console.log('Locked:', state.locked);
```

### Payments

#### `caspay.payments.makePayment(params)` - Full Management

Make a payment with full wallet & transfer management.

**Parameters:**

```typescript
{
  productId?: string;              // Product ID (for one-time payments)
  subscriptionPlanId?: string;     // Subscription plan ID (for recurring)
  amount: number;                  // Payment amount in CSPR
  currency?: string;               // Currency code (default: CSPR)
}
```

**Returns:**

```typescript
{
  success: boolean;
  transactionHash: string;
  payment?: PaymentResponse;       // If successfully recorded
  error?: string;                  // If payment failed
}
```

**Example:**

```typescript
const result = await caspay.payments.makePayment({
  productId: 'prod_abc123',
  amount: 10.5
});
```

#### `caspay.payments.recordPayment(params)` - Tracking Only

Record a payment that was already processed by merchant.

**Parameters:**

```typescript
{
  senderAddress: string;           // Sender's Casper wallet address
  transactionHash?: string;        // Casper transaction hash (optional)
  productId?: string;              // Product ID (for one-time payments)
  subscriptionPlanId?: string;     // Subscription plan ID (for recurring)
  amount: number;                  // Payment amount
  currency?: string;               // Currency code (default: USD)
}
```

**Returns:**

```typescript
{
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
}
```

**Example:**

```typescript
const result = await caspay.payments.recordPayment({
  senderAddress: '0145ab...',
  transactionHash: 'abc123...',
  productId: 'prod_abc123',
  amount: 10.5,
  currency: 'CSPR'
});
```

#### `caspay.payments.recordSubscription(params)` - Tracking Only

Record a subscription payment (alias for recordPayment with subscriptionPlanId).

```typescript
const result = await caspay.payments.recordSubscription({
  senderAddress: '0145ab...',
  transactionHash: 'xyz789...',
  subscriptionPlanId: 'plan_monthly',
  amount: 29.99,
  currency: 'CSPR'
});
```

### Subscriptions

#### `caspay.subscriptions.checkStatus(params)`

Check subscription status for a subscriber.

**Parameters:**

```typescript
{
  subscriberAddress: string;  // Subscriber's wallet address
  planId?: string;            // Optional: Filter by specific plan
}
```

**Returns:**

```typescript
{
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
```

**Example:**

```typescript
// Check all subscriptions for a subscriber
const status = await caspay.subscriptions.checkStatus({
  subscriberAddress: '0145ab...'
});

console.log('Active:', status.active);
console.log('Subscriptions:', status.subscriptions);

// Check specific plan
const planStatus = await caspay.subscriptions.checkStatus({
  subscriberAddress: '0145ab...',
  planId: 'plan_monthly'
});
```

## 🛠️ Error Handling

All SDK methods throw structured errors:

```typescript
try {
  const payment = await caspay.payments.makePayment({...});
} catch (error) {
  console.error('Error:', error.error);   // Error message
  console.error('Code:', error.code);     // Error code
  console.error('Status:', error.status); // HTTP status
}
```

### Common Error Codes

- `INVALID_PARAMS` - Missing or invalid parameters
- `INVALID_API_KEY` - Invalid API key
- `WALLET_NOT_FOUND` - Casper Wallet extension not installed
- `WALLET_LOCKED` - Wallet is locked
- `CONNECTION_REJECTED` - User rejected wallet connection
- `TRANSFER_REJECTED` - User rejected transaction
- `NETWORK_ERROR` - Network connection error
- `VERIFICATION_FAILED` - Transaction verification failed

### Wallet Errors

```typescript
try {
  await caspay.wallet.connect();
} catch (error) {
  if (error.code === 'WALLET_NOT_FOUND') {
    // Prompt user to install Casper Wallet
    window.open(error.installUrl, '_blank');
  } else if (error.code === 'WALLET_LOCKED') {
    alert('Please unlock your Casper Wallet');
  } else if (error.code === 'CONNECTION_REJECTED') {
    alert('Connection rejected by user');
  }
}
```

## 🌐 Environment Support

| Environment | Installation | Import |
|-------------|--------------|--------|
| React/Next.js | `npm install @caspay/sdk` | `import CasPay from '@caspay/sdk'` |
| Node.js | `npm install @caspay/sdk` | `const CasPay = require('@caspay/sdk')` |
| PHP/Vanilla JS | CDN script tag | `window.CasPay` |


## 📦 TypeScript Support

Full TypeScript support with type definitions included:

```typescript
import CasPay, { 
  MakePaymentParams, 
  MakePaymentResult,
  PaymentCreateParams,
  PaymentResponse,
  SubscriptionCheckParams,
  SubscriptionCheckResponse,
  WalletState
} from '@caspay/sdk';

const params: MakePaymentParams = {
  productId: 'prod_abc',
  amount: 10.5
};

const result: MakePaymentResult = await caspay.payments.makePayment(params);
```

## 🎯 Integration Modes Comparison

| Feature | Full Management | Tracking Only |
|---------|----------------|---------------|
| Wallet Integration | ✅ CasPay SDK | ❌ Merchant implements |
| Blockchain Transfer | ✅ CasPay SDK | ❌ Merchant handles |
| Payment Recording | ✅ Automatic | ✅ Manual via SDK |
| Analytics Dashboard | ✅ Yes | ✅ Yes |
| Subscription Tracking | ✅ Yes | ✅ Yes |
| **Best For** | Simple integration | Custom wallet UX |

## 🔗 Links

- **Documentation:** [docs.caspay.link](https://docs.caspay.link)
- **Dashboard:** [caspay.link](https://caspay.link)
- **Demo:** [demo.caspay.link](https://caspay.link/demo.html)
- **NPM:** [@caspay/sdk](https://www.npmjs.com/package/@caspay/sdk)
- **GitHub:** [dmrdvn/caspay-sdk](https://github.com/dmrdvn/caspay-sdk)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Support

- Email: support@caspay.link
- Issues: [GitHub Issues](https://github.com/dmrdvn/caspay-sdk/issues)

---

Made with ❤️ by CasPay Team
