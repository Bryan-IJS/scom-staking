import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./Rewards.json";
export interface IDeployParams {timeIsMoney:string;token:string;multiplier:number|BigNumber;initialReward:number|BigNumber;vestingPeriod:number|BigNumber;claimDeadline:number|BigNumber;admin:string}
export interface IPutFundParams {from:string;amount:number|BigNumber}
export class Rewards extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.timeIsMoney,params.token,this.wallet.utils.toString(params.multiplier),this.wallet.utils.toString(params.initialReward),this.wallet.utils.toString(params.vestingPeriod),this.wallet.utils.toString(params.claimDeadline),params.admin], options);
    }
    parseAdminDrainEvent(receipt: TransactionReceipt): Rewards.AdminDrainEvent[]{
        return this.parseEvents(receipt, "AdminDrain").map(e=>this.decodeAdminDrainEvent(e));
    }
    decodeAdminDrainEvent(event: Event): Rewards.AdminDrainEvent{
        let result = event.data;
        return {
            amount: new BigNumber(result.amount),
            _event: event
        };
    }
    parseClaimEvent(receipt: TransactionReceipt): Rewards.ClaimEvent[]{
        return this.parseEvents(receipt, "Claim").map(e=>this.decodeClaimEvent(e));
    }
    decodeClaimEvent(event: Event): Rewards.ClaimEvent{
        let result = event.data;
        return {
            account: result.account,
            amount: new BigNumber(result.amount),
            totalSoFar: new BigNumber(result.totalSoFar),
            _event: event
        };
    }
    admin: {
        (options?: TransactionOptions): Promise<string>;
    }
    claim: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    claimDeadline: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    claimFor: {
        (account:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (account:string, options?: TransactionOptions) => Promise<void>;
        txData: (account:string, options?: TransactionOptions) => Promise<string>;
    }
    claimSoFar: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    initialReward: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    multiplier: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    putFund: {
        (params: IPutFundParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IPutFundParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IPutFundParams, options?: TransactionOptions) => Promise<string>;
    }
    reward: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    rewardForAccount: {
        (account:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    takeUnclaimed: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    timeIsMoney: {
        (options?: TransactionOptions): Promise<string>;
    }
    token: {
        (options?: TransactionOptions): Promise<string>;
    }
    unclaimed: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    unclaimedForAccount: {
        (account:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    vestingPeriod: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    private assign(){
        let admin_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('admin',[],options);
            return result;
        }
        this.admin = admin_call
        let claimDeadline_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('claimDeadline',[],options);
            return new BigNumber(result);
        }
        this.claimDeadline = claimDeadline_call
        let claimSoFar_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('claimSoFar',[param1],options);
            return new BigNumber(result);
        }
        this.claimSoFar = claimSoFar_call
        let initialReward_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('initialReward',[],options);
            return new BigNumber(result);
        }
        this.initialReward = initialReward_call
        let multiplier_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('multiplier',[],options);
            return new BigNumber(result);
        }
        this.multiplier = multiplier_call
        let reward_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('reward',[],options);
            return new BigNumber(result);
        }
        this.reward = reward_call
        let rewardForAccount_call = async (account:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('rewardForAccount',[account],options);
            return new BigNumber(result);
        }
        this.rewardForAccount = rewardForAccount_call
        let timeIsMoney_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('timeIsMoney',[],options);
            return result;
        }
        this.timeIsMoney = timeIsMoney_call
        let token_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('token',[],options);
            return result;
        }
        this.token = token_call
        let unclaimed_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('unclaimed',[],options);
            return new BigNumber(result);
        }
        this.unclaimed = unclaimed_call
        let unclaimedForAccount_call = async (account:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('unclaimedForAccount',[account],options);
            return new BigNumber(result);
        }
        this.unclaimedForAccount = unclaimedForAccount_call
        let vestingPeriod_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('vestingPeriod',[],options);
            return new BigNumber(result);
        }
        this.vestingPeriod = vestingPeriod_call
        let claim_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('claim',[],options);
            return result;
        }
        let claim_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('claim',[],options);
            return;
        }
        let claim_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('claim',[],options);
            return result;
        }
        this.claim = Object.assign(claim_send, {
            call:claim_call
            , txData:claim_txData
        });
        let claimFor_send = async (account:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('claimFor',[account],options);
            return result;
        }
        let claimFor_call = async (account:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('claimFor',[account],options);
            return;
        }
        let claimFor_txData = async (account:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('claimFor',[account],options);
            return result;
        }
        this.claimFor = Object.assign(claimFor_send, {
            call:claimFor_call
            , txData:claimFor_txData
        });
        let putFundParams = (params: IPutFundParams) => [params.from,this.wallet.utils.toString(params.amount)];
        let putFund_send = async (params: IPutFundParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('putFund',putFundParams(params),options);
            return result;
        }
        let putFund_call = async (params: IPutFundParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('putFund',putFundParams(params),options);
            return;
        }
        let putFund_txData = async (params: IPutFundParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('putFund',putFundParams(params),options);
            return result;
        }
        this.putFund = Object.assign(putFund_send, {
            call:putFund_call
            , txData:putFund_txData
        });
        let takeUnclaimed_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('takeUnclaimed',[],options);
            return result;
        }
        let takeUnclaimed_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('takeUnclaimed',[],options);
            return;
        }
        let takeUnclaimed_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('takeUnclaimed',[],options);
            return result;
        }
        this.takeUnclaimed = Object.assign(takeUnclaimed_send, {
            call:takeUnclaimed_call
            , txData:takeUnclaimed_txData
        });
    }
}
export module Rewards{
    export interface AdminDrainEvent {amount:BigNumber,_event:Event}
    export interface ClaimEvent {account:string,amount:BigNumber,totalSoFar:BigNumber,_event:Event}
}