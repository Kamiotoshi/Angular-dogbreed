// src/components/alerts/alerts.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertCircle, WifiOff } from 'lucide-angular';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="alert alert-danger d-flex align-items-center" role="alert">
      <lucide-icon [img]="AlertCircle" [size]="20" class="me-2"></lucide-icon>
      <div class="flex-grow-1">{{ message }}</div>
      <button
        *ngIf="showRetry"
        class="btn btn-outline-danger btn-sm ms-2"
        (click)="onRetryClick()">
        Thử lại
      </button>
    </div>
  `
})
export class ErrorAlertComponent {
  @Input() message: string = '';
  @Input() showRetry: boolean = false;
  @Output() retry = new EventEmitter<void>();

  readonly AlertCircle = AlertCircle;

  onRetryClick(): void {
    this.retry.emit();
  }
}

@Component({
  selector: 'app-offline-alert',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="alert alert-warning d-flex align-items-center" role="alert">
      <lucide-icon [img]="WifiOff" [size]="20" class="me-2"></lucide-icon>
      <span>Bạn đang offline. Vui lòng kiểm tra kết nối mạng.</span>
    </div>
  `
})
export class OfflineAlertComponent {
  readonly WifiOff = WifiOff;
}
