import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        class="notification"
        *ngFor="let notification of notifications"
        [ngClass]="notification.type"
      >
        <div class="notification-icon">
          <svg
            *ngIf="notification.type === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
          </svg>
          <svg
            *ngIf="notification.type === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
            />
          </svg>
          <svg
            *ngIf="notification.type === 'info'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z"
            />
          </svg>
        </div>
        <p class="notification-message">{{ notification.message }}</p>
        <button class="notification-close" (click)="close(notification.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .notification-container {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .notification {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 320px;
        max-width: 480px;
        padding: 16px 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid;
        animation: slideIn 0.3s ease-out;
      }

      .notification.success {
        border-left-color: #00cc66;
      }

      .notification.error {
        border-left-color: #ff4444;
      }

      .notification.info {
        border-left-color: #5112ff;
      }

      .notification-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
      }

      .notification.success .notification-icon {
        color: #00cc66;
      }

      .notification.error .notification-icon {
        color: #ff4444;
      }

      .notification.info .notification-icon {
        color: #5112ff;
      }

      .notification-message {
        flex: 1;
        margin: 0;
        color: #1a1a1a;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
      }

      .notification-close {
        flex-shrink: 0;
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .notification-close:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #666;
      }

      @media (max-width: 768px) {
        .notification-container {
          top: 16px;
          right: 16px;
          left: 16px;
        }

        .notification {
          min-width: auto;
          max-width: none;
        }
      }
    `,
  ],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  close(id: number): void {
    this.notificationService.hide(id);
  }
}
