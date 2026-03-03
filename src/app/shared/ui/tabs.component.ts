import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'ui-tabs-list',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsListComponent {
  @Input() tabs: string[] = [];
  @Input() activeTab = '';
  @Input() className = '';
  @Output() activeTabChange = new EventEmitter<string>();

  selectTab(tab: string) {
    this.activeTab = tab;
    this.activeTabChange.emit(tab);
  }
}
