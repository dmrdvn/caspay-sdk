import {
  Deploy,
  DeployHeader,
  ExecutableDeployItem,
  TransferDeployItem,
  PublicKey,
} from 'casper-js-sdk';
import type { Wallet } from '../resources/wallet';
import type { WalletError, TransferParams, TransferResult } from '../types';

const CSPR_TO_MOTES = 1_000_000_000;
const DEFAULT_PAYMENT_AMOUNT = '100000000';

export class Transfer {
  private wallet: Wallet;
  private apiBaseUrl: string;

  constructor(wallet: Wallet, apiBaseUrl: string) {
    this.wallet = wallet;
    this.apiBaseUrl = apiBaseUrl;
  }

  async execute(params: TransferParams): Promise<TransferResult> {
    const senderAddress = await this.wallet.getAddress();
    
    if (!senderAddress) {
      const error: WalletError = {
        code: 'WALLET_NOT_FOUND',
        message: 'Please connect your wallet first.',
      };
      throw error;
    }

    const provider = this.wallet.getProvider();
    if (!provider) {
      const error: WalletError = {
        code: 'WALLET_NOT_FOUND',
        message: 'Wallet provider not available.',
      };
      throw error;
    }

    const amountInMotes = Math.floor(params.amount * CSPR_TO_MOTES).toString();
    const network = this.wallet.getNetwork();
    const transferId = Date.now();

    try {
      const senderPublicKey = PublicKey.fromHex(senderAddress);
      const recipientPublicKey = PublicKey.fromHex(params.recipientAddress);

      const session = new ExecutableDeployItem();
      session.transfer = TransferDeployItem.newTransfer(
        amountInMotes,
        recipientPublicKey,
        undefined,
        transferId
      );

      const payment = ExecutableDeployItem.standardPayment(DEFAULT_PAYMENT_AMOUNT);

      const deployHeader = DeployHeader.default();
      deployHeader.account = senderPublicKey;
      deployHeader.chainName = network;

      const deploy = Deploy.makeDeploy(deployHeader, payment, session);

      const deployJson = Deploy.toJSON(deploy);

      const signResult = await provider.sign(
        JSON.stringify(deployJson),
        senderAddress
      );

      if (signResult.cancelled) {
        const error: WalletError = {
          code: 'TRANSFER_REJECTED',
          message: 'Transfer was cancelled by the user.',
        };
        throw error;
      }

      const algorithmTag = senderAddress.substring(0, 2);
      
      const signatureHex = typeof signResult.signature === 'string'
        ? signResult.signature
        : Array.from(signResult.signature as Uint8Array)
            .map((b: number) => b.toString(16).padStart(2, '0'))
            .join('');
      
      const signatureWithTag = algorithmTag + signatureHex;

      const signedDeployJson = Deploy.toJSON(deploy) as Record<string, any>;
      signedDeployJson.approvals = [
        {
          signer: senderAddress,
          signature: signatureWithTag,
        },
      ];

      const isMainnet = network === 'casper';
      
      const rpcProxyUrl = `${this.apiBaseUrl}/rpc`;
      
      const response = await fetch(rpcProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deploy: signedDeployJson,
          network: isMainnet ? 'mainnet' : 'testnet',
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        throw new Error(result.error || 'RPC request failed');
      }
      
      const deployHash = result.deploy_hash;

      return {
        deployHash,
        senderAddress,
        recipientAddress: params.recipientAddress,
        amount: params.amount,
      };
    } catch (error: any) {
      if (error.code === 'TRANSFER_REJECTED') {
        throw error;
      }

      if (error.cancelled || error.code === 2 || error.message?.includes('rejected') || error.message?.includes('cancel')) {
        const walletError: WalletError = {
          code: 'TRANSFER_REJECTED',
          message: 'Transfer was cancelled by the user.',
        };
        throw walletError;
      }

      const walletError: WalletError = {
        code: 'NETWORK_ERROR',
        message: error.message || 'Failed to execute transfer.',
      };
      throw walletError;
    }
  }
}
