import {
  FormatType,
  Options,
  optionsWithDefaults,
} from '@tgrosinger/md-advanced-tables';

export enum TableVerticalAlignment {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export const defaultSettings: Partial<ISettings> = {
  formatType: FormatType.NORMAL,
  showRibbonIcon: true,
  bindEnter: true,
  bindTab: true,
  verticalAlignment: TableVerticalAlignment.TOP,
  justifyText: false,
};

export interface ISettings {
  formatType: FormatType;
  showRibbonIcon: boolean;
  bindEnter: boolean;
  bindTab: boolean;
  verticalAlignment: TableVerticalAlignment;
  justifyText: boolean;
}

export class TableEditorPluginSettings implements ISettings {
  public formatType: FormatType;
  public showRibbonIcon: boolean;

  public bindEnter: boolean;
  public bindTab: boolean;

  public verticalAlignment: TableVerticalAlignment;
  public justifyText: boolean;

  constructor(loadedData: Partial<ISettings>) {
    const allFields = { ...defaultSettings, ...loadedData };
    this.formatType = allFields.formatType;
    this.showRibbonIcon = allFields.showRibbonIcon;
    this.bindEnter = allFields.bindEnter;
    this.bindTab = allFields.bindTab;
    this.verticalAlignment =
      allFields.verticalAlignment ?? TableVerticalAlignment.TOP;
    this.justifyText = allFields.justifyText ?? false;
  }

  public asOptions(): Options {
    return optionsWithDefaults({ formatType: this.formatType });
  }
}
