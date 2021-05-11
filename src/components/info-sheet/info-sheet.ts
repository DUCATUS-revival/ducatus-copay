import { Component, ViewChild } from '@angular/core';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { ActionSheetParent } from '../action-sheet/action-sheet-parent';
import { InfoSheetTemplate } from './info-sheet-template';

@Component({
  selector: 'info-sheet',
  templateUrl: 'info-sheet.html'
})
export class InfoSheetComponent extends ActionSheetParent {
  @ViewChild(InfoSheetTemplate) infoSheetTemplate: InfoSheetTemplate;

  public savelist: any = {};

  constructor(private externalLinkProvider: ExternalLinkProvider) {
    super();
  }
  ngAfterViewInit() {
    this.infoSheetTemplate.onDismiss.subscribe(option => {
      this.dismiss(option);
    });
  }

  public filterList(ev: any) {
    let val = ev.target.value;

    if (!this.savelist.list) {
      this.savelist.list = this.params.list;
    }

    this.params.list = this.savelist.list.filter((item: { name: string }) => {
      return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }

  public openInBrowser(url) {
    this.externalLinkProvider.open(url);
    this.dismiss();
  }

  public optionClicked(option, item): void {
    this.savelist = {};
    this.dismiss(option, item);
  }
}

export const INFO_SHEET_COMPONENTS = [InfoSheetComponent, InfoSheetTemplate];
