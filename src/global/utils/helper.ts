import { BigNumber } from "@ijstech/eth-wallet";
import { moment } from '@ijstech/components';
import { TokenMapType } from './common';

export enum SITE_ENV {
  DEV = 'dev',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export const explorerTxUrlsByChainId: { [key: number]: string } = {
  1: 'https://etherscan.io/tx/',
  4: 'https://rinkeby.etherscan.io/tx/',
  42: 'https://kovan.etherscan.io/tx/',
  56: 'https://bscscan.com/tx/',
  97: 'https://testnet.bscscan.com/tx/',
  43113: 'https://testnet.snowtrace.io/tx/',
  43114: 'https://snowtrace.io/tx/',
  137: 'https://polygonscan.com/tx/',
  80001: 'https://mumbai.polygonscan.com/tx/',
  250: 'https://ftmscan.com/tx/',
  4002: 'https://testnet.ftmscan.com/tx/',
  13370: 'https://aminoxtestnet.blockscout.alphacarbon.network/tx/',
  421613: 'https://goerli.arbiscan.io/tx/'
}

export const explorerAddressUrlsByChainId: {[key: number]: string} = {
  1: 'https://etherscan.io/address/',
  4: 'https://rinkeby.etherscan.io/address/',
  42: 'https://kovan.etherscan.io/address/',
  97: 'https://testnet.bscscan.com/address/',
  56: 'https://bscscan.com/address/',
  43113: 'https://testnet.snowtrace.io/address/',
  43114: 'https://snowtrace.io/address/',
  137: 'https://polygonscan.com/address/',
  80001: 'https://mumbai.polygonscan.com/address/',
  250: 'https://ftmscan.com/address/',
  4002: 'https://testnet.ftmscan.com/address/',
  13370: 'https://aminoxtestnet.blockscout.alphacarbon.network/address/',
  421613: 'https://goerli.arbiscan.io/address/'
}

export const DefaultDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';
export const DefaultDateFormat = 'DD/MM/YYYY';

export const formatDate = (date: any, customType?: string, showTimezone?: boolean) => {
  const formatType = customType || DefaultDateFormat;
  const formatted = moment(date).format(formatType);
  if (showTimezone) {
    return `${formatted} (UTC+${moment().utcOffset() / 60})`;
  }
  return formatted;
}

export const formatUTCDate = (date: any, customType?: string, showTimezone?: boolean) => {
  const formatType = customType || DefaultDateFormat;
  const formatted = moment(date).utc().format(formatType);
  return showTimezone?  `${formatted} (UTC)` : formatted;
}

export const compareDate = (fromDate: any, toDate?: any) => {
  if (!toDate) {
    toDate = moment();
  }
  return moment(fromDate).isSameOrBefore(toDate);
}

export const formatNumber = (value: any, decimals?: number) => {
  let val = value;
  const minValue = '0.0000001';
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  if (val != 0 && new BigNumber(val).lt(minValue)) {
    return `<${minValue}`;
  }
  return formatNumberWithSeparators(val, decimals || 4);
};

export const formatPercentNumber = (value: any, decimals?: number) => {
  let val = value;
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  return formatNumberWithSeparators(val, decimals || 2);
};

export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision) {
    let outputStr = '';
    if (value >= 1) {
      const unit = Math.pow(10, precision);
      const rounded = Math.floor(value * unit) / unit;
      outputStr = rounded.toLocaleString('en-US', { maximumFractionDigits: precision });
    }
    else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }

    if (outputStr.length > 18) {
      outputStr = outputStr.substr(0, 18) + '...'
    }
    return outputStr;
    // let parts = parseFloat(value.toPrecision(precision)).toString().split(".");
    // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // return parts.join(".");
  }
  else {
    return value.toLocaleString('en-US');
    // let parts = value.toString().split(".");
    // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // return parts.join(".");
  }
}

export const isValidNumber = (value: string | number) => {
  const val = new BigNumber(value);
  return val.gte(0);
}

export const isInvalidInput = (val: any) => {
  const value = new BigNumber(val);
  if (value.lt(0)) return true;
  return (val || '').toString().substring(0, 2) === '00' || val === '-';
};

export const limitInputNumber = (input: any, decimals?: number) => {
  const amount = input.value;
  if (isInvalidInput(amount)) {
    input.value = '0';
    return;
  }
  if (!new BigNumber(amount).isNaN()) {
    input.value = limitDecimals(amount, decimals || 18);
  }
}

export const limitDecimals = (value: any, decimals: number) => {
  let val = value;
  if (typeof value !== 'string') {
    val = val.toString();
  }
  let chart;
  if (val.includes('.')) {
    chart = '.';
  } else if (val.includes(',')) {
    chart = ',';
  } else {
    return value;
  }
  const parts = val.split(chart);
  let decimalsPart = parts[1];
  if (decimalsPart && decimalsPart.length > decimals) {
    parts[1] = decimalsPart.substr(0, decimals);
  }
  return parts.join(chart);
}

export async function getAPI(url:string, paramsObj?: any): Promise<any> {
  let queries = '';
  if (paramsObj) {
      try {
          queries = new URLSearchParams(paramsObj).toString();
      } catch(err) {
          console.log('err', err)
      }
  }
  let fullURL = url + (queries ? `?${queries}` : '');
  const response = await fetch(fullURL, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
  });
  return response.json();
}

export const toWeiInv = (n: string, unit?: number) => {
  if (new BigNumber(n).eq(0)) return new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'); 
  return new BigNumber('1').shiftedBy((unit || 18)*2).idiv(new BigNumber(n).shiftedBy(unit || 18));
}

export const padLeft = function(string: string, chars: number, sign?: string){
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
}

export const numberToBytes32 = (value: any, prefix?: string) => {
  if (!value) return;
  let v = value;
  if (typeof value == "number") {
    // covert to a hex string
    v = value.toString(16);
  } else if (/^[0-9]*$/.test(value)) {
    // assuming value to be a decimal number, value could be a hex
    v = new BigNumber(value).toString(16);
  } else if (/^(0x)?[0-9A-Fa-f]*$/.test(value)) {
    // value already a hex
    v = value;
  } else if (BigNumber.isBigNumber(value)) {
    v = value.toString(16);
  }
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = '0x' + v
  return v;
}

export const getParamsFromUrl = () => {
  const startIdx = window.location.href.indexOf("?");
  const search = window.location.href.substring(startIdx, window.location.href.length)
  const queryString = search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}

export const formatNumberValue = (data: any, tokenMap: TokenMapType) => {
  const { title, value, symbol, icon, prefix, isWrapped } = data;
  try {
    let limitDecimals = 18;
    if (symbol) {
      let symb = symbol;
      if (symb.includes('/')) {
        symb = symb.split('/')[0];
      }
      if (symbol === 'USD') {
        limitDecimals = 2;
      } else {
        const tokenObj = Object.values(tokenMap).find((token: any) => token.symbol === symb) as any;
        if (tokenObj) {
          limitDecimals = tokenObj.decimals || 18;
        }
      }
    }
    const val = parseFloat(value);
    const minValue = 0.0001;
    let result;
    let tooltip = `${value}`;
    if (val === 0) {
      result = `0`;
    } else if (val < minValue) {
      if (prefix === '$') {
        result = `< ${prefix}${minValue}`;
      } else if (prefix) {
        result = `${prefix.replace('=', '')} < ${minValue}`;
      } else {
        result = `< ${minValue}`;
      }
      tooltip = val.toLocaleString('en-US', { maximumFractionDigits: limitDecimals });
    } else {
      const stringValue = value.toString();
      const decimalsIndex = stringValue.indexOf('.');
      const length = decimalsIndex < 0 ? stringValue.length : stringValue.length - 1;
      let valueFormatted = val.toLocaleString('en-US', { maximumFractionDigits: limitDecimals });
      const arr = valueFormatted.split('.');
      valueFormatted = arr[0];
      if (arr[1]) {
        valueFormatted = `${arr[0]}.${arr[1].substr(0, 4)}`;
      }
      if (length <= 7) {
        result = valueFormatted;
      } else if (decimalsIndex > 7) {
        result = `${valueFormatted.substr(0, 9)}...`;
      } else if (decimalsIndex > -1) {
        result = valueFormatted;
      } else {
        const finalVal = valueFormatted.substr(0, 13);
        result = `${finalVal}${length > 10 ? '...' : ''}`;
      }
      if (result.length > 20 && !result.includes('...')) {
        result = `${result.substr(0, 13)}...`;
      }

      // Format value for the tooltip
      const parts = stringValue.split('.');
      const intVal = parseInt(parts[0]).toLocaleString('en-US');
      tooltip = `${intVal}`;
      if (parts[1]) {
        let decVal = parts[1];
        if (parts[1].length > limitDecimals) {
          decVal = parseFloat(`0.${parts[1]}`).toLocaleString('en-US', { maximumFractionDigits: limitDecimals });
          if (decVal == 1) {
            decVal = parts[1].substr(0, limitDecimals);
          } else {
            decVal = decVal.substr(2);
          }
        }
        tooltip += `.${decVal}`;
      }
    }
    if (icon) {
      result += ` <img width="20" src="${icon}" style="padding-bottom: 0.15rem" />`;
    }
    if (symbol) {
      result += ` ${symbol}`;
      tooltip += ` ${symbol}`;
    }
    if (prefix) {
      result = `${val < minValue ? '' : prefix}${result}`;
      tooltip = `${prefix}${tooltip}`;
    }
    if (title) {
      result = `${title}: ${result}`;
    }
    if (isWrapped) {
      result = `(${result})`;
    }
    if (symbol === 'USD') {
      return result;
    } else {
      return { result, tooltip }
    }
  } catch {
    return '-';
  }
}

export const uniqWith = (array: any[], compareFn: (cur: any, oth: any) => boolean) => {
  const unique: any = [];
  for (const cur of array) {
    const isDuplicate = unique.some((oth: any) => compareFn(cur, oth));
    if (!isDuplicate) unique.push(cur);
  }
  return unique;
}

export const getWeekDays = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  let days = [];
  let day = d;
  for (let i = 0; i < 7; i++) {
    days.push(day.setDate(day.getDate() + 1));
  }
  return days;
}

export const renderBalanceTooltip = (params: any, tokenMap: TokenMapType, isBold?: boolean) => {
  const data = formatNumberValue(params, tokenMap);
  if (typeof data === "object") {
    const { result, tooltip } = data;
    if (isBold) {
      return `<i-label class="bold" tooltip='${JSON.stringify({ content: tooltip })}'>${result}</i-label>`
    }
    return `<i-label tooltip='${JSON.stringify({ content: tooltip })}'>${result}</i-label>`;
  }
  return data;
}

const replacer = (key: string, value: any) => {
  if (['minLockTime', 'campaignStart', 'campaignEnd', 'perAddressCap', 'maxTotalLock', 'multiplier', 'initialReward', 'vestingPeriod', 'claimDeadline', 'vestingStartDate', 'rewardAmount', 'value'].includes(key)) {
    const val = Number(value);
    return isNaN(val) ? value : val;
  }
  return value;
}

export const downloadJsonFile = (name: string, obj: any) => {
  const link = document.createElement("a");
  const text = JSON.stringify(obj, replacer, 2);
  link.download = name;
  const jsonContent = `data:application/json;charset=utf-8,${encodeURIComponent(text)}`;
  link.href = jsonContent;
  link.click();
}

export const viewOnExplorerByTxHash = (chainId: number, txHash: string) => {
  if (explorerTxUrlsByChainId[chainId]) {
    let url = `${explorerTxUrlsByChainId[chainId]}${txHash}`;
    window.open(url);
  }
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  if (explorerAddressUrlsByChainId[chainId]) {
    let url = `${explorerAddressUrlsByChainId[chainId]}${address}`;
    window.open(url);
  }
}

export function isWalletAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}