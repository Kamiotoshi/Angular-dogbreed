// src/components/pagination/pagination.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [style.display]="'flex'"
         [style.flex-direction]="'column'"
         [style.align-items]="'center'"
         [style.gap]="'16px'"
         [style.margin-top]="'32px'">

      <nav *ngIf="totalPages > 1">
        <ul [style.list-style]="'none'"
            [style.display]="'flex'"
            [style.align-items]="'center'"
            [style.gap]="'4px'"
            [style.padding]="'0'"
            [style.margin]="'0'"
            [style.flex-wrap]="'wrap'"
            [style.justify-content]="'center'">

          <!-- Previous Button -->
          <li>
            <button
              type="button"
              class="page-nav-btn"
              (click)="onPageClick(currentPage - 1)"
              [disabled]="currentPage === 1 || loading"
              [style.padding]="'8px 12px'"
              [style.background]="'transparent'"
              [style.border]="'1px solid transparent'"
              [style.color]="(currentPage === 1 || loading) ? '#ccc' : '#666'"
              [style.cursor]="(currentPage === 1 || loading) ? 'not-allowed' : 'pointer'"
              [style.opacity]="loading ? '0.7' : '1'"
              [style.display]="'flex'"
              [style.align-items]="'center'"
              [style.gap]="'4px'"
              [style.font-size]="'14px'"
              [style.font-weight]="'500'"
              [style.transition]="'background-color 0.2s ease'">

              <span [style.font-size]="'18px'">‹</span>
              <span class="d-none d-sm-inline">Previous</span>
              <span class="d-inline d-sm-none">Prev</span>
            </button>
          </li>

          <!-- Page Numbers -->
          <li *ngFor="let page of getVisiblePages(); trackBy: trackByPage">
            <span *ngIf="isPageString(page)"
                  [style.padding]="'8px 4px'"
                  [style.color]="'#999'"
                  [style.font-size]="'14px'">
              ...
            </span>

            <button *ngIf="!isPageString(page)"
                    type="button"
                    (click)="onPageClick(getPageAsNumber(page))"
                    [disabled]="loading"
                    [style.padding]="'8px 12px'"
                    [style.border-radius]="'6px'"
                    [style.border]="currentPage === page ? '1px solid #ccc' : '1px solid transparent'"
                    [style.background-color]="'white'"
                    [style.color]="'#000'"
                    [style.font-weight]="currentPage === page ? '600' : '500'"
                    [style.cursor]="(currentPage === page || loading) ? 'default' : 'pointer'"
                    [style.opacity]="loading ? '0.7' : '1'"
                    [style.display]="'flex'"
                    [style.align-items]="'center'"
                    [style.justify-content]="'center'"
                    [style.min-width]="'36px'"
                    [style.min-height]="'36px'"
                    [style.font-size]="'14px'"
                    [style.transition]="'border-color 0.2s ease, box-shadow 0.2s ease'"
                    [style.box-shadow]="'none'">

              <div *ngIf="loading && currentPage === page"
                   [style.width]="'16px'"
                   [style.height]="'16px'"
                   [style.border]="'2px solid rgba(0,0,0,0.3)'"
                   [style.border-top]="'2px solid black'"
                   [style.border-radius]="'50%'"
                   [style.animation]="'spin 1s linear infinite'">
              </div>

              <span *ngIf="!(loading && currentPage === page)">{{ page }}</span>
            </button>
          </li>

          <!-- Next Button -->
          <li>
            <button
              type="button"
              class="page-nav-btn"
              (click)="onPageClick(currentPage + 1)"
              [disabled]="currentPage === totalPages || loading"
              [style.padding]="'8px 12px'"
              [style.background]="'transparent'"
              [style.border]="'1px solid transparent'"
              [style.color]="(currentPage === totalPages || loading) ? '#ccc' : '#666'"
              [style.cursor]="(currentPage === totalPages || loading) ? 'not-allowed' : 'pointer'"
              [style.opacity]="loading ? '0.7' : '1'"
              [style.display]="'flex'"
              [style.align-items]="'center'"
              [style.gap]="'4px'"
              [style.font-size]="'14px'"
              [style.font-weight]="'500'"
              [style.transition]="'background-color 0.2s ease'">

              <span class="d-none d-sm-inline">Next</span>
              <span class="d-inline d-sm-none">Next</span>
              <span [style.font-size]="'18px'">›</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .page-nav-btn {
      border: 1px solid transparent;
    }

    .page-nav-btn:not(:disabled):hover {
      border: 1px solid #007bff;
      border-radius: 6px;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() loading: boolean = false;

  @Output() pageChange = new EventEmitter<number>();

  getVisiblePages(): (number | string)[] {
    const delta = 1;
    const rangeWithDots: (number | string)[] = [];

    // Nếu totalPages <= 5, hiển thị tất cả
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        rangeWithDots.push(i);
      }
      return rangeWithDots;
    }

    // Case 1: Current page gần đầu (1, 2, 3)
    if (this.currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push('...');
      rangeWithDots.push(this.totalPages);
      return rangeWithDots;
    }

    // Case 2: Current page gần cuối
    if (this.currentPage >= this.totalPages - 2) {
      rangeWithDots.push(1);
      rangeWithDots.push('...');
      for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
        rangeWithDots.push(i);
      }
      return rangeWithDots;
    }

    // Case 3: Current page ở giữa
    rangeWithDots.push(1);
    rangeWithDots.push('...');
    for (let i = this.currentPage - delta; i <= this.currentPage + delta; i++) {
      rangeWithDots.push(i);
    }
    rangeWithDots.push('...');
    rangeWithDots.push(this.totalPages);

    return rangeWithDots;
  }

  onPageClick(page: number): void {
    if (this.loading || this.currentPage === page || page < 1 || page > this.totalPages) {
      return;
    }
    this.pageChange.emit(page);
  }

  trackByPage(index: number, item: number | string): any {
    return item;
  }

  isPageString(page: number | string): boolean {
    return typeof page === 'string';
  }

  getPageAsNumber(page: number | string): number {
    return typeof page === 'number' ? page : parseInt(page, 10);
  }
}
