# CasPay SDK

Official JavaScript/TypeScript SDK for CasPay - Accept crypto payments with Casper blockchain.

[![npm version](https://img.shields.io/npm/v/@caspay/sdk)](https://www.npmjs.com/package/@caspay/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Installation

### NPM / Yarn (React, Next.js, Node.js)

```bash
npm install @caspay/sdk
# or
yarn add @caspay/sdk
```

### CDN (WordPress, HTML)

```html
<script src="https://cdn.jsdelivr.net/npm/@caspay/sdk@1.0.0/dist/caspay.min.js"></script>
```

## 📖 Quick Start

### React / Next.js

```typescript
import CasPay from '@caspay/sdk';

const caspay = new CasPay({
  apiKey: 'cp_live_...',
  merchantId: 'MERCH_...'
});

// Create a payment
const payment = await caspay.payments.create({
  senderAddress: '0x123...',
  productId: 'prod_abc123',
  amount: 100,
  currency: 'USD'
});

console.log('Payment successful:', payment);
```

### WordPress / HTML

```html
<script src="https://cdn.jsdelivr.net/npm/@caspay/sdk@1.0.0/dist/caspay.min.js"></script>

<button id="payBtn">Pay Now</button>

<script>
  const caspay = new CasPay({
    apiKey: 'cp_live_...',
    merchantId: 'MERCH_...'
  });

  document.getElementById('payBtn').onclick = async () => {
    const payment = await caspay.payments.create({
      senderAddress: '0x123...',
      productId: 'prod_abc',
      amount: 50
    });
    
    alert('Payment successful!');
  };
</script>
```

## 🔧 Configuration

### Constructor Options

```typescript
const caspay = new CasPay({
  apiKey: string;        // Required: Your CasPay API key
  merchantId: string;    // Required: Your merchant ID
  baseUrl?: string;      // Optional: API base URL (default: https://api.caspay.link)
});
```

### Get API Keys

1. Sign up at [caspay.link](https://caspay.link)
2. Navigate to Settings → API Keys
3. Generate a new API key

## 📚 API Reference

### Payments

#### `caspay.payments.create(params)`

Create a new payment record.

**Parameters:**

```typescript
{
  senderAddress: string;           // Sender's Casper wallet address
  productId?: string;              // Product ID (for one-time payments)
  subscriptionPlanId?: string;     // Subscription plan ID (for recurring)
  amount: number;                  // Payment amount
  currency?: string;               // Currency code (default: USD)
  transactionHash?: string;        // Optional: Casper transaction hash
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
// One-time payment
const payment = await caspay.payments.create({
  senderAddress: '0x123...',
  productId: 'prod_abc123',
  amount: 100
});

// Subscription payment
const subscription = await caspay.payments.create({
  senderAddress: '0x123...',
  subscriptionPlanId: 'plan_xyz789',
  amount: 29.99
});
```

## 🛠️ Error Handling

All SDK methods throw structured errors:

```typescript
try {
  const payment = await caspay.payments.create({...});
} catch (error) {
  console.error('Error:', error.error);   // Error message
  console.error('Code:', error.code);     // Error code
  console.error('Status:', error.status); // HTTP status
}
```

### Common Error Codes

- `INVALID_PARAMS` - Missing or invalid parameters
- `INVALID_API_KEY` - Invalid API key
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `VERIFICATION_FAILED` - Transaction verification failed
- `NETWORK_ERROR` - Network connection error

## 🌐 Environment Support

| Environment | Installation | Import |
|-------------|--------------|--------|
| React/Next.js | `npm install @caspay/sdk` | `import CasPay from '@caspay/sdk'` |
| Node.js | `npm install @caspay/sdk` | `const CasPay = require('@caspay/sdk')` |
| WordPress | CDN script tag | `window.CasPay` |
| HTML | CDN script tag | `window.CasPay` |

## 🔒 Security

- **Never expose your API key** in client-side code in production
- Use environment variables for sensitive data
- API keys should be stored server-side
- Use test keys (`cp_test_...`) for development

## 📦 TypeScript Support

Full TypeScript support with type definitions included:

```typescript
import CasPay, { PaymentCreateParams, PaymentResponse } from '@caspay/sdk';

const params: PaymentCreateParams = {
  senderAddress: '0x123...',
  productId: 'prod_abc',
  amount: 100
};

const payment: PaymentResponse = await caspay.payments.create(params);
```

## 🔗 Links

- **Documentation:** [docs.caspay.link](https://docs.caspay.link)
- **Dashboard:** [caspay.link](https://caspay.link)
- **NPM:** [@caspay/sdk](https://www.npmjs.com/package/@caspay/sdk)
- **GitHub:** [dmrdvn/caspay-sdk](https://github.com/dmrdvn/caspay-sdk)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Support

- Email: support@caspay.link
- Issues: [GitHub Issues](https://github.com/dmrdvn/caspay-sdk/issues)

---

Made with ❤️ by CasPay Team
