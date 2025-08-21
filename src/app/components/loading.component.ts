// src/components/loading/loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-center align-items-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span class="ms-2">Đang tải dữ liệu...</span>
    </div>
  `
})
export class LoadingSpinnerComponent {}

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="position-fixed top-0 start-0 w-100" style="z-index: 1050">
      <div class="progress" style="height: 3px">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated bg-success"
          style="width: 100%">
        </div>
      </div>
    </div>
  `
})
export class LoadingBarComponent {}
