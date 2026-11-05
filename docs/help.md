# Advanced Tables Help

The Advanced Tables plugin for Obsidian adds a lot of new features to editing
Markdown tables within Obsidian, while maintaining full compatibility
with Markdown.

As commonly ask questions arise they will be added below:

## Using Formulas in Markdown Tables

Formulas are written on the line immediately following the table. For more
information on the formula syntax please take a look at [this
document](https://github.com/tgrosinger/md-advanced-tables/blob/main/docs/formulas.md)
which contains detailed explanation and helpful examples.

<https://github.com/tgrosinger/md-advanced-tables/blob/main/docs/formulas.md>

Evaluating formulas is done using the formulas button in the toolbar.

![evaluate formulas button](https://raw.githubusercontent.com/tgrosinger/advanced-tables-obsidian/main/resources/screenshots/evaluate-formulas-button.png)

## Sorting Rows

When using the sort option in the toolbar, the sort will be performed based
on the column the cursor is currently in.

## Table Vertical Alignment and Justification

Advanced Tables supports customizing both the vertical alignment of table cells (top, middle/center, bottom) and text justification (inter-word text alignment) within tables.

### 3-Tier Hierarchy

Alignment and justification settings are resolved through a three-tier hierarchy:

1. **Per-Cell (Highest Precedence)**:
   You can format individual table cells using the Table Controls sidebar toolbar buttons:
   - **Align: Justify** (button beside Left, Center, and Right alignment)
   - **Valign: Top, Center, Bottom** buttons

   Alternatively, use the command palette actions:
   - `Advanced Tables: Set table vertical alignment to center`
   - `Advanced Tables: Set table vertical alignment to top`
   - `Advanced Tables: Set table vertical alignment to bottom`
   - `Advanced Tables: Toggle table text justification`

   Applying these actions cleanly formats the active cell using standard inline Markdown/HTML wrappers (`<div style="...">`), ensuring 100% GFM compatibility and immediate rendering without external comment lines. Pressing the button again toggles the format back to plain text.

2. **Per-Note**:
   To apply vertical alignment or justification to all tables within a specific note, add the corresponding CSS class to the note's frontmatter YAML:
   ```yaml
   ---
   cssclasses: [table-valign-middle, table-justify]
   ---
   ```
   Supported classes:
   - Vertical alignment: `table-valign-top`, `table-valign-middle` (or `table-valign-center`), `table-valign-bottom`
   - Justification: `table-justify`

3. **Global (Default Fallback)**:
   You can set global defaults across your entire vault in Obsidian **Settings** > **Advanced Tables**:
   - **Default table cell vertical alignment**: Choose between *Top (Default)*, *Middle / Center*, or *Bottom*.
   - **Justify table cell text**: Enable or disable table cell text justification globally.

When multiple levels are specified, **Per-Cell** wrappers override **Per-Note** frontmatter classes, which in turn override **Global** settings.

### 100% Markdown Compatibility

Standard GitHub Flavored Markdown (GFM) tables only define delimiter rows (`| :--- | :---: | ---: |`) for column alignment. To preserve complete interoperability across all Markdown tools, Git hosting platforms (GitHub, GitLab), and Obsidian themes, cell formatting uses standard inline HTML wrappers without introducing non-standard syntax or external comments.

## Additional Questions

If you have additional questions which are not covered here, please [create
an issue](https://github.com/tgrosinger/advanced-tables-obsidian/issues/new/choose),
or reach out to me directly on the Obsidian discord. My username is
tgrosinger.
