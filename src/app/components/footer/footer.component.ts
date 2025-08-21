// src/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white border-top mt-5" [style.flex-shrink]="'0'">
      <div class="container" [style.max-width]="'1200px'">
        <div class="py-4">
          <div class="d-flex justify-content-between align-items-center flex-wrap">
            <div class="d-flex gap-4">
              <a href="#" class="text-muted text-decoration-none small">
                Tài nguyên
              </a>
              <a href="#" class="text-muted text-decoration-none small">
                Công ty
              </a>
            </div>
            <div class="d-flex gap-3 align-items-center">
              <a href="#" class="text-muted text-decoration-none fs-5">
                📘
              </a>
              <a href="#" class="text-muted text-decoration-none fs-5">
                🦋
              </a>
              <a href="#" class="text-muted text-decoration-none fs-5">
                💼
              </a>
            </div>
          </div>
          <div class="mt-3 d-flex align-items-center gap-2">
            <small class="text-muted">Made with 💙 Visily</small>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
