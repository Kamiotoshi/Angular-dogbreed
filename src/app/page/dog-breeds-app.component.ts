// src/components/dog-breeds-app/dog-breeds-app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest, BehaviorSubject, timer, of } from 'rxjs';
import { takeUntil, switchMap, catchError, tap, map, startWith } from 'rxjs/operators';

import { PetDto, PetStatus, ItemsPerPage, FilterStateDto } from '../models/pet.model';
import { PetService } from '../services/pet.service';
import { OnlineStatusService } from '../services/online-status.service';

import { LoadingSpinnerComponent, LoadingBarComponent } from '../components/loading.component';
import { ErrorAlertComponent, OfflineAlertComponent } from '../components/alerts.component';
import { PetCardComponent } from '../components/pet-card.component';
import { PaginationComponent } from '../components/pagination.component';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';

@Component({
  selector: 'app-dog-breeds-app',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    LoadingBarComponent,
    ErrorAlertComponent,
    OfflineAlertComponent,
    PetCardComponent,
    PaginationComponent,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div [style.min-height]="'100vh'" [style.display]="'flex'" [style.flex-direction]="'column'">
      <div [style.flex]="'1 0 auto'">
        <!-- Loading Bar -->
        <app-loading-bar *ngIf="loading || paginationLoading"></app-loading-bar>

        <!-- Header -->
        <app-header
          [isOnline]="isOnline"
          [currentStatus]="filterState.status"
          [loading]="loading"
          [itemsPerPage]="filterState.itemsPerPage"
          [totalItems]="filteredPets.length"
          (statusChange)="handleStatusChange($event)"
          (itemsPerPageChange)="handleItemsPerPageChange($event)">
        </app-header>

        <!-- Main Content -->
        <div class="container" [style.max-width]="'1200px'">
          <div class="py-4">
            <!-- Offline Alert -->
            <div *ngIf="!isOnline" class="mb-4">
              <app-offline-alert></app-offline-alert>
            </div>

            <!-- Error Alert -->
            <div *ngIf="error" class="mb-4">
              <app-error-alert
                [message]="error"
                [showRetry]="isOnline"
                (retry)="handleRetry()">
              </app-error-alert>
            </div>

            <!-- Loading Spinner -->
            <div *ngIf="loading" class="d-flex justify-content-center py-5">
              <app-loading-spinner></app-loading-spinner>
            </div>

            <!-- No Data State -->
            <div *ngIf="!loading && !error && filteredPets.length === 0" class="text-center py-5">
              <div [style.font-size]="'48px'" class="mb-3">🐾</div>
              <h4 class="mb-2 text-dark">Không có dữ liệu</h4>
              <p class="text-muted">Không tìm thấy động vật nào với trạng thái này.</p>
            </div>

            <!-- Pet Grid -->
            <div *ngIf="!loading && !error && currentPets.length > 0">
              <!-- Loading State for Pagination -->
              <div *ngIf="paginationLoading" class="d-flex justify-content-center py-5 w-100">
                <app-loading-spinner></app-loading-spinner>
              </div>

              <!-- Pet Cards -->
              <div *ngIf="!paginationLoading" class="row g-4 mb-4">
                <div *ngFor="let pet of currentPets; trackBy: trackByPetId"
                     class="col-lg-4 col-md-6 col-sm-12">
                  <app-pet-card [pet]="pet"></app-pet-card>
                </div>
              </div>

              <!-- Pagination -->
              <div class="d-flex justify-content-center">
                <app-pagination
                  [currentPage]="filterState.currentPage"
                  [totalPages]="totalPages"
                  [loading]="paginationLoading"
                  (pageChange)="handlePageChange($event)">
                </app-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <app-footer></app-footer>
    </div>
  `
})
export class DogBreedsAppComponent implements OnInit, OnDestroy {
  // Data states
  pets: PetDto[] = [];
  filteredPets: PetDto[] = [];

  // UI states
  loading = false;
  paginationLoading = false;
  error: string | null = null;
  isOnline = true;

  // Filter state
  filterState: FilterStateDto = {
    status: 'available',
    currentPage: 1,
    itemsPerPage: 6
  };

  // Subjects for reactive programming
  private destroy$ = new Subject<void>();
  private filterState$ = new BehaviorSubject<FilterStateDto>(this.filterState);
  private retryTrigger$ = new Subject<void>();

  constructor(
    private petService: PetService,
    private onlineStatusService: OnlineStatusService
  ) {}

  ngOnInit(): void {
    this.setupOnlineStatusSubscription();
    this.setupDataSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Computed properties
  get totalPages(): number {
    return Math.ceil(this.filteredPets.length / this.filterState.itemsPerPage);
  }

  get startIndex(): number {
    return (this.filterState.currentPage - 1) * this.filterState.itemsPerPage;
  }

  get endIndex(): number {
    return this.startIndex + this.filterState.itemsPerPage;
  }

  get currentPets(): PetDto[] {
    return this.filteredPets.slice(this.startIndex, this.endIndex);
  }

  // Setup subscriptions
  private setupOnlineStatusSubscription(): void {
    this.onlineStatusService.isOnline$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOnline => {
        this.isOnline = isOnline;
        if (!isOnline) {
          this.error = 'Không có kết nối mạng';
        } else if (this.error === 'Không có kết nối mạng') {
          this.error = null;
        }
      });
  }

  private setupDataSubscription(): void {
    // Combine filter state changes with retry triggers
    combineLatest([
      this.filterState$,
      this.retryTrigger$.pipe(
        startWith(null) // Start with initial load
      )
    ]).pipe(
      tap(() => {
        this.loading = true;
        this.error = null;
        this.pets = [];
        this.filteredPets = [];
      }),
      switchMap(([filterState]) => {
        if (!this.isOnline) {
          return of({ pets: [], error: 'Không có kết nối mạng' });
        }

        return this.petService.fetchPetsByStatus(filterState.status).pipe(
          map(pets => ({ pets, error: null })),
          catchError(err => {
            const message = err instanceof Error ? err.message : 'Có lỗi xảy ra';
            return of({ pets: [], error: message });
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(({ pets, error }) => {
      this.loading = false;

      if (error) {
        this.error = error;
        this.pets = [];
        this.filteredPets = [];
      } else {
        console.log(`Nhận ${pets.length} pet từ petService cho trạng thái ${this.filterState.status}`, pets);
        this.pets = pets;
        this.filteredPets = pets;
        console.log(`Đặt filteredPets: ${pets.length} pet`);
        this.error = null;
      }
    });
  }

  // Event handlers
  handleStatusChange(status: PetStatus): void {
    this.updateFilterState({
      ...this.filterState,
      status,
      currentPage: 1 // Reset về trang 1 khi thay đổi status
    });
  }

  async handlePageChange(page: number): Promise<void> {
    if (this.paginationLoading) return;

    this.paginationLoading = true;

    // Loading delay để thấy rõ hơn
    await timer(500).toPromise();

    this.updateFilterState({
      ...this.filterState,
      currentPage: page
    });

    this.paginationLoading = false;

    // Scroll to top với animation mượt
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleItemsPerPageChange(items: ItemsPerPage): void {
    this.updateFilterState({
      ...this.filterState,
      itemsPerPage: items,
      currentPage: 1 // Reset về trang 1 khi thay đổi items per page
    });
  }

  handleRetry(): void {
    this.retryTrigger$.next();
  }

  // Helper methods
  private updateFilterState(newState: FilterStateDto): void {
    this.filterState = newState;
    this.filterState$.next(newState);
  }

  trackByPetId(index: number, pet: PetDto): number {
    return pet.id;
  }
}
