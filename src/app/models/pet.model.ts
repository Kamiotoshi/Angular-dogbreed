// src/types/pet.model.ts - Angular version

/**
 * Category DTO - Đại diện cho category data từ API
 */
export interface CategoryDto {
  readonly id?: number;
  readonly name?: string;
}

/**
 * Tag DTO - Đại diện cho tag data từ API
 */
export interface TagDto {
  readonly id?: number;
  readonly name?: string;
}

/**
 * Pet Status - Union type cho trạng thái pet
 */
export type PetStatus = 'available' | 'pending' | 'sold';

/**
 * Pet DTO - Đại diện cho pet data từ Petstore API
 */
export interface PetDto {
  readonly id: number;
  readonly name?: string;
  readonly category?: CategoryDto;
  readonly photoUrls?: readonly string[];
  readonly tags?: readonly TagDto[];
  readonly status?: PetStatus;
}

/**
 * Items Per Page - Số lượng item hiển thị trên mỗi trang
 */
export type ItemsPerPage = 3 | 6 | 9;

/**
 * UI Filter State DTO - Quản lý state của filters
 */
export interface FilterStateDto {
  readonly status: PetStatus;
  readonly itemsPerPage: ItemsPerPage;
  readonly currentPage: number;
}

/**
 * API Error DTO
 */
export interface ApiErrorDto {
  readonly status: number;
  readonly message: string;
  readonly timestamp: string;
  readonly path?: string;
}

// Backward compatibility aliases (if needed)
export type Status = PetStatus;
export type Pet = PetDto;
