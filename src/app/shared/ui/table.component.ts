import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-table-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-header.component.html',
  styleUrl: './table.component.css',
})
export class TableHeaderComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-table-body',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-body.component.html',
  styleUrl: './table.component.css',
})
export class TableBodyComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-table-row',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-row.component.html',
  styleUrl: './table.component.css',
})
export class TableRowComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-table-head',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-head.component.html',
  styleUrl: './table.component.css',
})
export class TableHeadComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-table-cell',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-cell.component.html',
  styleUrl: './table.component.css',
})
export class TableCellComponent {
  @Input() className = '';
  @Input() colSpan: number | string | undefined;
}
