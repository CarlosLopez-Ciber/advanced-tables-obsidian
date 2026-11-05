import { ObsidianTextEditor } from './obsidian-text-editor';
import { TableEditorPluginSettings } from './settings';
import {
  Alignment,
  SortOrder,
  TableEditor as MTEEditor,
} from '@tgrosinger/md-advanced-tables';
import { App, Editor, Modal, Notice, TFile } from 'obsidian';

export class TableEditor {
  private readonly app: App;
  private readonly settings: TableEditorPluginSettings;
  private readonly editor: Editor;
  private readonly mte: MTEEditor;

  constructor(
    app: App,
    file: TFile,
    editor: Editor,
    settings: TableEditorPluginSettings,
  ) {
    this.app = app;
    this.settings = settings;
    this.editor = editor;

    const ote = new ObsidianTextEditor(app, file, editor);
    this.mte = new MTEEditor(ote);
  }

  public readonly cursorIsInTableFormula = (): boolean =>
    this.mte.cursorIsInTableFormula(this.settings.asOptions());

  public readonly cursorIsInTable = (): boolean =>
    this.mte.cursorIsInTable(this.settings.asOptions());

  public readonly nextCell = (): void => {
    this.mte.nextCell(this.settings.asOptions());
  };

  public readonly previousCell = (): void => {
    this.mte.previousCell(this.settings.asOptions());
  };

  public readonly nextRow = (): void => {
    this.mte.nextRow(this.settings.asOptions());
  };

  public readonly formatTable = (): void => {
    this.mte.format(this.settings.asOptions());
  };

  public readonly formatAllTables = (): void => {
    this.mte.formatAll(this.settings.asOptions());
  };

  public readonly insertColumn = (): void => {
    this.mte.insertColumn(this.settings.asOptions());
  };

  public readonly insertRow = (): void => {
    this.mte.insertRow(this.settings.asOptions());
  };

  public readonly leftAlignColumn = (): void => {
    this.mte.alignColumn(Alignment.LEFT, this.settings.asOptions());
  };

  public readonly centerAlignColumn = (): void => {
    this.mte.alignColumn(Alignment.CENTER, this.settings.asOptions());
  };

  public readonly rightAlignColumn = (): void => {
    this.mte.alignColumn(Alignment.RIGHT, this.settings.asOptions());
  };

  public readonly moveColumnLeft = (): void => {
    this.mte.moveColumn(-1, this.settings.asOptions());
  };

  public readonly moveColumnRight = (): void => {
    this.mte.moveColumn(1, this.settings.asOptions());
  };

  public readonly moveRowUp = (): void => {
    this.mte.moveRow(-1, this.settings.asOptions());
  };

  public readonly moveRowDown = (): void => {
    this.mte.moveRow(1, this.settings.asOptions());
  };

  public readonly deleteColumn = (): void => {
    this.mte.deleteColumn(this.settings.asOptions());
  };

  public readonly deleteRow = (): void => {
    this.mte.deleteRow(this.settings.asOptions());
  };

  public readonly sortRowsAsc = (): void => {
    this.mte.sortRows(SortOrder.Ascending, this.settings.asOptions());
  };

  public readonly sortRowsDesc = (): void => {
    this.mte.sortRows(SortOrder.Descending, this.settings.asOptions());
  };

  public readonly transpose = (): void => {
    this.mte.transpose(this.settings.asOptions());
  };

  public readonly escape = (): void => {
    this.mte.escape(this.settings.asOptions());
  };

  public readonly evaluateFormulas = (): void => {
    const err = this.mte.evaluateFormulas(this.settings.asOptions());
    if (err) {
      new Notice(err.message);
    }
  };

  public readonly exportCSVModal = (): void => {
    new CSVModal(this.app, this.mte, this.settings).open();
  };

  public readonly setTableVerticalAlignment = (
    align: 'top' | 'middle' | 'bottom',
  ): void => {
    if (!this.cursorIsInTable()) {
      return;
    }

    const pos = this.editor.getCursor();
    const line = this.editor.getLine(pos.line);
    if (this.isDelimiterRow(line)) {
      return;
    }

    const cells = this.parseRowCells(line);
    const cell = cells.find((c) => pos.ch >= c.start && pos.ch <= c.end);
    if (!cell) {
      return;
    }

    const current = this.parseCellFormatting(cell.trimmed);
    const newVAlign = current.valign === align ? 'top' : align;
    const newCellText = this.formatCell(
      current.content,
      current.justify,
      newVAlign,
    );

    const newLine =
      line.slice(0, cell.start) + ' ' + newCellText + ' ' + line.slice(cell.end);
    this.editor.setLine(pos.line, newLine);
    this.formatTable();
  };

  public readonly toggleTableJustify = (): void => {
    if (!this.cursorIsInTable()) {
      return;
    }

    const pos = this.editor.getCursor();
    const line = this.editor.getLine(pos.line);
    if (this.isDelimiterRow(line)) {
      return;
    }

    const cells = this.parseRowCells(line);
    const cell = cells.find((c) => pos.ch >= c.start && pos.ch <= c.end);
    if (!cell) {
      return;
    }

    const current = this.parseCellFormatting(cell.trimmed);
    const newCellText = this.formatCell(
      current.content,
      !current.justify,
      current.valign,
    );

    const newLine =
      line.slice(0, cell.start) + ' ' + newCellText + ' ' + line.slice(cell.end);
    this.editor.setLine(pos.line, newLine);
    this.formatTable();
  };

  private readonly parseCellFormatting = (
    cellText: string,
  ): {
    content: string;
    justify: boolean;
    valign: 'top' | 'middle' | 'bottom';
  } => {
    let content = cellText.trim();
    let justify = false;
    let valign: 'top' | 'middle' | 'bottom' = 'top';

    const divMatch = content.match(/^<div\s+([^>]*?)>([\s\S]*?)<\/div>$/i);
    if (divMatch) {
      const attrs = divMatch[1];
      const inner = divMatch[2].trim();

      if (
        /text-align:\s*justify/i.test(attrs) ||
        /align=["']justify["']/i.test(attrs)
      ) {
        justify = true;
      }
      if (/align-items:\s*center/i.test(attrs)) {
        valign = 'middle';
      } else if (/align-items:\s*flex-end/i.test(attrs)) {
        valign = 'bottom';
      }

      const innerMatch = inner.match(/^<div\s+([^>]*?)>([\s\S]*?)<\/div>$/i);
      if (innerMatch) {
        const innerAttrs = innerMatch[1];
        if (
          /text-align:\s*justify/i.test(innerAttrs) ||
          /align=["']justify["']/i.test(innerAttrs)
        ) {
          justify = true;
        }
        if (/align-items:\s*center/i.test(innerAttrs)) {
          valign = 'middle';
        } else if (/align-items:\s*flex-end/i.test(innerAttrs)) {
          valign = 'bottom';
        }
        content = innerMatch[2].trim();
      } else {
        content = inner;
      }
    }

    return { content, justify, valign };
  };

  private readonly formatCell = (
    content: string,
    justify: boolean,
    valign: 'top' | 'middle' | 'bottom',
  ): string => {
    const styles: string[] = [];
    if (valign === 'middle') {
      styles.push(
        'display: flex;',
        'align-items: center;',
        'min-height: 100%;',
      );
    } else if (valign === 'bottom') {
      styles.push(
        'display: flex;',
        'align-items: flex-end;',
        'min-height: 100%;',
      );
    }

    if (justify) {
      styles.push('text-align: justify;');
    }

    if (styles.length === 0) {
      return content;
    }

    return `<div style="${styles.join(' ')}">${content}</div>`;
  };

  private readonly isDelimiterRow = (line: string): boolean =>
    /^\s*\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)*\|?\s*$/.test(line);

  private readonly parseRowCells = (
    line: string,
  ): { start: number; end: number; raw: string; trimmed: string }[] => {
    const pipes: number[] = [];
    let inEscape = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '\\') {
        inEscape = !inEscape;
      } else if (line[i] === '|' && !inEscape) {
        pipes.push(i);
      } else {
        inEscape = false;
      }
    }

    if (pipes.length < 2) {
      return [];
    }

    const cells: {
      start: number;
      end: number;
      raw: string;
      trimmed: string;
    }[] = [];
    for (let i = 0; i < pipes.length - 1; i++) {
      const start = pipes[i] + 1;
      const end = pipes[i + 1];
      const raw = line.slice(start, end);
      cells.push({ start, end, raw, trimmed: raw.trim() });
    }

    return cells;
  };
}

class CSVModal extends Modal {
  private readonly mte: MTEEditor;
  private readonly settings: TableEditorPluginSettings;

  constructor(app: App, mte: MTEEditor, settings: TableEditorPluginSettings) {
    super(app);
    this.mte = mte;
    this.settings = settings;
  }

  public onOpen(): void {
    const { contentEl } = this;
    const div = contentEl.createDiv({
      cls: 'advanced-tables-csv-export',
    });

    const ta = div.createEl('textarea', {
      attr: {
        readonly: true,
      },
    });
    ta.value = this.mte.exportCSV(true, this.settings.asOptions());
    ta.onClickEvent(() => ta.select());

    const lb = div.createEl('label');
    const cb = lb.createEl('input', {
      type: 'checkbox',
      attr: {
        checked: true,
      },
    });
    lb.createSpan().setText('Include table headers');
    cb.onClickEvent(() => {
      ta.value = this.mte.exportCSV(cb.checked, this.settings.asOptions());
    });
  }

  public onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
  }
}
