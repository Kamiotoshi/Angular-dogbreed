// src/components/pet-card/pet-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetDto, PetStatus } from '../models/pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100 shadow-sm"
         [style.transition]="'transform 0.2s'"
         (mouseenter)="onMouseEnter($event)"
         (mouseleave)="onMouseLeave($event)">

      <!-- Header với ID và menu -->
      <div class="card-header bg-white d-flex justify-content-between align-items-center border-bottom">
        <small class="text-muted fw-medium">{{ pet.id }}</small>
        <span class="text-muted" style="cursor: pointer">•••</span>
      </div>

      <!-- Pet Info Section -->
      <div class="card-body">
        <div class="d-flex align-items-center mb-3">
          <!-- Circular pet image -->
          <div class="rounded-circle overflow-hidden me-3 border"
               [style.width]="'60px'"
               [style.height]="'60px'"
               [style.min-width]="'60px'"
               [style.flex-shrink]="'0'">
            <img
              [src]="getCategoryImage(pet.category?.name)"
              [alt]="pet.name || 'Pet'"
              class="w-100 h-100"
              [style.object-fit]="'cover'">
          </div>

          <!-- Pet name và category -->
          <div class="flex-grow-1">
            <h5 class="card-title mb-1 fw-semibold" [style.font-size]="'1.1rem'">
              {{ pet.name || 'Không có tên' }}
            </h5>
            <small class="text-muted" [style.font-size]="'0.875rem'">
              {{ pet.category?.name || 'Không rõ loại' }}
            </small>
          </div>
        </div>

        <!-- Tags section -->
        <div class="mb-3">
          <small class="text-muted d-block mb-2">Thẻ:</small>
          <div *ngIf="pet.tags && pet.tags.length > 0; else noTags">
            <div class="d-flex flex-wrap gap-1">
              <span
                *ngFor="let tag of pet.tags.slice(0, 3)"
                class="badge bg-light text-success border"
                [style.font-size]="'0.7em'">
                {{ tag.name || 'Không rõ tag' }}
              </span>
              <span
                *ngIf="pet.tags.length > 3"
                class="badge bg-light text-success border"
                [style.font-size]="'0.7em'">
                +{{ pet.tags.length - 3 }}
              </span>
            </div>
          </div>
          <ng-template #noTags>
            <small class="text-muted">Không có thẻ</small>
          </ng-template>
        </div>

        <!-- Status -->
        <div class="mt-auto">
          <small class="text-muted d-block mb-2">Trạng thái:</small>
          <span [class]="'badge bg-' + statusColors[displayStatus] + ' text-white'">
            {{ statusLabels[displayStatus] }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class PetCardComponent {
  @Input() pet!: PetDto;

  readonly statusColors: Record<PetStatus, string> = {
    available: 'success',
    pending: 'warning',
    sold: 'danger'
  };

  readonly statusLabels: Record<PetStatus, string> = {
    available: 'Có sẵn',
    pending: 'Đang chờ',
    sold: 'Đã bán'
  };

  get displayStatus(): PetStatus {
    return this.pet.status || 'sold';
  }

  getCategoryImage(categoryName?: string): string {
    const defaultImage = "https://m.media-amazon.com/images/I/61E7E12FtBL._UF894,1000_QL80_.jpg";

    if (!categoryName) return defaultImage;

    const category = categoryName.toLowerCase();
    if (category.includes('dog')) return 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQpflckqTzo_CVJxHUPahKCrnIL3d2DIJn1ThfaalZfK682pUAn3mFidzfZM_yuLhNwHlLHRd_UkAVb_KZQfj4pnA';
    if (category.includes('cat')) return 'https://images.squarespace-cdn.com/content/v1/607f89e638219e13eee71b1e/1684821560422-SD5V37BAG28BURTLIXUQ/michael-sum-LEpfefQf4rU-unsplash.jpg';
    if (category.includes('bird')) return 'https://cdn.britannica.com/10/250610-050-BC5CCDAF/Zebra-finch-Taeniopygia-guttata-bird.jpg';
    if (category.includes('fish')) return 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?cs=srgb&dl=pexels-crisdip-35358-128756.jpg&fm=jpg';
    if (category.includes('rabbit')) return 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Oryctolagus_cuniculus_Rcdo.jpg';
    if (category.includes('guinea')) return 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/BigBead/what_to_know_about_house_mice_bigbead.jpg';

    return defaultImage;
  }

  onMouseEnter(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'translateY(-2px)';
  }

  onMouseLeave(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'translateY(0)';
  }
}
