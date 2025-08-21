// src/components/items-selector/items-selector.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemsPerPage } from '../types';

@Component({
  selector: 'app-items-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="position-relative"
      [style.border]="'1px solid #dee2e6'"
      [style.border-radius]="'6px'"
      [style.background-color]="'white'"
      [style.flex-shrink]="'0'"
      [style.opacity]="disabled ? '0.6' : '1'">

      <select
        class="form-select border-0"
        [value]="value"
        [disabled]="disabled"
        (change)="onSelectionChange($event)"
        [style.background]="'transparent'"
        [style.font-size]="'0.75rem'"
        [style.min-width]="'50px'"
        [style.padding]="'4px 20px 4px 8px'"
        [style.appearance]="'none'"
        [style.outline]="'none'"
        [style.cursor]="disabled ? 'not-allowed' : 'pointer'">

        <option value="3">3 mục</option>
        <option value="6">6 mục</option>
        <option value="9">9 mục</option>
        <option value="20">20 mục</option>
      </select>

      <!-- Custom dropdown arrow -->
      <div [style.position]="'absolute'"
           [style.right]="'6px'"
           [style.top]="'50%'"
           [style.transform]="'translateY(-50%)'"
           [style.pointer-events]="'none'"
           [style.font-size]="'0.6rem'"
           [style.color]="disabled ? '#adb5bd' : '#6c757d'">
        ▼
      </div>
    </div>
  `
})
export class ItemsSelectorComponent {
  @Input() value: ItemsPerPage = 6;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<ItemsPerPage>();

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newValue = Number(target.value) as ItemsPerPage;
    this.valueChange.emit(newValue);
  }
}
