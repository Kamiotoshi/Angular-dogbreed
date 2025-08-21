// src/services/online-status.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, fromEvent, merge, of, timer } from 'rxjs';
import { map, catchError, timeout, switchMap, startWith, debounceTime, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  private readonly testUrl = 'https://petstore.swagger.io/v2/pet/findByStatus?status=available'; // API để thử
  private readonly timeoutDuration = 1500; // Giảm timeout xuống 1.5 giây để phản hồi nhanh hơn
  private readonly checkInterval = 2000; // Kiểm tra mỗi 2 giây

  constructor(private http: HttpClient) {
    this.initializeOnlineStatus();
  }

  private initializeOnlineStatus(): void {
    // Listen to browser online/offline events với debounce
    const online$ = fromEvent(window, 'online').pipe(
      debounceTime(500),
      switchMap(() => this.checkConnectivity())
    );

    const offline$ = fromEvent(window, 'offline').pipe(
      debounceTime(500),
      map(() => false)
    );

    // Periodic check - kiểm tra định kỳ
    const periodicCheck$ = interval(this.checkInterval).pipe(
      startWith(0), // Chạy ngay lập tức khi khởi tạo
      switchMap(() => this.checkConnectivity())
    );

    // Merge tất cả các sources
    merge(offline$, online$, periodicCheck$).subscribe(isOnline => {
      if (this.isOnlineSubject.value !== isOnline) {
        console.log(`Network status changed: ${isOnline ? 'Online' : 'Offline'}`);
        this.isOnlineSubject.next(isOnline);
      }
    });
  }

  private checkConnectivity(): Observable<boolean> {
    // Thử gọi API, nếu timeout hoặc lỗi, báo offline
    return this.checkApiConnectivity().pipe(
      timeout(this.timeoutDuration),
      map(response => response.status >= 200 && response.status < 300), // Kiểm tra status code
      catchError((error) => {
        console.warn('Connectivity check failed (possibly timeout/CORS):', error.message);
        return of(false); // Báo offline nếu lỗi
      })
    );
  }

  private checkApiConnectivity(): Observable<{ status: number }> {
    return this.http.get(this.testUrl, { observe: 'response' }).pipe(
      take(1), // Chỉ lấy lần thử đầu tiên
      map(response => ({ status: response.status })) // Trả về object với status
    );
  }
}
