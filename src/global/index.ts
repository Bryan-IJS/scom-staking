import { INetwork } from '@ijstech/eth-wallet';

export interface IExtendedNetwork extends INetwork {
    shortName?: string;
    isDisabled?: boolean;
    isMainChain?: boolean;
    isCrossChainSupported?: boolean;
    explorerName?: string;
    explorerTxUrl?: string;
    explorerAddressUrl?: string;
    isTestnet?: boolean;
    symbol?: string;
    env?: string;
};

export const enum EventId {
    ConnectWallet = 'connectWallet',
    ChangeNetwork = 'changeNetwork',
    IsWalletConnected = 'isWalletConnected',
    IsWalletDisconnected = 'IsWalletDisconnected',
    Paid = 'Paid',
    chainChanged = 'chainChanged',
    EmitButtonStatus = 'stakingEmitButtonStatus',
    EmitInput = 'stakingEmitInput',
    EmitNewToken = 'emitNewToken',
}

export * from './utils/index';
