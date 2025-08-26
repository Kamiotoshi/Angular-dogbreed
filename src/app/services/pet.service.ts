import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import {PetDto, PetStatus, ApiErrorDto, CategoryDto, TagDto} from '../models/pet.model';

interface RawPetData {
  id: number;
  name?: string;
  category?: { id?: number; name?: string };
  photoUrls?: string[];
  tags?: Array<{ id?: number; name?: string }>;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly baseUrl = 'https://petstore.swagger.io/v2';
  private readonly timeoutMs = 8000;

  constructor(private http: HttpClient) {}

  fetchPetsByStatus(status: PetStatus): Observable<PetDto[]> {
    return this.http
      .get<unknown>(`${this.baseUrl}/pet/findByStatus?status=${status}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      .pipe(
        timeout(this.timeoutMs),
        map((data) => {
          console.log(`API returned ${status}: ${Array.isArray(data) ? data.length : 0} pets`, data);
          return this.validateAndTransformPets(data);
        }),
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            return throwError(() => new Error('Request timeout - Connection too slow'));
          }
          if (error.status) {
            return throwError(() => new Error(this.createApiError(error).message));
          }
          return throwError(() => new Error('Unable to fetch data'));
        })
      );
  }

  private validateAndTransformPets(data: unknown): PetDto[] {
    if (!Array.isArray(data)) {
      console.warn('API response is not an array:', data);
      return [];
    }

    return data
      .filter((item): item is RawPetData => this.isValidPetData(item))
      .map((rawPet) => this.transformToPetDto(rawPet));
  }

  private isValidPetData(item: unknown): item is RawPetData {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      typeof (item as RawPetData).id === 'number'
    );
  }

  private transformToPetDto(rawPet: RawPetData): PetDto {
    return {
      id: rawPet.id,
      name: rawPet.name,
      category: this.transformCategory(rawPet.category),
      photoUrls: Array.isArray(rawPet.photoUrls) ? rawPet.photoUrls : undefined,
      tags: this.transformTags(rawPet.tags),
      status: this.validateStatus(rawPet.status)
    };
  }

  private transformCategory(category?: RawPetData['category']): CategoryDto | undefined {
    if (!category) return undefined;
    return { id: category.id, name: category.name };
  }

  private transformTags(tags?: RawPetData['tags']): readonly TagDto[] | undefined {
    if (!Array.isArray(tags)) return undefined;
    return tags.map((tag) => ({ id: tag.id, name: tag.name }));
  }

  private validateStatus(status: unknown): PetStatus | undefined {
    const validStatuses: PetStatus[] = ['available', 'pending', 'sold'];
    return typeof status === 'string' && validStatuses.includes(status as PetStatus)
      ? status as PetStatus
      : undefined;
  }

  private createApiError(error: any): ApiErrorDto {
    return {
      status: error.status || 500,
      message: `HTTP error! status: ${error.status || 'Unknown'}`,
      timestamp: new Date().toISOString(),
      path: error.url || this.baseUrl
    };
  }
}
