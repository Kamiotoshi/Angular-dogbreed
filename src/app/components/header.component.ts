// src/components/header/header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wifi, WifiOff } from 'lucide-angular';
import { PetStatus, ItemsPerPage } from '../types';
import { StatusFilterComponent } from './status-filter.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StatusFilterComponent],
  template: `
    <div class="bg-white border-bottom">
      <!-- Container với padding để thẳng hàng với cards -->
      <div class="container" [style.width]="'100%'" [style.max-width]="'1200px'">
        <div class="row py-3">
          <div class="col-12">
            <!-- Top nav with logo and nav links -->
            <div class="d-flex align-items-center justify-content-between mb-3">
              <!-- Logo and nav links -->
              <div class="d-flex align-items-center flex-nowrap">
                <span class="me-3" [style.font-size]="'24px'">🐾</span>
                <nav class="d-flex gap-4">
                  <button
                    class="btn btn-link text-decoration-none p-0"
                    [class.text-success]="currentStatus === 'available'"
                    [class.fw-semibold]="currentStatus === 'available'"
                    [class.text-muted]="currentStatus !== 'available'"
                    (click)="onStatusChange('available')">
                    Có sẵn
                  </button>
                  <button
                    class="btn btn-link text-decoration-none p-0"
                    [class.text-warning]="currentStatus === 'pending'"
                    [class.fw-semibold]="currentStatus === 'pending'"
                    [class.text-muted]="currentStatus !== 'pending'"
                    (click)="onStatusChange('pending')">
                    Đang chờ
                  </button>
                  <button
                    class="btn btn-link text-decoration-none p-0"
                    [class.text-danger]="currentStatus === 'sold'"
                    [class.fw-semibold]="currentStatus === 'sold'"
                    [class.text-muted]="currentStatus !== 'sold'"
                    (click)="onStatusChange('sold')">
                    Đã bán
                  </button>
                </nav>
              </div>

              <!-- Online status -->
              <div class="d-flex align-items-center">
                <div *ngIf="isOnline" class="d-flex align-items-center text-success">
                  <lucide-icon [img]="Wifi" [size]="16" class="me-2"></lucide-icon>
                  <small>Online</small>
                </div>
                <div *ngIf="!isOnline" class="d-flex align-items-center text-warning">
                  <lucide-icon [img]="WifiOff" [size]="16" class="me-2"></lucide-icon>
                  <small>Offline</small>
                </div>
              </div>
            </div>

            <!-- Page title and filters -->
            <div class="d-flex align-items-center justify-content-between">
              <h1 class="h4 mb-0">
                Động vật {{ statusLabels[currentStatus] }}
              </h1>

              <!-- Filter section -->
              <div class="d-flex align-items-center gap-3" style="max-width: 300px; flex-shrink: 1;">
                <app-status-filter
                  [currentStatus]="currentStatus"
                  [loading]="loading"
                  [itemsPerPage]="itemsPerPage"
                  [totalItems]="totalItems"
                  (statusChange)="onStatusChange($event)"
                  (itemsPerPageChange)="onItemsPerPageChange($event)">
                </app-status-filter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeaderComponent {
  @Input() isOnline: boolean = true;
  @Input() currentStatus: PetStatus = 'available';
  @Input() loading: boolean = false;
  @Input() itemsPerPage: ItemsPerPage = 6;
  @Input() totalItems: number = 0;

  @Output() statusChange = new EventEmitter<PetStatus>();
  @Output() itemsPerPageChange = new EventEmitter<ItemsPerPage>();

  readonly Wifi = Wifi;
  readonly WifiOff = WifiOff;

  readonly statusLabels: Record<PetStatus, string> = {
    available: 'có sẵn',
    pending: 'đang chờ',
    sold: 'đã bán'
  };

  onStatusChange(status: PetStatus): void {
    this.statusChange.emit(status);
  }

  onItemsPerPageChange(items: ItemsPerPage): void {
    this.itemsPerPageChange.emit(items);
  }
}
