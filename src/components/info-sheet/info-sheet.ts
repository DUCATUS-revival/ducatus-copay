import { Component, ViewChild } from '@angular/core';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { ActionSheetParent } from '../action-sheet/action-sheet-parent';
import { InfoSheetTemplate } from './info-sheet-template';

@Component({
  selector: 'info-sheet',
  templateUrl: 'info-sheet.html'
})
export class InfoSheetComponent extends ActionSheetParent {
  @ViewChild(InfoSheetTemplate)
  infoSheetTemplate: InfoSheetTemplate;
  constructor(private externalLinkProvider: ExternalLinkProvider) {
    super();
  }
  ngAfterViewInit() {
    this.infoSheetTemplate.onDismiss.subscribe(option => {
      this.dismiss(option);
    });
  }

  public openInBrowser(url) {
    this.externalLinkProvider.open(url);
    this.dismiss();
  }

  public optionClicked(option, item): void {
    this.dismiss(option, item);
  }
}

export const INFO_SHEET_COMPONENTS = [InfoSheetComponent, InfoSheetTemplate];
