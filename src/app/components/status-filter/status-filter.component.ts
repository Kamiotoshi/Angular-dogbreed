// src/components/status-filter/status-filter.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetStatus, ItemsPerPage } from '../../types';
import { ItemsSelectorComponent } from '../items-selector/items-selector.component';

@Component({
  selector: 'app-status-filter',
  standalone: true,
  imports: [CommonModule, ItemsSelectorComponent],
  template: `
    <div class="d-flex align-items-center gap-2 gap-md-3 flex-wrap flex-sm-nowrap">
      <!-- Status filter buttons -->
      <div class="btn-group" role="group"
           [style.background-color]="'#f8f9fa'"
           [style.padding]="'2px'"
           [style.border-radius]="'6px'"
           [style.border]="'1px solid #dee2e6'"
           [style.flex-shrink]="'0'">

        <button
          *ngFor="let status of statusList"
          type="button"
          class="btn btn-sm border-0"
          [class.text-white]="currentStatus === status"
          [class.text-muted]="currentStatus !== status"
          [ngClass]="getStatusButtonClass(status)"
          (click)="onStatusChange(status)"
          [disabled]="loading"
          [style.font-size]="'0.75rem'"
          [style.padding]="'4px 8px'"
          [style.background-color]="getStatusBackgroundColor(status)"
          [style.min-width]="'0'"
          [style.white-space]="'nowrap'">

          <span
            *ngIf="loading && currentStatus === status"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true">
          </span>

          <!-- Responsive text -->
          <span class="d-none d-sm-inline">{{ statusLabels[status] }}</span>
          <span class="d-inline d-sm-none">{{ getShortLabel(status) }}</span>
        </button>
      </div>

      <!-- Items per page selector -->
      <app-items-selector
        [value]="itemsPerPage"
        [disabled]="loading"
        (valueChange)="onItemsPerPageChange($event)">
      </app-items-selector>
    </div>
  `
})
export class StatusFilterComponent {
  @Input() currentStatus: PetStatus = 'available';
  @Input() loading: boolean = false;
  @Input() itemsPerPage: ItemsPerPage = 6;
  @Input() totalItems: number = 0;

  @Output() statusChange = new EventEmitter<PetStatus>();
  @Output() itemsPerPageChange = new EventEmitter<ItemsPerPage>();

  readonly statusList: PetStatus[] = ['available', 'pending', 'sold'];

  readonly statusLabels: Record<PetStatus, string> = {
    available: 'Có sẵn',
    pending: 'Đang chờ',
    sold: 'Đã bán'
  };

  readonly statusButtonClass: Record<PetStatus, string> = {
    available: 'btn-success',
    pending: 'btn-warning',
    sold: 'btn-danger'
  };

  onStatusChange(status: PetStatus): void {
    this.statusChange.emit(status);
  }

  onItemsPerPageChange(items: ItemsPerPage): void {
    this.itemsPerPageChange.emit(items);
  }

  getStatusButtonClass(status: PetStatus): string {
    return this.currentStatus === status ? this.statusButtonClass[status] : 'btn-light';
  }

  getStatusBackgroundColor(status: PetStatus): string {
    if (this.currentStatus !== status) return 'transparent';

    switch (status) {
      case 'available': return '#28a745';
      case 'pending': return '#ffc107';
      case 'sold': return '#dc3545';
      default: return 'transparent';
    }
  }

  getShortLabel(status: PetStatus): string {
    switch (status) {
      case 'available': return 'Sẵn';
      case 'pending': return 'Chờ';
      case 'sold': return 'Bán';
      default: return '';
    }
  }
}
