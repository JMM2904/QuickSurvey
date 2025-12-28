import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationSubject.asObservable();
  private notificationId = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const id = ++this.notificationId;
    const notification: Notification = { id, message, type };

    const currentNotifications = this.notificationSubject.value;
    this.notificationSubject.next([...currentNotifications, notification]);

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      this.hide(id);
    }, 3000);
  }

  hide(id: number): void {
    const currentNotifications = this.notificationSubject.value;
    this.notificationSubject.next(currentNotifications.filter((n) => n.id !== id));
  }
}
