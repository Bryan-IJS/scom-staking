import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./ERC20PresetMinterPauser.json";

export interface IDeployParams {name:string;symbol:string}
export interface IAllowanceParams {owner:string;spender:string}
export interface IApproveParams {spender:string;amount:number|BigNumber}
export interface IBurnFromParams {account:string;amount:number|BigNumber}
export interface IDecreaseAllowanceParams {spender:string;subtractedValue:number|BigNumber}
export interface IGetRoleMemberParams {role:string;index:number|BigNumber}
export interface IGrantRoleParams {role:string;account:string}
export interface IHasRoleParams {role:string;account:string}
export interface IIncreaseAllowanceParams {spender:string;addedValue:number|BigNumber}
export interface IMintParams {to:string;amount:number|BigNumber}
export interface IRenounceRoleParams {role:string;account:string}
export interface IRevokeRoleParams {role:string;account:string}
export interface ITransferParams {to:string;amount:number|BigNumber}
export interface ITransferFromParams {from:string;to:string;amount:number|BigNumber}
export class ERC20PresetMinterPauser extends _Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.name,params.symbol], options);
    }
    parseApprovalEvent(receipt: TransactionReceipt): ERC20PresetMinterPauser.ApprovalEvent[]{
        return this.parseEvents(receipt, "Approval").map(e=>this.decodeApprovalEvent(e));
    }
    decodeApprovalEvent(event: Event): ERC20PresetMinterPauser.ApprovalEvent{
        let result = event.data;
        return {
            owner: result.owner,
            spender: result.spender,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parsePausedEvent(receipt: TransactionReceipt): ERC20PresetMinterPauser.PausedEvent[]{
        return this.parseEvents(receipt, "Paused").map(e=>this.decodePausedEvent(e));
    }
    decodePausedEvent(event: Event): ERC20PresetMinterPauser.PausedEvent{
        let result = event.data;
        return {
            account: result.account,
            _event: event
        };
    }
    parseRoleAdminChangedEvent(receipt: TransactionReceipt): ERC20PresetMinterPauser.RoleAdminChangedEvent[]{
        return this.parseEvents(receipt, "RoleAdminChanged").map(e=>this.decodeRoleAdminChangedEvent(e));
    }
    decodeRoleAdminChangedEvent(event: Event): ERC20PresetMinterPauser.RoleAdminChangedEvent{
        let result = event.data;
        return {
            role: result.role,
            previousAdminRole: result.previousAdminRole,
            newAdminRole: result.newAdminRole,
            _event: event
        };
    }
    parseRoleGrantedEvent(receipt: TransactionReceipt): ERC20PresetMinterPauser.RoleGrantedEvent[]{
        return this.parseEvents(receipt, "RoleGranted").map(e=>this.decodeRoleGrantedEvent(e));
    }
    decodeRoleGrantedEvent(event: Event): ERC20PresetMinterPauser.RoleGrantedEvent{
        let result = event.data;
        return {
            role: result.role,
            account: result.account,
            sender: result.sender,
            _event: event
        };
    }
    parseRoleRevokedEvent(receipt: TransactionReceipt): ERC20PresetMinterPauser.RoleRevokedEvent[]{
        return this.parseEvents(receipt, "RoleRevoked").map(e=>this.decodeRoleRevokedEvent(e));
    }
    decodeRoleRevokedEvent(event: Event): ERC20PresetMinterPauser.RoleRevokedEvent{
        let result = event.data;
        return {
            role: result.role,
            account: result.account,
            sender: result.sender,
            _event: event
        };
    }
    parseTransferEvent(receipt: TransactionReceipt): ERC20PresetMinterPauser.TransferEvent[]{
        return this.parseEvents(receipt, "Transfer").map(e=>this.decodeTransferEvent(e));
    }
    decodeTransferEvent(event: Event): ERC20PresetMinterPauser.TransferEvent{
        let result = event.data;
        return {
            from: result.from,
            to: result.to,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parseUnpausedEvent(receipt: TransactionReceipt): ERC20PresetMinterPauser.UnpausedEvent[]{
        return this.parseEvents(receipt, "Unpaused").map(e=>this.decodeUnpausedEvent(e));
    }
    decodeUnpausedEvent(event: Event): ERC20PresetMinterPauser.UnpausedEvent{
        let result = event.data;
        return {
            account: result.account,
            _event: event
        };
    }
    DEFAULT_ADMIN_ROLE: {
        (options?: TransactionOptions): Promise<string>;
    }
    MINTER_ROLE: {
        (options?: TransactionOptions): Promise<string>;
    }
    PAUSER_ROLE: {
        (options?: TransactionOptions): Promise<string>;
    }
    allowance: {
        (params: IAllowanceParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    approve: {
        (params: IApproveParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IApproveParams, options?: TransactionOptions) => Promise<boolean>;
    }
    balanceOf: {
        (account:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    burn: {
        (amount:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (amount:number|BigNumber, options?: TransactionOptions) => Promise<void>;
    }
    burnFrom: {
        (params: IBurnFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IBurnFromParams, options?: TransactionOptions) => Promise<void>;
    }
    decimals: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    decreaseAllowance: {
        (params: IDecreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IDecreaseAllowanceParams, options?: TransactionOptions) => Promise<boolean>;
    }
    getRoleAdmin: {
        (role:string, options?: TransactionOptions): Promise<string>;
    }
    getRoleMember: {
        (params: IGetRoleMemberParams, options?: TransactionOptions): Promise<string>;
    }
    getRoleMemberCount: {
        (role:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    grantRole: {
        (params: IGrantRoleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IGrantRoleParams, options?: TransactionOptions) => Promise<void>;
    }
    hasRole: {
        (params: IHasRoleParams, options?: TransactionOptions): Promise<boolean>;
    }
    increaseAllowance: {
        (params: IIncreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IIncreaseAllowanceParams, options?: TransactionOptions) => Promise<boolean>;
    }
    mint: {
        (params: IMintParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IMintParams, options?: TransactionOptions) => Promise<void>;
    }
    name: {
        (options?: TransactionOptions): Promise<string>;
    }
    pause: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
    }
    paused: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    renounceRole: {
        (params: IRenounceRoleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRenounceRoleParams, options?: TransactionOptions) => Promise<void>;
    }
    revokeRole: {
        (params: IRevokeRoleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRevokeRoleParams, options?: TransactionOptions) => Promise<void>;
    }
    supportsInterface: {
        (interfaceId:string, options?: TransactionOptions): Promise<boolean>;
    }
    symbol: {
        (options?: TransactionOptions): Promise<string>;
    }
    totalSupply: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    transfer: {
        (params: ITransferParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ITransferParams, options?: TransactionOptions) => Promise<boolean>;
    }
    transferFrom: {
        (params: ITransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ITransferFromParams, options?: TransactionOptions) => Promise<boolean>;
    }
    unpause: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
    }
    private assign(){
        let DEFAULT_ADMIN_ROLE_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('DEFAULT_ADMIN_ROLE',[],options);
            return result;
        }
        this.DEFAULT_ADMIN_ROLE = DEFAULT_ADMIN_ROLE_call
        let MINTER_ROLE_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('MINTER_ROLE',[],options);
            return result;
        }
        this.MINTER_ROLE = MINTER_ROLE_call
        let PAUSER_ROLE_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('PAUSER_ROLE',[],options);
            return result;
        }
        this.PAUSER_ROLE = PAUSER_ROLE_call
        let allowanceParams = (params: IAllowanceParams) => [params.owner,params.spender];
        let allowance_call = async (params: IAllowanceParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('allowance',allowanceParams(params),options);
            return new BigNumber(result);
        }
        this.allowance = allowance_call
        let balanceOf_call = async (account:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('balanceOf',[account],options);
            return new BigNumber(result);
        }
        this.balanceOf = balanceOf_call
        let decimals_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('decimals',[],options);
            return new BigNumber(result);
        }
        this.decimals = decimals_call
        let getRoleAdmin_call = async (role:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('getRoleAdmin',[this.wallet.utils.stringToBytes32(role)],options);
            return result;
        }
        this.getRoleAdmin = getRoleAdmin_call
        let getRoleMemberParams = (params: IGetRoleMemberParams) => [this.wallet.utils.stringToBytes32(params.role),this.wallet.utils.toString(params.index)];
        let getRoleMember_call = async (params: IGetRoleMemberParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('getRoleMember',getRoleMemberParams(params),options);
            return result;
        }
        this.getRoleMember = getRoleMember_call
        let getRoleMemberCount_call = async (role:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getRoleMemberCount',[this.wallet.utils.stringToBytes32(role)],options);
            return new BigNumber(result);
        }
        this.getRoleMemberCount = getRoleMemberCount_call
        let hasRoleParams = (params: IHasRoleParams) => [this.wallet.utils.stringToBytes32(params.role),params.account];
        let hasRole_call = async (params: IHasRoleParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('hasRole',hasRoleParams(params),options);
            return result;
        }
        this.hasRole = hasRole_call
        let name_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('name',[],options);
            return result;
        }
        this.name = name_call
        let paused_call = async (options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('paused',[],options);
            return result;
        }
        this.paused = paused_call
        let supportsInterface_call = async (interfaceId:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('supportsInterface',[interfaceId],options);
            return result;
        }
        this.supportsInterface = supportsInterface_call
        let symbol_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('symbol',[],options);
            return result;
        }
        this.symbol = symbol_call
        let totalSupply_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('totalSupply',[],options);
            return new BigNumber(result);
        }
        this.totalSupply = totalSupply_call
        let approveParams = (params: IApproveParams) => [params.spender,this.wallet.utils.toString(params.amount)];
        let approve_send = async (params: IApproveParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('approve',approveParams(params),options);
            return result;
        }
        let approve_call = async (params: IApproveParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('approve',approveParams(params),options);
            return result;
        }
        this.approve = Object.assign(approve_send, {
            call:approve_call
        });
        let burn_send = async (amount:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('burn',[this.wallet.utils.toString(amount)],options);
            return result;
        }
        let burn_call = async (amount:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('burn',[this.wallet.utils.toString(amount)],options);
            return;
        }
        this.burn = Object.assign(burn_send, {
            call:burn_call
        });
        let burnFromParams = (params: IBurnFromParams) => [params.account,this.wallet.utils.toString(params.amount)];
        let burnFrom_send = async (params: IBurnFromParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('burnFrom',burnFromParams(params),options);
            return result;
        }
        let burnFrom_call = async (params: IBurnFromParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('burnFrom',burnFromParams(params),options);
            return;
        }
        this.burnFrom = Object.assign(burnFrom_send, {
            call:burnFrom_call
        });
        let decreaseAllowanceParams = (params: IDecreaseAllowanceParams) => [params.spender,this.wallet.utils.toString(params.subtractedValue)];
        let decreaseAllowance_send = async (params: IDecreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('decreaseAllowance',decreaseAllowanceParams(params),options);
            return result;
        }
        let decreaseAllowance_call = async (params: IDecreaseAllowanceParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('decreaseAllowance',decreaseAllowanceParams(params),options);
            return result;
        }
        this.decreaseAllowance = Object.assign(decreaseAllowance_send, {
            call:decreaseAllowance_call
        });
        let grantRoleParams = (params: IGrantRoleParams) => [this.wallet.utils.stringToBytes32(params.role),params.account];
        let grantRole_send = async (params: IGrantRoleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('grantRole',grantRoleParams(params),options);
            return result;
        }
        let grantRole_call = async (params: IGrantRoleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('grantRole',grantRoleParams(params),options);
            return;
        }
        this.grantRole = Object.assign(grantRole_send, {
            call:grantRole_call
        });
        let increaseAllowanceParams = (params: IIncreaseAllowanceParams) => [params.spender,this.wallet.utils.toString(params.addedValue)];
        let increaseAllowance_send = async (params: IIncreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('increaseAllowance',increaseAllowanceParams(params),options);
            return result;
        }
        let increaseAllowance_call = async (params: IIncreaseAllowanceParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('increaseAllowance',increaseAllowanceParams(params),options);
            return result;
        }
        this.increaseAllowance = Object.assign(increaseAllowance_send, {
            call:increaseAllowance_call
        });
        let mintParams = (params: IMintParams) => [params.to,this.wallet.utils.toString(params.amount)];
        let mint_send = async (params: IMintParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('mint',mintParams(params),options);
            return result;
        }
        let mint_call = async (params: IMintParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('mint',mintParams(params),options);
            return;
        }
        this.mint = Object.assign(mint_send, {
            call:mint_call
        });
        let pause_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('pause',[],options);
            return result;
        }
        let pause_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('pause',[],options);
            return;
        }
        this.pause = Object.assign(pause_send, {
            call:pause_call
        });
        let renounceRoleParams = (params: IRenounceRoleParams) => [this.wallet.utils.stringToBytes32(params.role),params.account];
        let renounceRole_send = async (params: IRenounceRoleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('renounceRole',renounceRoleParams(params),options);
            return result;
        }
        let renounceRole_call = async (params: IRenounceRoleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('renounceRole',renounceRoleParams(params),options);
            return;
        }
        this.renounceRole = Object.assign(renounceRole_send, {
            call:renounceRole_call
        });
        let revokeRoleParams = (params: IRevokeRoleParams) => [this.wallet.utils.stringToBytes32(params.role),params.account];
        let revokeRole_send = async (params: IRevokeRoleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('revokeRole',revokeRoleParams(params),options);
            return result;
        }
        let revokeRole_call = async (params: IRevokeRoleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('revokeRole',revokeRoleParams(params),options);
            return;
        }
        this.revokeRole = Object.assign(revokeRole_send, {
            call:revokeRole_call
        });
        let transferParams = (params: ITransferParams) => [params.to,this.wallet.utils.toString(params.amount)];
        let transfer_send = async (params: ITransferParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('transfer',transferParams(params),options);
            return result;
        }
        let transfer_call = async (params: ITransferParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('transfer',transferParams(params),options);
            return result;
        }
        this.transfer = Object.assign(transfer_send, {
            call:transfer_call
        });
        let transferFromParams = (params: ITransferFromParams) => [params.from,params.to,this.wallet.utils.toString(params.amount)];
        let transferFrom_send = async (params: ITransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('transferFrom',transferFromParams(params),options);
            return result;
        }
        let transferFrom_call = async (params: ITransferFromParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('transferFrom',transferFromParams(params),options);
            return result;
        }
        this.transferFrom = Object.assign(transferFrom_send, {
            call:transferFrom_call
        });
        let unpause_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('unpause',[],options);
            return result;
        }
        let unpause_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('unpause',[],options);
            return;
        }
        this.unpause = Object.assign(unpause_send, {
            call:unpause_call
        });
    }
}
export module ERC20PresetMinterPauser{
    export interface ApprovalEvent {owner:string,spender:string,value:BigNumber,_event:Event}
    export interface PausedEvent {account:string,_event:Event}
    export interface RoleAdminChangedEvent {role:string,previousAdminRole:string,newAdminRole:string,_event:Event}
    export interface RoleGrantedEvent {role:string,account:string,sender:string,_event:Event}
    export interface RoleRevokedEvent {role:string,account:string,sender:string,_event:Event}
    export interface TransferEvent {from:string,to:string,value:BigNumber,_event:Event}
    export interface UnpausedEvent {account:string,_event:Event}
}