import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./ProxyV2.json";
export interface IClaimantIdsParams {param1:string;param2:string}
export interface IEthInParams {target:string;commissions:{to:string,amount:number|BigNumber}[];data:string}
export interface IGetClaimantBalanceParams {claimant:string;token:string}
export interface IGetClaimantsInfoParams {fromId:number|BigNumber;count:number|BigNumber}
export interface IProxyCallParams {target:string;tokensIn:{token:string,amount:number|BigNumber,directTransfer:boolean,commissions:{to:string,amount:number|BigNumber}[],totalCommissions:number|BigNumber}[];to:string;tokensOut:string[];data:string}
export interface ITokenInParams {target:string;tokensIn:{token:string,amount:number|BigNumber,directTransfer:boolean,commissions:{to:string,amount:number|BigNumber}[],totalCommissions:number|BigNumber};data:string}
export class ProxyV2 extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(options?: TransactionOptions): Promise<string>{
        return this.__deploy([], options);
    }
    parseAddCommissionEvent(receipt: TransactionReceipt): ProxyV2.AddCommissionEvent[]{
        return this.parseEvents(receipt, "AddCommission").map(e=>this.decodeAddCommissionEvent(e));
    }
    decodeAddCommissionEvent(event: Event): ProxyV2.AddCommissionEvent{
        let result = event.data;
        return {
            to: result.to,
            token: result.token,
            amount: new BigNumber(result.amount),
            _event: event
        };
    }
    parseClaimEvent(receipt: TransactionReceipt): ProxyV2.ClaimEvent[]{
        return this.parseEvents(receipt, "Claim").map(e=>this.decodeClaimEvent(e));
    }
    decodeClaimEvent(event: Event): ProxyV2.ClaimEvent{
        let result = event.data;
        return {
            from: result.from,
            token: result.token,
            amount: new BigNumber(result.amount),
            _event: event
        };
    }
    parseSkimEvent(receipt: TransactionReceipt): ProxyV2.SkimEvent[]{
        return this.parseEvents(receipt, "Skim").map(e=>this.decodeSkimEvent(e));
    }
    decodeSkimEvent(event: Event): ProxyV2.SkimEvent{
        let result = event.data;
        return {
            token: result.token,
            to: result.to,
            amount: new BigNumber(result.amount),
            _event: event
        };
    }
    parseTransferBackEvent(receipt: TransactionReceipt): ProxyV2.TransferBackEvent[]{
        return this.parseEvents(receipt, "TransferBack").map(e=>this.decodeTransferBackEvent(e));
    }
    decodeTransferBackEvent(event: Event): ProxyV2.TransferBackEvent{
        let result = event.data;
        return {
            target: result.target,
            token: result.token,
            sender: result.sender,
            amount: new BigNumber(result.amount),
            _event: event
        };
    }
    parseTransferForwardEvent(receipt: TransactionReceipt): ProxyV2.TransferForwardEvent[]{
        return this.parseEvents(receipt, "TransferForward").map(e=>this.decodeTransferForwardEvent(e));
    }
    decodeTransferForwardEvent(event: Event): ProxyV2.TransferForwardEvent{
        let result = event.data;
        return {
            target: result.target,
            token: result.token,
            sender: result.sender,
            amount: new BigNumber(result.amount),
            commissions: new BigNumber(result.commissions),
            _event: event
        };
    }
    claim: {
        (token:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (token:string, options?: TransactionOptions) => Promise<void>;
        txData: (token:string, options?: TransactionOptions) => Promise<string>;
    }
    claimMultiple: {
        (tokens:string[], options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (tokens:string[], options?: TransactionOptions) => Promise<void>;
        txData: (tokens:string[], options?: TransactionOptions) => Promise<string>;
    }
    claimantIdCount: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    claimantIds: {
        (params: IClaimantIdsParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    claimantsInfo: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<{claimant:string,token:string,balance:BigNumber}>;
    }
    ethIn: {
        (params: IEthInParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IEthInParams, options?: number|BigNumber|TransactionOptions) => Promise<void>;
        txData: (params: IEthInParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    getClaimantBalance: {
        (params: IGetClaimantBalanceParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getClaimantsInfo: {
        (params: IGetClaimantsInfoParams, options?: TransactionOptions): Promise<{claimant:string,token:string,balance:BigNumber}[]>;
    }
    lastBalance: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    proxyCall: {
        (params: IProxyCallParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IProxyCallParams, options?: number|BigNumber|TransactionOptions) => Promise<void>;
        txData: (params: IProxyCallParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    skim: {
        (tokens:string[], options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (tokens:string[], options?: TransactionOptions) => Promise<void>;
        txData: (tokens:string[], options?: TransactionOptions) => Promise<string>;
    }
    tokenIn: {
        (params: ITokenInParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ITokenInParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ITokenInParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let claimantIdCount_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('claimantIdCount',[],options);
            return new BigNumber(result);
        }
        this.claimantIdCount = claimantIdCount_call
        let claimantIdsParams = (params: IClaimantIdsParams) => [params.param1,params.param2];
        let claimantIds_call = async (params: IClaimantIdsParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('claimantIds',claimantIdsParams(params),options);
            return new BigNumber(result);
        }
        this.claimantIds = claimantIds_call
        let claimantsInfo_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<{claimant:string,token:string,balance:BigNumber}> => {
            let result = await this.call('claimantsInfo',[this.wallet.utils.toString(param1)],options);
            return {
                claimant: result.claimant,
                token: result.token,
                balance: new BigNumber(result.balance)
            };
        }
        this.claimantsInfo = claimantsInfo_call
        let getClaimantBalanceParams = (params: IGetClaimantBalanceParams) => [params.claimant,params.token];
        let getClaimantBalance_call = async (params: IGetClaimantBalanceParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getClaimantBalance',getClaimantBalanceParams(params),options);
            return new BigNumber(result);
        }
        this.getClaimantBalance = getClaimantBalance_call
        let getClaimantsInfoParams = (params: IGetClaimantsInfoParams) => [this.wallet.utils.toString(params.fromId),this.wallet.utils.toString(params.count)];
        let getClaimantsInfo_call = async (params: IGetClaimantsInfoParams, options?: TransactionOptions): Promise<{claimant:string,token:string,balance:BigNumber}[]> => {
            let result = await this.call('getClaimantsInfo',getClaimantsInfoParams(params),options);
            return (result.map(e=>(
                {
                    claimant: e.claimant,
                    token: e.token,
                    balance: new BigNumber(e.balance)
                }
            )));
        }
        this.getClaimantsInfo = getClaimantsInfo_call
        let lastBalance_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('lastBalance',[param1],options);
            return new BigNumber(result);
        }
        this.lastBalance = lastBalance_call
        let claim_send = async (token:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('claim',[token],options);
            return result;
        }
        let claim_call = async (token:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('claim',[token],options);
            return;
        }
        let claim_txData = async (token:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('claim',[token],options);
            return result;
        }
        this.claim = Object.assign(claim_send, {
            call:claim_call
            , txData:claim_txData
        });
        let claimMultiple_send = async (tokens:string[], options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('claimMultiple',[tokens],options);
            return result;
        }
        let claimMultiple_call = async (tokens:string[], options?: TransactionOptions): Promise<void> => {
            let result = await this.call('claimMultiple',[tokens],options);
            return;
        }
        let claimMultiple_txData = async (tokens:string[], options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('claimMultiple',[tokens],options);
            return result;
        }
        this.claimMultiple = Object.assign(claimMultiple_send, {
            call:claimMultiple_call
            , txData:claimMultiple_txData
        });
        let ethInParams = (params: IEthInParams) => [params.target,params.commissions.map(e=>([e.to,this.wallet.utils.toString(e.amount)])),this.wallet.utils.stringToBytes(params.data)];
        let ethIn_send = async (params: IEthInParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('ethIn',ethInParams(params),options);
            return result;
        }
        let ethIn_call = async (params: IEthInParams, options?: number|BigNumber|TransactionOptions): Promise<void> => {
            let result = await this.call('ethIn',ethInParams(params),options);
            return;
        }
        let ethIn_txData = async (params: IEthInParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('ethIn',ethInParams(params),options);
            return result;
        }
        this.ethIn = Object.assign(ethIn_send, {
            call:ethIn_call
            , txData:ethIn_txData
        });
        let proxyCallParams = (params: IProxyCallParams) => [params.target,params.tokensIn.map(e=>([e.token,this.wallet.utils.toString(e.amount),e.directTransfer,e.commissions.map(e=>([e.to,this.wallet.utils.toString(e.amount)])),this.wallet.utils.toString(e.totalCommissions)])),params.to,params.tokensOut,this.wallet.utils.stringToBytes(params.data)];
        let proxyCall_send = async (params: IProxyCallParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('proxyCall',proxyCallParams(params),options);
            return result;
        }
        let proxyCall_call = async (params: IProxyCallParams, options?: number|BigNumber|TransactionOptions): Promise<void> => {
            let result = await this.call('proxyCall',proxyCallParams(params),options);
            return;
        }
        let proxyCall_txData = async (params: IProxyCallParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('proxyCall',proxyCallParams(params),options);
            return result;
        }
        this.proxyCall = Object.assign(proxyCall_send, {
            call:proxyCall_call
            , txData:proxyCall_txData
        });
        let skim_send = async (tokens:string[], options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('skim',[tokens],options);
            return result;
        }
        let skim_call = async (tokens:string[], options?: TransactionOptions): Promise<void> => {
            let result = await this.call('skim',[tokens],options);
            return;
        }
        let skim_txData = async (tokens:string[], options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('skim',[tokens],options);
            return result;
        }
        this.skim = Object.assign(skim_send, {
            call:skim_call
            , txData:skim_txData
        });
        let tokenInParams = (params: ITokenInParams) => [params.target,[params.tokensIn.token,this.wallet.utils.toString(params.tokensIn.amount),params.tokensIn.directTransfer,params.tokensIn.commissions.map(e=>([e.to,this.wallet.utils.toString(e.amount)])),this.wallet.utils.toString(params.tokensIn.totalCommissions)],this.wallet.utils.stringToBytes(params.data)];
        let tokenIn_send = async (params: ITokenInParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('tokenIn',tokenInParams(params),options);
            return result;
        }
        let tokenIn_call = async (params: ITokenInParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('tokenIn',tokenInParams(params),options);
            return;
        }
        let tokenIn_txData = async (params: ITokenInParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('tokenIn',tokenInParams(params),options);
            return result;
        }
        this.tokenIn = Object.assign(tokenIn_send, {
            call:tokenIn_call
            , txData:tokenIn_txData
        });
    }
}
export module ProxyV2{
    export interface AddCommissionEvent {to:string,token:string,amount:BigNumber,_event:Event}
    export interface ClaimEvent {from:string,token:string,amount:BigNumber,_event:Event}
    export interface SkimEvent {token:string,to:string,amount:BigNumber,_event:Event}
    export interface TransferBackEvent {target:string,token:string,sender:string,amount:BigNumber,_event:Event}
    export interface TransferForwardEvent {target:string,token:string,sender:string,amount:BigNumber,commissions:BigNumber,_event:Event}
}