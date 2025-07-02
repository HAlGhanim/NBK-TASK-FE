import { Injectable, computed, signal } from '@angular/core';
import { ToastMessage, ToastType } from '../../interfaces/toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<ToastMessage[]>([]);
  private idCounter = 0;
  toastSignal = computed(() => this.toasts());

  show(type: ToastType, message: string, duration = 3000) {
    const id = ++this.idCounter;
    this.toasts.update((toasts) => [...toasts, { id, type, message }]);
    setTimeout(() => {
      this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
    }, duration);
  }

  error(msg: string) {
    this.show(ToastType.error, msg, 5000);
  }

  success(msg: string) {
    this.show(ToastType.success, msg, 3000);
  }
}
