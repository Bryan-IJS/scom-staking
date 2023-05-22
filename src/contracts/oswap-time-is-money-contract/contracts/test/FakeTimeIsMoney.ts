import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./FakeTimeIsMoney.json";

export class FakeTimeIsMoney extends _Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(token:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([token], options);
    }
    parseDepositEvent(receipt: TransactionReceipt): FakeTimeIsMoney.DepositEvent[]{
        return this.parseEvents(receipt, "Deposit").map(e=>this.decodeDepositEvent(e));
    }
    decodeDepositEvent(event: Event): FakeTimeIsMoney.DepositEvent{
        let result = event.data;
        return {
            account: result.account,
            amount: new BigNumber(result.amount),
            _event: event
        };
    }
    parseWithdrawalEvent(receipt: TransactionReceipt): FakeTimeIsMoney.WithdrawalEvent[]{
        return this.parseEvents(receipt, "Withdrawal").map(e=>this.decodeWithdrawalEvent(e));
    }
    decodeWithdrawalEvent(event: Event): FakeTimeIsMoney.WithdrawalEvent{
        let result = event.data;
        return {
            account: result.account,
            amount: new BigNumber(result.amount),
            heldLongEnough: result.heldLongEnough,
            _event: event
        };
    }
    amount: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    endOfEntryPeriod: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    getCredit: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    lock: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<void>;
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
        (param1:string, options?: TransactionOptions): Promise<boolean>;
    }
    releaseTime: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    setAmount: {
        (amount:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (amount:number|BigNumber, options?: TransactionOptions) => Promise<void>;
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
        (param1:boolean, options?: TransactionOptions): Promise<void>;
    }
    withdrawn: {
        (param1:string, options?: TransactionOptions): Promise<boolean>;
    }
    private assign(){
        let amount_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('amount',[],options);
            return new BigNumber(result);
        }
        this.amount = amount_call
        let endOfEntryPeriod_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('endOfEntryPeriod',[],options);
            return new BigNumber(result);
        }
        this.endOfEntryPeriod = endOfEntryPeriod_call
        let getCredit_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getCredit',[param1],options);
            return new BigNumber(result);
        }
        this.getCredit = getCredit_call
        let lock_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('lock',[this.wallet.utils.toString(param1)],options);
            return;
        }
        this.lock = lock_call
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
        let readyToWithdraw_call = async (param1:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('readyToWithdraw',[param1],options);
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
        let withdraw_call = async (param1:boolean, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('withdraw',[param1],options);
            return;
        }
        this.withdraw = withdraw_call
        let withdrawn_call = async (param1:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('withdrawn',[param1],options);
            return result;
        }
        this.withdrawn = withdrawn_call
        let setAmount_send = async (amount:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setAmount',[this.wallet.utils.toString(amount)],options);
            return result;
        }
        let setAmount_call = async (amount:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setAmount',[this.wallet.utils.toString(amount)],options);
            return;
        }
        this.setAmount = Object.assign(setAmount_send, {
            call:setAmount_call
        });
    }
}
export module FakeTimeIsMoney{
    export interface DepositEvent {account:string,amount:BigNumber,_event:Event}
    export interface WithdrawalEvent {account:string,amount:BigNumber,heldLongEnough:boolean,_event:Event}
}