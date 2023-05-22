import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomStaking from '@scom/scom-staking';

@customModule
export default class Module1 extends Module {
    private stakingElm: ScomStaking;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{ top: '1rem', left: '1rem' }} gap="2rem">
                <i-scom-staking data={{
                    "chainId": 43113,
                    "customName": "Scom-Staking",
                    "customDesc": "Earn OSWAP",
                    "showContractLink": true,
                    "stakings":
                    {
                        "address": "0x502b66fAf0E2Bd91A07378B1859b2943f5F4B784",
                        "lockTokenType": 0,
                        "rewards":
                        {
                            "address": "0x2ccE686D3dC032377E66058Aad9e93b2FA8De8a2",
                            "isCommonStartDate": false,
                        }
                    },
                    "commissions": [
                        {
                            "chainId": 43113,
                            "walletAddress": '0xA81961100920df22CF98703155029822f2F7f033',
                            "share": '0.01'
                        }
                    ],
                    "networks": [
                        {
                          "chainId": 43113
                        },
                        {
                          "chainId": 97
                        }
                    ],
                    "wallets": [
                        {
                          "name": "metamask"
                        }
                    ]
                }} />
            </i-hstack>
        </i-panel>
    }
}