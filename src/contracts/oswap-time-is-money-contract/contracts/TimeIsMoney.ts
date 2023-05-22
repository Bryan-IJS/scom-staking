import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./TimeIsMoney.json";
export interface IDeployParams {token:string;maximumTotalLock:number|BigNumber;minimumLockTime:number|BigNumber;startOfEntryPeriod:number|BigNumber;endOfEntryPeriod:number|BigNumber;perAddressCap:number|BigNumber}
export class TimeIsMoney extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.token,this.wallet.utils.toString(params.maximumTotalLock),this.wallet.utils.toString(params.minimumLockTime),this.wallet.utils.toString(params.startOfEntryPeriod),this.wallet.utils.toString(params.endOfEntryPeriod),this.wallet.utils.toString(params.perAddressCap)], options);
    }
    parseDepositEvent(receipt: TransactionReceipt): TimeIsMoney.DepositEvent[]{
        return this.parseEvents(receipt, "Deposit").map(e=>this.decodeDepositEvent(e));
    }
    decodeDepositEvent(event: Event): TimeIsMoney.DepositEvent{
        let result = event.data;
        return {
            account: result.account,
            amount: new BigNumber(result.amount),
            _event: event
        };
    }
    parseWithdrawalEvent(receipt: TransactionReceipt): TimeIsMoney.WithdrawalEvent[]{
        return this.parseEvents(receipt, "Withdrawal").map(e=>this.decodeWithdrawalEvent(e));
    }
    decodeWithdrawalEvent(event: Event): TimeIsMoney.WithdrawalEvent{
        let result = event.data;
        return {
            account: result.account,
            amount: new BigNumber(result.amount),
            heldLongEnough: result.heldLongEnough,
            _event: event
        };
    }
    endOfEntryPeriod: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    getCredit: {
        (account:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    lock: {
        (amount:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (amount:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (amount:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    lockAmount: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    maximumTotalLock: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    minimumLockTime: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    perAddressCap: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    readyToWithdraw: {
        (account:string, options?: TransactionOptions): Promise<boolean>;
    }
    releaseTime: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    startOfEntryPeriod: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    token: {
        (options?: TransactionOptions): Promise<string>;
    }
    totalLocked: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    withdraw: {
        (allowWithdrawalBeforeRelease:boolean, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (allowWithdrawalBeforeRelease:boolean, options?: TransactionOptions) => Promise<void>;
        txData: (allowWithdrawalBeforeRelease:boolean, options?: TransactionOptions) => Promise<string>;
    }
    withdrawn: {
        (param1:string, options?: TransactionOptions): Promise<boolean>;
    }
    private assign(){
        let endOfEntryPeriod_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('endOfEntryPeriod',[],options);
            return new BigNumber(result);
        }
        this.endOfEntryPeriod = endOfEntryPeriod_call
        let getCredit_call = async (account:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getCredit',[account],options);
            return new BigNumber(result);
        }
        this.getCredit = getCredit_call
        let lockAmount_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('lockAmount',[param1],options);
            return new BigNumber(result);
        }
        this.lockAmount = lockAmount_call
        let maximumTotalLock_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('maximumTotalLock',[],options);
            return new BigNumber(result);
        }
        this.maximumTotalLock = maximumTotalLock_call
        let minimumLockTime_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('minimumLockTime',[],options);
            return new BigNumber(result);
        }
        this.minimumLockTime = minimumLockTime_call
        let perAddressCap_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('perAddressCap',[],options);
            return new BigNumber(result);
        }
        this.perAddressCap = perAddressCap_call
        let readyToWithdraw_call = async (account:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('readyToWithdraw',[account],options);
            return result;
        }
        this.readyToWithdraw = readyToWithdraw_call
        let releaseTime_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('releaseTime',[param1],options);
            return new BigNumber(result);
        }
        this.releaseTime = releaseTime_call
        let startOfEntryPeriod_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('startOfEntryPeriod',[],options);
            return new BigNumber(result);
        }
        this.startOfEntryPeriod = startOfEntryPeriod_call
        let token_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('token',[],options);
            return result;
        }
        this.token = token_call
        let totalLocked_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('totalLocked',[],options);
            return new BigNumber(result);
        }
        this.totalLocked = totalLocked_call
        let withdrawn_call = async (param1:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('withdrawn',[param1],options);
            return result;
        }
        this.withdrawn = withdrawn_call
        let lock_send = async (amount:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('lock',[this.wallet.utils.toString(amount)],options);
            return result;
        }
        let lock_call = async (amount:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('lock',[this.wallet.utils.toString(amount)],options);
            return;
        }
        let lock_txData = async (amount:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('lock',[this.wallet.utils.toString(amount)],options);
            return result;
        }
        this.lock = Object.assign(lock_send, {
            call:lock_call
            , txData:lock_txData
        });
        let withdraw_send = async (allowWithdrawalBeforeRelease:boolean, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('withdraw',[allowWithdrawalBeforeRelease],options);
            return result;
        }
        let withdraw_call = async (allowWithdrawalBeforeRelease:boolean, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('withdraw',[allowWithdrawalBeforeRelease],options);
            return;
        }
        let withdraw_txData = async (allowWithdrawalBeforeRelease:boolean, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('withdraw',[allowWithdrawalBeforeRelease],options);
            return result;
        }
        this.withdraw = Object.assign(withdraw_send, {
            call:withdraw_call
            , txData:withdraw_txData
        });
    }
}
export module TimeIsMoney{
    export interface DepositEvent {account:string,amount:BigNumber,_event:Event}
    export interface WithdrawalEvent {account:string,amount:BigNumber,heldLongEnough:boolean,_event:Event}
}