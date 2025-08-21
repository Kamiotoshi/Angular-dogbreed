// src/services/online-status.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, fromEvent, merge, of } from 'rxjs';
import { map, catchError, timeout, switchMap, startWith, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  private readonly petStoreApiUrl = '/v2/pet/findByStatus?status=available'; // Sử dụng proxy path
  private readonly timeoutDuration = 5000; // Timeout 5 giây
  private readonly checkInterval = 10000; // Check mỗi 10 giây

  constructor(private http: HttpClient) {
    this.initializeOnlineStatus();
  }

  private initializeOnlineStatus(): void {
    // Listen to browser online/offline events với debounce để tránh spam
    const online$ = fromEvent(window, 'online').pipe(
      debounceTime(500),
      map(() => true)
    );

    const offline$ = fromEvent(window, 'offline').pipe(
      debounceTime(500),
      map(() => false)
    );

    // Periodic check - kiểm tra định kỳ
    const periodicCheck$ = interval(this.checkInterval).pipe(
      startWith(0), // Chạy ngay lập tức khi khởi tạo
      switchMap(() => this.checkRealConnectivity())
    );

    // Merge tất cả các sources
    merge(
      offline$, // Ưu tiên offline event trước
      online$.pipe(
        // Khi browser báo online, kiểm tra thực tế
        switchMap(() => this.checkRealConnectivity())
      ),
      periodicCheck$
    ).subscribe(isOnline => {
      if (this.isOnlineSubject.value !== isOnline) {
        console.log(`Network status changed: ${isOnline ? 'Online' : 'Offline'}`);
        this.isOnlineSubject.next(isOnline);
      }
    });
  }

  /**
   * Kiểm tra kết nối thực tế bằng cách:
   * 1. Kiểm tra navigator.onLine trước
   * 2. Nếu online, thử gọi API PetStore để verify
   */
  private checkRealConnectivity(): Observable<boolean> {
    // Nếu browser báo offline thì return false luôn
    if (!navigator.onLine) {
      console.log('Navigator reports offline');
      return of(false);
    }

    // Nếu browser báo online, kiểm tra thực tế bằng API call
    return this.checkApiConnectivity().pipe(
      catchError((error) => {
        console.warn('API connectivity check failed:', error.message);
        return of(false);
      })
    );
  }

  /**
   * Kiểm tra kết nối API thực tế
   * Sử dụng GET request đơn giản
   */
  private checkApiConnectivity(): Observable<boolean> {
    return this.http.get(this.petStoreApiUrl, { responseType: 'text' }).pipe( // Sử dụng text để tránh parsing JSON
      timeout(this.timeoutDuration),
      map(() => true), // Nếu không lỗi, coi như kết nối thành công
      catchError((error) => {
        console.warn('API request failed:', error.message);
        return of(false);
      })
    );
  }
}
