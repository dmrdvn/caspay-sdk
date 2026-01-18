import type { WalletState, WalletError, WalletInfo, CasPayConfig } from '../types';

const CASPER_WALLET_INSTALL_URL = 'https://www.casperwallet.io/';

export class Wallet {
  private provider: any = null;
  private config: CasPayConfig;
  private connected: boolean = false;
  private activeAddress: string | null = null;

  constructor(config: CasPayConfig) {
    this.config = config;
    this.initProvider();
  }

  private initProvider(): void {
    if (typeof window === 'undefined') return;

    const CasperWalletProvider = (window as any).CasperWalletProvider;
    if (CasperWalletProvider) {
      this.provider = CasperWalletProvider({ timeout: 30 * 60 * 1000 });
      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('casper-wallet:connected', (event: any) => {
      try {
        const state = JSON.parse(event.detail);
        this.connected = true;
        this.activeAddress = state.activeKey || null;
      } catch (e) {
      }
    });

    window.addEventListener('casper-wallet:disconnected', () => {
      this.connected = false;
      this.activeAddress = null;
    });

    window.addEventListener('casper-wallet:activeKeyChanged', (event: any) => {
      try {
        const state = JSON.parse(event.detail);
        this.activeAddress = state.activeKey || null;
      } catch (e) {
      }
    });

    window.addEventListener('casper-wallet:locked', () => {
      this.connected = false;
    });

    window.addEventListener('casper-wallet:unlocked', async () => {
      if (this.provider) {
        try {
          const isConnected = await this.provider.isConnected();
          this.connected = isConnected;
          if (isConnected) {
            this.activeAddress = await this.provider.getActivePublicKey();
          }
        } catch (e) {
        }
      }
    });
  }

  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).CasperWalletProvider;
  }

  async isConnected(): Promise<boolean> {
    if (!this.provider) {
      this.connected = false;
      return false;
    }

    try {
      const connected = await this.provider.isConnected();
      this.connected = connected;
      return connected;
    } catch (error: any) {
      this.connected = false;
      if (error.code === 1) {
        return false;
      }
      return false;
    }
  }

  async connect(): Promise<string> {
    if (!this.isAvailable()) {
      const error: WalletError = {
        code: 'WALLET_NOT_FOUND',
        message: 'Casper Wallet extension not found. Please install it first.',
        installUrl: CASPER_WALLET_INSTALL_URL,
      };
      throw error;
    }

    if (!this.provider) {
      this.initProvider();
    }

    if (!this.provider) {
      const error: WalletError = {
        code: 'WALLET_NOT_FOUND',
        message: 'Failed to initialize Casper Wallet provider.',
        installUrl: CASPER_WALLET_INSTALL_URL,
      };
      throw error;
    }

    try {
      const connected = await this.provider.requestConnection();

      if (!connected) {
        const error: WalletError = {
          code: 'CONNECTION_REJECTED',
          message: 'Wallet connection was rejected by the user.',
        };
        throw error;
      }

      this.connected = true;
      this.activeAddress = await this.provider.getActivePublicKey();

      if (!this.activeAddress) {
        const error: WalletError = {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to get wallet address after connection.',
        };
        throw error;
      }

      return this.activeAddress;
    } catch (error: any) {
      if (error.code === 'CONNECTION_REJECTED') {
        throw error;
      }

      if (error.code === 1) {
        const walletError: WalletError = {
          code: 'WALLET_LOCKED',
          message: 'Wallet is locked. Please unlock your Casper Wallet and try again.',
        };
        throw walletError;
      }

      const walletError: WalletError = {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'Failed to connect to wallet.',
      };
      throw walletError;
    }
  }

  async disconnect(): Promise<void> {
    if (this.provider) {
      try {
        await this.provider.disconnectFromSite();
      } catch (e) {
      }
    }
    this.connected = false;
    this.activeAddress = null;
  }

  async getAddress(): Promise<string | null> {
    if (!this.provider) {
      return null;
    }

    try {
      const isConnected = await this.isConnected();
      if (!isConnected) {
        return null;
      }

      this.activeAddress = await this.provider.getActivePublicKey();
      return this.activeAddress;
    } catch (error) {
      return null;
    }
  }

  getInfo(): WalletInfo {
    return {
      isConnected: this.connected,
      address: this.activeAddress,
    };
  }

  async getState(): Promise<WalletState> {
    const connected = await this.isConnected();
    const address = connected ? await this.getAddress() : null;

    return {
      connected,
      address,
      locked: !connected && this.isAvailable(),
    };
  }

  getProvider(): any {
    return this.provider;
  }

  getMerchantWalletAddress(): string {
    return this.config.walletAddress;
  }

  getNetwork(): string {
    return this.config.network === 'mainnet' ? 'casper' : 'casper-test';
  }

  async getActiveNetwork(): Promise<string> {
    if (!this.provider) {
      return this.getNetwork();
    }

    try {
      const network = await this.provider.getActiveNetwork?.();
      if (network) {
        // 'casper' or 'casper-test'
        return network;
      }
    } catch (error) {
    }

    return this.getNetwork();
  }

  async signDeploy(deploy: any): Promise<any> {
    if (!this.provider) {
      const error: WalletError = {
        code: 'WALLET_NOT_FOUND',
        message: 'Casper Wallet not available.',
        installUrl: CASPER_WALLET_INSTALL_URL,
      };
      throw error;
    }

    const isConnected = await this.isConnected();
    if (!isConnected) {
      await this.connect();
    }

    try {
      const deployJson = JSON.stringify(deploy);
      const signature = await this.provider.sign(deployJson, this.activeAddress);
      return signature;
    } catch (error: any) {
      if (error.code === 2 || error.message?.includes('rejected') || error.message?.includes('cancelled')) {
        const walletError: WalletError = {
          code: 'TRANSFER_REJECTED',
          message: 'Transaction was rejected by the user.',
        };
        throw walletError;
      }

      const walletError: WalletError = {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'Failed to sign deploy.',
      };
      throw walletError;
    }
  }
}
