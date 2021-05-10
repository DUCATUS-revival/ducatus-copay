import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetProvider } from '../../providers';

interface ITradeList {
  name: string;
  short: string;
  icon?: string;
}

interface ICoinItem {
  name: string;
  short: string;
  icon?: string;
  value?: number;
}

interface ICoin {
  from: ICoinItem;
  to: ICoinItem;
}

interface IPrice {
  [name: string]: number;
}

// * Basic list with Trade coins, update to load it via API, if it needed
// * Dont forget to create waiting loader for this API to show it in template
const tradeList: ITradeList[] = [
  { name: 'Binance', short: 'BNB' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Tether', short: 'USDT' },
  { name: 'Dai', short: 'DAI' },
  { name: 'Ripple', short: 'XRP' },
  { name: 'WDucatusX', short: 'WDUCX' }
];

// * Basic price for trade coin, update to load it via API, if it needed
// * Dont forget to create waiting loader for this API to show it in template
// * Price for 1 Selected (From) to price[To.short]
const price: IPrice = {
  WDUCX: 0.012,
  BNB: 0.08
};

const fixNumber = (x: number): number =>
  x.toString().includes('.')
    ? x
        .toString()
        .split('.')
        .pop().length
    : 0;

@Component({
  selector: 'page-dex',
  templateUrl: 'dex.html'
})
export class DexPage {
  public formGroup: FormGroup;
  public coin: ICoin = {} as ICoin;
  public price: IPrice = price;
  public inputType: string = 'from';

  constructor(
    private formBuilder: FormBuilder,
    private actionSheetProvider: ActionSheetProvider
  ) {
    this.formGroup = this.formBuilder.group({
      from: [
        34.55,
        Validators.compose([Validators.minLength(1), Validators.required])
      ],
      to: [
        0.44255,
        Validators.compose([Validators.minLength(1), Validators.required])
      ]
    });

    this.coin.from = this.findCoin('WDUCX');
    this.coin.to = this.findCoin('BNB');
  }

  private findCoin(shortName: string): ICoinItem {
    return tradeList.find((item: ITradeList) => item.short === shortName);
  }

  public selectInput(type: string): void {
    this.inputType = type;
  }

  public switchCoin(): void {
    const from = {
      coin: this.coin.from,
      value: this.formGroup.value.from,
      input: 'from'
    };

    this.coin.from = this.coin.to;
    this.formGroup.value.from = this.formGroup.value.to;

    this.coin.to = from.coin;
    this.formGroup.value.to = from.value;

    this.inputType = from.input;
    this.changeAmount(from.input);
  }

  public changeAmount(type: string): void {
    const rate = this.price[this.coin.to.short];

    if (type === 'from' && this.inputType === 'from') {
      const value = this.formGroup.value[type] * rate;
      const fix = fixNumber(value);
      this.formGroup.value.to = fix === 0 ? value : value.toFixed(fix);
    }

    if (type === 'to' && this.inputType === 'to') {
      const value = this.formGroup.value[type] / rate;
      const fix = fixNumber(value);
      this.formGroup.value.from = fix === 0 ? value : value.toFixed(fix);
    }
  }

  async openList(type: string) {
    const list = tradeList.filter(
      (item: ITradeList) => item.short !== this.coin[type].short
    );

    const rType = type === 'to' ? 'from' : 'to';

    const infoSheet = this.actionSheetProvider.createInfoSheet('dex-list', {
      list
    });

    infoSheet.present();
    infoSheet.onDidDismiss((option: ICoinItem) => {
      if (option) {
        if (this.coin[rType].name === option.name) {
          this.coin[rType].name = this.coin[type];
        }

        this.coin[type] = option;
      }
    });
  }
}
