import { moment, Module, Panel, Icon, Button, Label, VStack, HStack, Container, ControlElement, IEventBus, application, customModule, Input, customElements, IDataSchema } from '@ijstech/components';
import { BigNumber, Wallet } from '@ijstech/eth-wallet';
import Assets from './assets';
import {
	formatNumber,
	formatDate,
	registerSendTxEvents,
	TokenMapType,
	EventId,
	viewOnExplorerByAddress,
	downloadJsonFile,
	ISingleStakingCampaign,
	LockTokenType
} from './global/index';
import { getChainId, isWalletConnected, getNetworkInfo, setDataFromConfig, setCurrentChainId, tokenSymbol, getStakingStatus, fallBackUrl, getLockedTokenObject, getLockedTokenSymbol, getLockedTokenIconPaths, getTokenUrl, isThemeApplied, maxHeight, maxWidth, getSingleStakingSchema } from './store/index';
import { tokenStore, assets as tokenAssets } from '@scom/scom-token-list';
import configData from './data.json';

import {
	getStakingTotalLocked,
	getLPObject,
	getVaultObject,
	getERC20RewardCurrentAPR,
	getLPRewardCurrentAPR,
	getVaultRewardCurrentAPR,
	claimToken,
	getAllCampaignsInfo,
	// deployCampaign,
} from './staking-utils/index';
import { Result } from './common/index';
import { ManageStake } from './manage-stake/index';
import { Contracts } from './contracts/oswap-time-is-money-contract/index';
import { stakingComponent } from './index.css';
import StakingConfig from './commissions/index';
import ScomDappContainer from '@scom/scom-dapp-container';

interface ScomStakingElement extends ControlElement {
	data?: ISingleStakingCampaign;
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['i-scom-staking']: ScomStakingElement;
		}
	}
}

@customModule
@customElements('i-scom-staking')
export default class ScomStaking extends Module {
	private _data: ISingleStakingCampaign;
	tag: any = {};
	defaultEdit: boolean = true;
	readonly onEdit: () => Promise<void>;
	readonly onConfirm: () => Promise<void>;
	readonly onDiscard: () => Promise<void>;

	private $eventBus: IEventBus;
	private loadingElm: Panel;
	private campaigns: any = [];
	private stakingComponent: Panel;
	private stakingElm: Panel;
	private noCampaignSection: Panel;
	private stakingResult: Result;
	private manageStakeElm: Panel;
	private listAprTimer: any = [];
	private listActiveTimer: any = [];
	private tokenMap: TokenMapType = {};
	private configDApp: StakingConfig;
	private dappContainer: ScomDappContainer;

	private getPropertiesSchema(readOnly?: boolean) {
		const propertiesSchema = getSingleStakingSchema(readOnly);
		return propertiesSchema as IDataSchema;
	}

	private getThemeSchema(readOnly?: boolean) {
		const themeSchema = {
			type: 'object',
			properties: {
				customColorCampaign: {
					type: 'string',
					format: 'color',
					readOnly
				},
				customColorBackground: {
					type: 'string',
					format: 'color',
					readOnly
				},
				customColorButton: {
					type: 'string',
					format: 'color',
					readOnly
				},
				customColorText: {
					type: 'string',
					format: 'color',
					readOnly
				},
				customColorTimeBackground: {
					type: 'string',
					format: 'color',
					readOnly
				}
			}
		}
		return themeSchema as IDataSchema;
	}

	private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
		const actions = [
			{
				name: 'Settings',
				icon: 'cog',
				command: (builder: any, userInputData: any) => {
					let _oldData: ISingleStakingCampaign = {
						chainId: 0,
						customName: '',
						stakings: undefined,
						wallets: [],
						networks: []
					};
					return {
						execute: async () => {
							_oldData = {...this._data};
							if (userInputData?.chainId !== undefined) this._data.chainId = userInputData.chainId;
							if (userInputData?.customName !== undefined) this._data.customName = userInputData.customName;
							if (userInputData?.customDesc !== undefined) this._data.customDesc = userInputData.customDesc;
							if (userInputData?.customLogo !== undefined) this._data.customLogo = userInputData.customLogo;
							if (userInputData?.getTokenURL !== undefined) this._data.getTokenURL = userInputData.getTokenURL;
							if (userInputData?.showContractLink !== undefined) this._data.showContractLink = userInputData.showContractLink;
							if (userInputData?.stakings !== undefined) this._data.stakings = userInputData.stakings;
							setCurrentChainId(this._data.chainId);
							this.configDApp.data = this._data;
							this.updateStaking();
							if (builder?.setData) builder.setData(this._data);
						},
						undo: async () => {
							this._data = { ..._oldData };
							setCurrentChainId(this._data.chainId);
							this.configDApp.data = this._data;
							this.updateStaking();
							if (builder?.setData) builder.setData(this._data);
						},
						redo: () => { }
					}
				},
				userInputDataSchema: propertiesSchema
			},
			{
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          let oldTag = {};
          return {
            execute: async () => {
              if (!userInputData) return;
              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder) builder.setTag(userInputData);
              else this.setTag(userInputData);
							if (this.dappContainer) this.dappContainer.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = JSON.parse(JSON.stringify(oldTag));
              if (builder) builder.setTag(this.tag);
              else this.setTag(this.tag);
							if (this.dappContainer) this.dappContainer.setTag(userInputData);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: themeSchema
      }
		]
		return actions;
	}

	getConfigurators() {
		let self = this;
		return [
			{
				name: 'Builder Configurator',
        target: 'Builders',
				getActions: () => {
					return this._getActions(this.getPropertiesSchema(), this.getThemeSchema());
				},
				getData: this.getData.bind(this),
        setData: async (data: any) => {
          const defaultData = configData.defaultBuilderData;
					await this.setData({...defaultData, ...data});
				},
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
			},
			{
				name: 'Emdedder Configurator',
        target: 'Embedders',
				elementName: 'i-scom-staking-config',
				getLinkParams: () => {
					const commissions = this._data.commissions || [];
					return {
						data: window.btoa(JSON.stringify(commissions))
					}
				},
				setLinkParams: async (params: any) => {
					if (params.data) {
						const decodedString = window.atob(params.data);
						const commissions = JSON.parse(decodedString);
						let resultingData = {
							...self._data,
							commissions
						};
						await this.setData(resultingData);
					}
				},
				bindOnChanged: (element: StakingConfig, callback: (data: any) => Promise<void>) => {
					element.onCustomCommissionsChanged = async (data: any) => {
						let resultingData = {
							...self._data,
							...data
						};
						await this.setData(resultingData);
						await callback(data);
					}
				},
				getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
			}
		]
	}

	private async getData() {
		return this._data;
	}

	private async setData(value: any) {
		// this._data = this.convertCampaignData(value);
		this._data = value;
		this.configDApp.data = value;
		const data: any = {
			wallets: this._data.wallets ?? [],
			networks: this._data.networks ?? [],
			showHeader: this._data.showHeader ?? true
		}
		if (this.dappContainer?.setData) this.dappContainer.setData(data)
		// TODO - update proxy address
		this.onSetupPage(isWalletConnected());
	}

	private async getTag() {
		return this.tag;
	}

	private async setTag(value: any) {
		const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        this.tag[prop] = newValue[prop];
      }
    }
		if (this.stakingElm) {
			this.renderCampaigns();
		}
	}

	// private convertCampaignData(data: ISingleStakingCampaign) {
	// 	if (data) {
	// 		const hourVal = 60 * 60;
	// 		const { stakings, campaignStart, campaignEnd } = data;
	// 		const { perAddressCap, minLockTime, maxTotalLock, rewards } = stakings;
	// 		const { multiplier } = rewards;
	// 		const _maxTotalLock = new BigNumber(maxTotalLock);
	// 		const _rewardAmount = new BigNumber(multiplier || 0).multipliedBy(_maxTotalLock);
	// 		const _rewards: Reward = {
	// 			...rewards,
	// 			multiplier: new BigNumber(rewards.multiplier),
	// 			initialReward: new BigNumber(rewards.initialReward),
	// 			vestingPeriod: new BigNumber(rewards.vestingPeriod).multipliedBy(rewards.vestingPeriodUnit).multipliedBy(hourVal),
	// 			claimDeadline: new BigNumber(rewards.claimDeadline),
	// 			vestingStartDate: new BigNumber(rewards.vestingStartDate || 0),
	// 			rewardAmount: _rewardAmount
	// 		}
	// 		const _stakings: Staking = {
	// 			...stakings,
	// 			minLockTime: new BigNumber(minLockTime),
	// 			perAddressCap: new BigNumber(perAddressCap),
	// 			maxTotalLock: _maxTotalLock,
	// 			rewards: [_rewards]
	// 		}
	// 		let _data: IStakingCampaign = {
	// 			...data,
	// 			campaignStart: new BigNumber(campaignStart),
	// 			campaignEnd: new BigNumber(campaignEnd),
	// 			stakings: [_stakings]
	// 		};
	// 		return _data;
	// 	}
	// 	return null;
	// }

	constructor(parent?: Container, options?: ControlElement) {
		super(parent, options);
		if (configData) setDataFromConfig(configData);
		this.$eventBus = application.EventBus;
		this.registerEvent();
	}

	private registerEvent = () => {
		this.$eventBus.register(this, EventId.IsWalletConnected, this.onWalletConnect);
		this.$eventBus.register(this, EventId.IsWalletDisconnected, this.onWalletConnect);
		this.$eventBus.register(this, EventId.chainChanged, this.onChainChange);
		this.$eventBus.register(this, EventId.EmitButtonStatus, this.updateButtonStatus);
	}

	private onWalletConnect = async (connected: boolean) => {
		this.onSetupPage(connected);
	}

	private onChainChange = async () => {
		const isConnected = isWalletConnected();
		if (await this.isWalletValid(isConnected)) {
			this.onSetupPage(isConnected);
		}
	}

	private isWalletValid = async (isConnected: boolean) => {
		if (this._data && isConnected) {
			try {
				const wallet = Wallet.getClientInstance();
				const infoList = this._data[wallet.chainId];
				const stakingAddress = infoList && infoList[0].stakings[0]?.address;
				if (stakingAddress) {
					const timeIsMoney = new Contracts.TimeIsMoney(wallet, stakingAddress);
					await timeIsMoney.getCredit(wallet.address);
				}
				return true;
			} catch {
				return false;
			}
		}
		return false;
	}

	private updateStaking = () => {
		this.onSetupPage(isWalletConnected());
	}

	private onSetupPage = async (connected: boolean, hideLoading?: boolean) => {
		if (!hideLoading && this.loadingElm) {
			this.loadingElm.visible = true;
		}
		if (!connected || !this._data || !this.checkValidation()) {
			await this.renderEmpty();
			return;
		}
		tokenStore.updateTokenMapData();
		this.campaigns = await getAllCampaignsInfo({ [this._data.chainId]: this._data });
		await this.renderCampaigns(hideLoading);
		if (!hideLoading && this.loadingElm) {
			this.loadingElm.visible = false;
		}
	}

	private showResultMessage = (result: Result, status: 'warning' | 'success' | 'error', content?: string | Error) => {
		if (!result) return;
		let params: any = { status };
		if (status === 'success') {
			params.txtHash = content;
		} else {
			params.content = content;
		}
		result.message = { ...params };
		result.showModal();
	}

	private onClaim = async (btnClaim: Button, data: any) => {
		this.showResultMessage(this.stakingResult, 'warning', `Claim ${data.rewardSymbol}`);
		const callBack = async (err: any, reply: any) => {
			if (err) {
				this.showResultMessage(this.stakingResult, 'error', err);
			} else {
				this.showResultMessage(this.stakingResult, 'success', reply);
				btnClaim.enabled = false;
				btnClaim.rightIcon.visible = true;
			}
		};

		const confirmationCallBack = async (receipt: any) => {
			await this.onSetupPage(isWalletConnected(), true);
			if (!btnClaim) return;
			btnClaim.rightIcon.visible = false;
			btnClaim.enabled = true;
		};

		registerSendTxEvents({
			transactionHash: callBack,
			confirmation: confirmationCallBack
		});

		claimToken(data.reward.address, callBack);
	}

	// private onDeployCampaign = async () => {
	// 	if (this._data && this._data.isNew && this.checkValidation()) {
	// 		const campaign = this._data;
	// 		const chainId = getChainId();
	// 		let result: IStakingCampaign | null;
	// 		this.showResultMessage(this.stakingResult, 'warning', `Deploying ${campaign.customName}`);

	// 		const callBack = async (err: any, reply: any) => {
	// 			if (err) {
	// 				this.showResultMessage(this.stakingResult, 'error', err);
	// 			} else {
	// 				this.showResultMessage(this.stakingResult, 'success', reply);
	// 			}
	// 		};

	// 		const confirmationCallBack = async (receipt: any) => {
	// 			if (!result) return;
	// 		};

	// 		registerSendTxEvents({
	// 			transactionHash: callBack,
	// 			confirmation: confirmationCallBack
	// 		});

	// 		result = await deployCampaign(campaign, callBack);
	// 		if (result) {
	// 			this.stakingResult.closeModal();
	// 			const obj = { [chainId]: [{ ...result }] };
	// 			this.onSetupPage(isWalletConnected());
	// 			confirmationCallBack(true);
	// 			this.onDownload(obj);
	// 		}
	// 	}
	// }

	private checkValidation = () => {
		if (!this._data) return false;
		const { chainId, customName, stakings } = this._data;
		if (!chainId || !customName || !stakings) return false;
		const { address, rewards, lockTokenType } = stakings;
		if (!address || !rewards || !rewards.address || lockTokenType === undefined) return false;
		// const { chainId, customName, campaignStart, campaignEnd, admin, stakings } = this._data;
		// if (!chainId || !customName || !campaignStart?.gt(0) || !campaignEnd?.gt(0) || !admin || !stakings) return false;
		// const { lockTokenAddress, minLockTime, perAddressCap, maxTotalLock, rewards } = stakings[0];
		// if (!lockTokenAddress || !minLockTime?.gt(0) || !perAddressCap?.gt(0) || !maxTotalLock?.gt(0) || !rewards) return false;
		// const { rewardTokenAddress, multiplier, initialReward, vestingPeriod, claimDeadline } = rewards[0];
		// if (!rewardTokenAddress || !multiplier?.gt(0) || initialReward?.isNaN() || !vestingPeriod?.gt(0) || !claimDeadline) return false;
		return true;
	}

	private onDownload = (data?: any) => {
		if (data) {
			downloadJsonFile('campaign.json', { ...data });
		}
	}

	private removeTimer = () => {
		for (const timer of this.listAprTimer) {
			clearInterval(timer);
		}
		this.listAprTimer = [];
		for (const timer of this.listActiveTimer) {
			clearInterval(timer);
		}
		this.listActiveTimer = [];
	}

	private getRewardToken = (tokenAddress: string) => {
		return this.tokenMap[tokenAddress] || this.tokenMap[tokenAddress?.toLocaleLowerCase()] || {} as any;
	}

	private getLPToken = (campaign: any, token: string, chainId?: number) => {
		if (campaign.getTokenURL) {
			window.open(campaign.getTokenURL);
		} else {
			window.open(getTokenUrl ? getTokenUrl : `https:openswap.xyz/#/swap?chainId=${chainId}&fromToken=BNB&toToken=${token}&fromAmount=1&showOptimizedRoutes=false`);
		}
	}

	async init() {
		this.isReadyCallbackQueued = true;
		super.init();
		this.stakingResult = new Result();
		this.stakingComponent.appendChild(this.stakingResult);
		this.stakingResult.visible = false;
		this.showResultMessage(this.stakingResult, 'warning', '');
		setTimeout(() => {
			this.stakingResult.closeModal();
			this.stakingResult.visible = true;
		}, 100);
		const data = this.getAttribute('data', true);
		const commissions = this.getAttribute('commissions', true, []);
		await this.setData({ commissions, ...data });
		if (data) {
			setCurrentChainId(data.chainId);
		} else {
			this.renderEmpty();
		}

		this.isReadyCallbackQueued = false;
		this.executeReadyCallback();
	}

	private updateButtonStatus = async (data: any) => {
		if (data) {
			const { value, key, text } = data;
			const elm = this.stakingElm?.querySelector(key) as Button;
			if (elm) {
				elm.rightIcon.visible = value;
				elm.caption = text;
			}
		}
	}

	private connectWallet = () => {
		this.$eventBus.dispatch(EventId.ConnectWallet);
	}

	private initEmptyUI = async () => {
		if (!this.noCampaignSection) {
			this.noCampaignSection = await Panel.create({ height: '100%' });
		}
		const isConnected = isWalletConnected();
		this.noCampaignSection.clearInnerHTML();
		this.noCampaignSection.appendChild(
			<i-panel class="no-campaign" height="100%" background={{ color: '#192046' }}>
				<i-vstack gap={10} verticalAlignment="center">
					<i-image url={Assets.fullPath('img/staking/TrollTrooper.svg')} />
					<i-label font={{ color: '#FFFFFF' }} caption={isConnected ? 'No Campaigns' : 'Please connect with your wallet!'} />
					{
						!isConnected ? <i-button maxWidth={220} caption="Connect Wallet" class="btn-os btn-stake" margin={{ left: 'auto', right: 'auto', bottom: 0 }} font={{ size: '14px' }} onClick={this.connectWallet} /> : []
					}
				</i-vstack>
			</i-panel>
		);
		this.noCampaignSection.visible = true;
	}

	private renderEmpty = async () => {
		await this.initEmptyUI();
		if (this.stakingElm) {
			this.stakingElm.clearInnerHTML();
			this.stakingElm.appendChild(this.noCampaignSection);
		}
		if (this.loadingElm) {
			this.loadingElm.visible = false;
		}
	}

	private renderCampaigns = async (hideLoading?: boolean) => {
		if (!hideLoading) {
			this.stakingElm.clearInnerHTML();
		}
		this.tokenMap = tokenStore.tokenMap;
		const chainId = getChainId();
		const network = getNetworkInfo(chainId);
		await this.initEmptyUI();
		this.noCampaignSection.visible = false;
		if (this.campaigns && !this.campaigns.length) {
			this.stakingElm.clearInnerHTML();
			this.stakingElm.appendChild(this.noCampaignSection);
			this.noCampaignSection.visible = true;
			this.removeTimer();
			return;
		}

		let nodeItems: HTMLElement[] = [];
		this.removeTimer();
		const campaigns = [this.campaigns[0]];
		for (let idx = 0; idx < campaigns.length; idx++) {
			const campaign = this.campaigns[idx];
			const _tag = this.tag || {};
			const colorCampaignText = isThemeApplied ? _tag.customColorCampaign || '#f15e61' : '#f15e61';
			const colorCampaignBackground = isThemeApplied ? _tag.customColorBackground || '#ffffff26' : '#ffffff26';
			const colorButton = isThemeApplied ? _tag.customColorButton : undefined;
			const colorText = isThemeApplied ? _tag.customColorText || '#fff' : '#fff';
			const colorTimeBackground = isThemeApplied ? _tag.customColorTimeBackground || '#F15E61' : '#F15E61';
			const containerSection = await Panel.create();
			containerSection.id = `campaign-${idx}`;
			containerSection.classList.add('container');
			const options = campaign.options;
			for (let optIdx = 0; optIdx < options.length; optIdx++) {
				const opt = options[optIdx];
				let lpTokenData: any = {};
				let vaultTokenData: any = {};
				if (opt.tokenAddress) {
					if (opt.lockTokenType == LockTokenType.LP_Token) {
						lpTokenData = {
							'object': await getLPObject(opt.tokenAddress)
						}
					} else if (opt.lockTokenType == LockTokenType.VAULT_Token) {
						vaultTokenData = {
							'object': await getVaultObject(opt.tokenAddress)
						}
					}
				}
				const tokenInfo = {
					tokenAddress: campaign.tokenAddress,
					lpToken: lpTokenData,
					vaultToken: vaultTokenData
				}
				options[optIdx] = {
					...options[optIdx],
					tokenInfo
				}
			}
			const stakingInfo = options ? options[0] : null;
			const lockedTokenObject = getLockedTokenObject(stakingInfo, stakingInfo.tokenInfo, this.tokenMap);
			const lockedTokenSymbol = getLockedTokenSymbol(stakingInfo, lockedTokenObject);
			const lockedTokenIconPaths = getLockedTokenIconPaths(stakingInfo, lockedTokenObject, chainId, this.tokenMap);
			const lockedTokenDecimals = lockedTokenObject?.decimals || 18;
			const defaultDecimalsOffset = 18 - lockedTokenDecimals;
			const activeStartTime = stakingInfo ? stakingInfo.startOfEntryPeriod : 0;
			const activeEndTime = stakingInfo ? stakingInfo.endOfEntryPeriod : 0;
			let isStarted = moment(activeStartTime).diff(moment()) <= 0;
			let isClosed = moment(activeEndTime).diff(moment()) <= 0;
			let totalLocked: any = {};
			const stakingElms: VStack[] = [];
			const optionTimer = { background: { color: colorTimeBackground }, font: { color: colorText } };
			const activeTimerRows: VStack[] = [];
			const activeTimerElms: VStack[] = [];
			const endHours: Label[] = [];
			const endDays: Label[] = [];
			const endMins: Label[] = [];
			const stickerSections: Panel[] = [];
			const stickerLabels: Label[] = [];
			const stickerIcons: Icon[] = [];
			for (let i = 0; i < options.length; i++) {
				stakingElms[i] = await VStack.create({ visible: i === 0 });
				activeTimerRows[i] = await VStack.create({ gap: 2, width: '25%', verticalAlignment: 'center' });
				activeTimerElms[i] = await VStack.create();
				activeTimerRows[i].appendChild(<i-label caption="End Date" font={{ size: '14px', color: colorText }} class="opacity-50" />);
				activeTimerRows[i].appendChild(activeTimerElms[i]);
				endHours[i] = await Label.create(optionTimer);
				endDays[i] = await Label.create(optionTimer);
				endMins[i] = await Label.create(optionTimer);
				endHours[i].classList.add('timer-value');
				endDays[i].classList.add('timer-value');
				endMins[i].classList.add('timer-value');
				activeTimerElms[i].appendChild(
					<i-hstack gap={4} class="custom-timer">
						{endDays[i]}
						<i-label caption="D" class="timer-unit" font={{ color: colorText }} />
						{endHours[i]}
						<i-label caption="H" class="timer-unit" font={{ color: colorText }} />
						{endMins[i]}
						<i-label caption="M" class="timer-unit" font={{ color: colorText }} />
					</i-hstack>
				);

				// Sticker
				stickerSections[i] = await Panel.create({ visible: false });
				stickerLabels[i] = await Label.create();
				stickerIcons[i] = await Icon.create();
				stickerSections[i].classList.add('sticker');
				stickerSections[i].appendChild(
					<i-vstack class="sticker-text">
						{stickerIcons[i]}
						{stickerLabels[i]}
					</i-vstack>
				);
			}

			const onChangeStake = (index: number) => {
				stakingElms.forEach((elm: VStack) => {
					elm.visible = false;
				});
				stakingElms[index].visible = true;
			}

			const setAvailableQty = async () => {
				if (!isWalletConnected()) return;
				let i = 0;
				for (const o of options) {
					const _totalLocked = await getStakingTotalLocked(o.address);
					totalLocked[o.address] = _totalLocked;
					const optionQty = new BigNumber(o.maxTotalLock).minus(_totalLocked).shiftedBy(defaultDecimalsOffset);
					if (o.mode === 'Stake') {
						const keyStake = `#btn-stake-${o.address}`;
						const btnStake = this.querySelector(keyStake) as Button;
						const isStaking = getStakingStatus(keyStake).value;
						if (btnStake) {
							let isValidInput = false;
							const inputElm = this.querySelector(`#input-${o.address}`) as Input;
							if (inputElm) {
								const manageStake = this.querySelector(`#manage-stake-${o.address}`) as ManageStake;
								const inputVal = new BigNumber(inputElm.value || 0);
								isValidInput = inputVal.gt(0) && inputVal.lte(manageStake.getBalance()) && !manageStake?.needToBeApproval();
							}
							btnStake.enabled = !isStaking && isValidInput && (isStarted && !(optionQty.lte(0) || isClosed));
						}
					} else {
						const keyUnstake = `#btn-unstake-${o.address}`;
						const btnUnstake = this.querySelector(keyUnstake) as Button;
						const isUnstaking = getStakingStatus(keyUnstake).value;
						if (btnUnstake) {
							const manageStake = this.querySelector(`#manage-stake-${o.address}`) as ManageStake;
							btnUnstake.enabled = !isUnstaking && o.mode !== 'Stake' && Number(o.stakeQty) != 0 && !manageStake?.needToBeApproval();
						}
					}
					if (isClosed) {
						if (stickerLabels[i].caption !== 'Closed') {
							stickerSections[i].classList.add('closed');
							stickerSections[i].classList.remove('sold-out');
							stickerLabels[i].caption = 'Closed';
							stickerIcons[i].name = 'check-square';
						}
					} else if (optionQty.lte(0)) {
						if (stickerLabels[i].caption !== 'Sold Out') {
							stickerLabels[i].caption = 'Sold Out';
							stickerIcons[i].name = 'star';
							stickerSections[i].classList.add('sold-out');
						}
					} else {
						if (stickerLabels[i].caption !== 'Active') {
							stickerLabels[i].caption = 'Active';
							stickerIcons[i].name = 'star';
						}
					}
					if (!stickerSections[i].visible) {
						stickerSections[i].visible = true;
					}
					i++;
				};
			}

			const setEndRemainingTime = () => {
				isStarted = moment(activeStartTime).diff(moment()) <= 0;
				isClosed = moment(activeEndTime).diff(moment()) <= 0;
				for (let i = 0; i < options.length; i++) {
					activeTimerRows[i].visible = isStarted && !isClosed;
				}
				if (activeEndTime == 0) {
					for (let i = 0; i < options.length; i++) {
						endDays[i].caption = endHours[i].caption = endMins[i].caption = '0';
					}
					if (this.listActiveTimer[idx]) {
						clearInterval(this.listActiveTimer[idx]);
					}
				} else {
					const days = moment(activeEndTime).diff(moment(), 'days');
					const hours = moment(activeEndTime).diff(moment(), 'hours') - days * 24;
					const mins = moment(activeEndTime).diff(moment(), 'minutes') - days * 24 * 60 - hours * 60;
					for (let i = 0; i < options.length; i++) {
						endDays[i].caption = `${days}`;
						endHours[i].caption = `${hours}`;
						endMins[i].caption = `${mins}`;
					}
				}
			}

			const setTimer = () => {
				setEndRemainingTime();
				setAvailableQty();
			}

			setTimer();
			this.listActiveTimer.push(setInterval(setTimer, 2000));
			const stakingsElm = await Promise.all(options.map(async (option: any, optionIdx: number) => {
				const manageStake = new ManageStake();
				manageStake.id = `manage-stake-${option.address}`;
				manageStake.width = '100%';
				manageStake.onRefresh = () => this.onSetupPage(isWalletConnected(), true);
				this.manageStakeElm.clearInnerHTML();
				this.manageStakeElm.appendChild(manageStake);
				manageStake.setData({
					...campaign,
					...option,
					customColorButton: colorButton,
					customColorText: colorText
				});

				const isClaim = option.mode === 'Claim';

				const rewardsData = option.rewardsData[0] ? [option.rewardsData[0]] : [];
				const rewardOptions = !isClaim ? rewardsData : [];
				let aprInfo: any = {};

				const claimStakedRow = await HStack.create({ verticalAlignment: 'center', horizontalAlignment: 'space-between' });
				claimStakedRow.appendChild(<i-label caption="You Staked" font={{ size: '16px', color: colorText }} />);
				claimStakedRow.appendChild(<i-label caption={`${formatNumber(new BigNumber(option.stakeQty).shiftedBy(defaultDecimalsOffset))} ${lockedTokenSymbol}`} font={{ size: '16px', name: 'Montserrat Regular', color: colorText }} />);

				const rowRewards = await VStack.create({ gap: 8, verticalAlignment: 'center' });
				for (let idx = 0; idx < rewardsData.length; idx++) {
					const reward = rewardsData[idx];
					const rewardToken = this.getRewardToken(reward.rewardTokenAddress);
					const rewardTokenDecimals = rewardToken.decimals || 18;
					let decimalsOffset = 18 - rewardTokenDecimals;
					let rewardLockedDecimalsOffset = decimalsOffset;
					if (rewardTokenDecimals !== 18 && lockedTokenDecimals !== 18) {
						rewardLockedDecimalsOffset = decimalsOffset * 2;
					} else if (lockedTokenDecimals !== 18 && rewardTokenDecimals === 18) {
						rewardLockedDecimalsOffset = rewardTokenDecimals - lockedTokenDecimals;
						decimalsOffset = 18 - lockedTokenDecimals;
					}
					const rewardSymbol = rewardToken.symbol || '';
					rowRewards.appendChild(
						<i-hstack horizontalAlignment="space-between">
							<i-label caption={`${rewardSymbol} Locked`} font={{ size: '16px', color: colorText }} />
							<i-label caption={`${formatNumber(new BigNumber(reward.vestedReward || 0).shiftedBy(rewardLockedDecimalsOffset))} ${rewardSymbol}`} font={{ size: '16px', name: 'Montserrat Regular', color: colorText }} />
						</i-hstack>
					);
					// rowRewards.appendChild(
					// 	<i-hstack horizontalAlignment="space-between">
					// 		<i-label caption={`${rewardSymbol} Vesting Start`} font={{ size: '16px', color: colorText }} />
					// 		<i-label caption={reward.vestingStart ? reward.vestingStart.format('YYYY-MM-DD HH:mm:ss') : 'TBC'} font={{ size: '16px', color: colorText }} />
					// 	</i-hstack>
					// );
					// rowRewards.appendChild(
					// 	<i-hstack horizontalAlignment="space-between">
					// 		<i-label caption={`${rewardSymbol} Vesting End`} font={{ size: '16px', color: colorText }} />
					// 		<i-label caption={reward.vestingEnd ? reward.vestingEnd.format('YYYY-MM-DD HH:mm:ss') : 'TBC'} font={{ size: '16px', color: colorText }} />
					// 	</i-hstack>
					// );
					const passClaimStartTime = !(reward.claimStartTime && moment().diff(moment.unix(reward.claimStartTime)) < 0);
					let rewardClaimable = `0 ${rewardSymbol}`;
					if (passClaimStartTime && isClaim) {
						rewardClaimable = `${formatNumber(new BigNumber(reward.claimable).shiftedBy(decimalsOffset))} ${rewardSymbol}`;
					}
					let startClaimingText = '';
					if (!(!reward.claimStartTime || passClaimStartTime) && isClaim) {
						const claimStart = moment.unix(reward.claimStartTime).format('YYYY-MM-DD HH:mm:ss');
						startClaimingText = `(Claim ${rewardSymbol} after ${claimStart})`;
					}
					rowRewards.appendChild(
						<i-hstack horizontalAlignment="space-between">
							<i-label caption={`${rewardSymbol} Claimable`} font={{ size: '16px', color: colorText }} />
							<i-label caption={rewardClaimable} font={{ size: '16px', name: 'Montserrat Regular', color: colorText }} />
							{startClaimingText ? <i-label caption={startClaimingText} font={{ size: '16px', color: colorText }} /> : []}
						</i-hstack>
					);
					const btnClaim = await Button.create({
						rightIcon: { spin: true, fill: colorText, visible: false },
						caption: `Claim ${rewardSymbol}`,
						background: { color: `${colorButton} !important` },
						font: { color: colorText },
						enabled: !(!passClaimStartTime || new BigNumber(reward.claimable).isZero()) && isClaim,
						margin: { left: 'auto', right: 'auto' }
					})
					btnClaim.id = `btnClaim-${idx}-${option.address}`;
					btnClaim.classList.add('btn-os', 'btn-stake');
					btnClaim.onClick = () => this.onClaim(btnClaim, { reward, rewardSymbol });
					rowRewards.appendChild(btnClaim);
				};

				const getAprValue = (rewardOption: any) => {
					if (rewardOption && aprInfo && aprInfo[rewardOption.rewardTokenAddress]) {
						const apr = new BigNumber(aprInfo[rewardOption.rewardTokenAddress]).times(100).toFormat(2, BigNumber.ROUND_DOWN);
						return `${apr}%`;
					}
					return '';
				}

				const durationDays = option.minLockTime / (60 * 60 * 24);
				const _lockedTokenObject = getLockedTokenObject(option, option.tokenInfo, this.tokenMap);
				const _lockedTokenIconPaths = getLockedTokenIconPaths(option, _lockedTokenObject, chainId, this.tokenMap);
				const pathsLength = _lockedTokenIconPaths.length;
				const rewardToken = rewardsData?.length ? this.getRewardToken(rewardsData[0].rewardTokenAddress) : null;
				stakingElms[optionIdx].appendChild(
					<i-vstack gap={15} width={maxWidth} height="100%" padding={{ top: 10, bottom: 10, left: 20, right: 20 }} position="relative">
						{stickerSections[optionIdx]}
						<i-hstack gap={10} width="100%" verticalAlignment="center">
							<i-hstack gap={10} width="50%">
								<i-hstack width={pathsLength === 1 ? 63.5 : 80} position="relative" verticalAlignment="center">
									<i-image width={60} height={60} url={tokenAssets.tokenPath(rewardToken, chainId)} fallbackUrl={fallBackUrl} />
									{
										_lockedTokenIconPaths.map((v: string, idxImg: number) => {
											return <i-image position="absolute" width={28} height={28} bottom={0} left={(idxImg * 20) + 35} url={tokenAssets.fullPath(v)} fallbackUrl={fallBackUrl} />
										})
									}
								</i-hstack>
								<i-vstack gap={2} overflow={{ x: 'hidden' }} verticalAlignment="center">
									<i-label visible={!!campaign.customName} caption={campaign.customName} font={{ size: '20px', name: 'Montserrat Bold', color: colorCampaignText, bold: true }} class="text-overflow" />
									<i-label visible={!!campaign.customDesc} caption={campaign.customDesc} font={{ size: '16px', name: 'Montserrat Regular', color: colorText }} class="opacity-50 text-overflow" />
								</i-vstack>
							</i-hstack>
							{
								await Promise.all(rewardOptions.map(async (rewardOption: any, idx: number) => {
									const lbApr = await Label.create({ font: { size: '40px', name: 'Montserrat Medium', color: '#72F35D' } });
									const lbRate = await Label.create({ font: { size: '16px', name: 'Montserrat Regular', color: colorText } });
									lbApr.classList.add('text-overflow');
									lbRate.classList.add('opacity-50');
									const rewardToken = this.getRewardToken(rewardOption.rewardTokenAddress);
									const rewardTokenDecimals = rewardToken.decimals || 18;
									const decimalsOffset = 18 - rewardTokenDecimals;
									const lockTokenType = option.lockTokenType;
									const rateDesc = `1 ${lockTokenType === LockTokenType.LP_Token ? 'LP' : tokenSymbol(option.lockTokenAddress)} : ${new BigNumber(rewardOption.multiplier).shiftedBy(decimalsOffset).toFixed()} ${tokenSymbol(rewardOption.rewardTokenAddress)}`;
									const updateApr = async () => {
										if (lockTokenType === LockTokenType.ERC20_Token) {
											const apr: any = await getERC20RewardCurrentAPR(rewardOption, lockedTokenObject, durationDays);
											if (!isNaN(parseFloat(apr))) {
												aprInfo[rewardOption.rewardTokenAddress] = apr;
											}
										} else if (lockTokenType === LockTokenType.LP_Token) {
											if (rewardOption.referencePair) {
												aprInfo[rewardOption.rewardTokenAddress] = await getLPRewardCurrentAPR(rewardOption, option.tokenInfo?.lpToken?.object, durationDays);
											}
										} else {
											aprInfo[rewardOption.rewardTokenAddress] = await getVaultRewardCurrentAPR(rewardOption, option.tokenInfo?.vaultToken?.object, durationDays);
										}
										const aprValue = getAprValue(rewardOption);
										lbApr.caption = `APR ${aprValue}`;
										lbRate.caption = rateDesc;
									}
									updateApr();
									this.listAprTimer.push(setInterval(updateApr, 10000));
									const aprValue = getAprValue(rewardOption);
									lbApr.caption = `APR ${aprValue}`;
									lbRate.caption = rateDesc;
									return <i-vstack verticalAlignment="center">
										{lbApr}
										{lbRate}
									</i-vstack>
								}))
							}
						</i-hstack>
						<i-hstack width="100%" verticalAlignment="center">
							<i-vstack gap={2} width="25%" verticalAlignment="center">
								<i-label caption="Start Date" font={{ size: '14px', color: colorText }} class="opacity-50" />
								<i-label caption={formatDate(option.startOfEntryPeriod, 'DD MMM, YYYY')} font={{ size: '16px', name: 'Montserrat Regular', color: colorText }} />
							</i-vstack>
							{activeTimerRows[optionIdx]}
							<i-vstack gap={2} width="25%" verticalAlignment="center">
								<i-label caption="Stake Duration" font={{ size: '14px', color: colorText }} class="opacity-50" />
								<i-hstack gap={4} verticalAlignment="center">
									{
										options.map((_option: any, _optionIdx: number) => {
											const isCurrentIdx = optionIdx === _optionIdx;
											return <i-button
												caption={durationDays < 1 ? '< 1 Day' : `${durationDays} Days`}
												class={`btn-os ${isCurrentIdx ? 'cursor-default' : ''}`}
												border={{ radius: 12, width: 1, style: 'solid', color: isCurrentIdx ? 'transparent' : '#8994A3' }}
												font={{ size: '12px', name: 'Montserrat Regular', color: isCurrentIdx ? colorText : '#8994A3' }}
												padding={{ top: 2.5, bottom: 2.5, left: 8, right: 8 }}
												background={{ color: isCurrentIdx ? '#f15e61 !important' : 'transparent !important' }}
												onClick={() => onChangeStake(_optionIdx)}
											/>
										})
									}
								</i-hstack>
							</i-vstack>
							<i-vstack gap={4} width="25%" margin={{ left: 'auto' }} verticalAlignment="center" horizontalAlignment="end">
								<i-hstack gap={4} class="pointer" width="fit-content" verticalAlignment="center" onClick={() => this.getLPToken(campaign, lockedTokenSymbol, chainId)}>
									<i-icon name="external-link-alt" width={12} height={12} fill={colorText} />
									<i-label caption={`Get ${lockedTokenSymbol}`} font={{ size: '13.6px', color: colorText }} />
									{
										lockedTokenIconPaths.map((v: any) => {
											return <i-image display="flex" width={15} height={15} url={tokenAssets.fullPath(v)} fallbackUrl={fallBackUrl} />
										})
									}
								</i-hstack >
								{
									campaign.showContractLink ?
										<i-hstack gap={4} class="pointer" width="fit-content" verticalAlignment="center" onClick={() => viewOnExplorerByAddress(chainId, option.address)}>
											<i-icon name="external-link-alt" width={12} height={12} fill={colorText} class="inline-block" />
											<i-label caption="View Contract" font={{ size: '13.6px', color: colorText }} />
										</i-hstack> : []
								}
								{/* {
										campaign.showContractLink && isClaim ?
										<i-hstack gap={4} class="pointer" width="fit-content" verticalAlignment="center" onClick={() => viewOnExplorerByAddress(chainId, rewardsData[0].address)}>
											<i-icon name="external-link-alt" width={12} height={12} fill={colorText} class="inline-block" />
											<i-label caption="View Reward Contract" font={{ size: '13.6px', color: colorText }} />
										</i-hstack> : []
									} */}
							</i-vstack>
						</i-hstack>
						<i-vstack gap={8}>
							{claimStakedRow}
							{/* {
									await Promise.all(rewardOptions.map(async (rewardOption: any, idx: number) => {
										const rewardToken = this.getRewardToken(rewardOption.rewardTokenAddress);
										const rewardTokenDecimals = rewardToken.decimals || 18;
										const decimalsOffset = 18 - rewardTokenDecimals;
										let offset = decimalsOffset;
										if (rewardTokenDecimals !== 18 && lockedTokenDecimals !== 18) {
											offset = offset * 2;
										} else if (lockedTokenDecimals !== 18 && rewardTokenDecimals === 18) {
											offset = 18 - lockedTokenDecimals;
										}
										const earnedQty = formatNumber(new BigNumber(option.totalCredit).times(new BigNumber(rewardOption.multiplier)).shiftedBy(offset));
										const earnedSymbol = this.getRewardToken(rewardOption.rewardTokenAddress).symbol || '';
										const rewardElm = await HStack.create({ verticalAlignment: 'center', horizontalAlignment: 'space-between' });
										rewardElm.appendChild(<i-label caption="You Earned" font={{ size: '16px', color: colorText }} />);
										rewardElm.appendChild(<i-label caption={`${earnedQty} ${earnedSymbol}`} font={{ size: '16px', color: colorText }} />);
										return rewardElm;
									}))
								} */}
							<i-vstack verticalAlignment="center" horizontalAlignment="center">
								{manageStake}
							</i-vstack>
							{rowRewards}
						</i-vstack>
					</i-vstack>
				);
				return stakingElms[optionIdx];
			})
			);

			nodeItems.push(containerSection);
			containerSection.appendChild(
				<i-hstack background={{ color: colorCampaignBackground }} width="100%" height={maxHeight}>
					{stakingsElm}
				</i-hstack>
			)
		};
		this.stakingElm.clearInnerHTML();
		this.stakingElm.append(this.noCampaignSection, ...nodeItems);
	}

	render() {
		return (
			<i-scom-dapp-container id="dappContainer">
				<i-panel id="stakingComponent" class={stakingComponent} minHeight={200}>
					<i-panel id="stakingLayout" class="staking-layout" width={maxWidth} height={maxHeight} margin={{ top: '1rem', bottom: '1rem', left: 'auto', right: 'auto' }}>
						<i-vstack id="loadingElm" class="i-loading-overlay">
							<i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
								<i-icon
									class="i-loading-spinner_icon"
									image={{ url: Assets.fullPath('img/loading.svg'), width: 36, height: 36 }}
								/>
								<i-label
									caption="Loading..." font={{ color: '#FD4A4C', size: '1.5em' }}
									class="i-loading-spinner_text"
								/>
							</i-vstack>
						</i-vstack>
						<i-panel id="stakingElm" class="wrapper" />
					</i-panel>
					<i-panel id="manageStakeElm" />
					<i-scom-staking-config id="configDApp" visible={false} />
				</i-panel>
			</i-scom-dapp-container>
		)
	}
}
